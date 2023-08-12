---
title: esbuild plugin development
date: '2023-04-28'
tags: ['Web Development']
summary: esbuild plugin
---

现在的项目在编译期做了大部分的事情，整个 bundler 是基于 esbuild 自研的，最近都在搞工具链编译期的事情，被搞得很麻，水一篇文章整理一下 esbuild plugin 开发相关的内容。

# What is esbuild

来自 esbuild 官网：https://esbuild.github.io/

> An extremely fast bundler for the web

esbuild 是一个 bundler，内部原生支持 js、ts、css、jsx 的编译打包，其最大的特点就是**快**，可以从官网的图中看出：
![esbuild-01](/static/resources/23-03-esbuild-plugin-develop/esbuild-01.png)

esbuild 的配置可以在官网找到，这里不做赘述。

esbuild 虽然 bundle 的过程非常快但是 esbuild 的作者本身不希望让 esbuild 作为类似 webpack 一样大而全（臃肿）的 bundler，esbuild 本身支持的 bundle 能力有限，通常就是从 entry-point 一路打包出 js、css bundle 文件，对于 Code splitting 等等更进一步的功能目前在 roadmap 上并未较好的支持，对于 loader 目前内置支持的 content type 有：

- js、ts、jsx
- css
- json
- text
- base64
- binary
- data url
- external

对于不支持的文件类型或者新增的一些编译期的能力，就需要通过 plugin 来外部实现：

# esbuild plugin

在开始之前可以先简单介绍一下相关的背景，因为目前业界的跨端框架大多数都是以 js 为基础的代码（可能有一些新的文件格式比如微信小程序的 wxml、wxss），在打包对应的业务代码的时候需要在编译期进行大量的编译逻辑转换和处理，bundler 类似 webpack 的全 js 代码的 bundler 在扩展性上可能会做的很好，但是在业务代码非常数量多的情况下每次编译启动时间非常慢，所以我们内部切换到 esbuild 处理 js bundle 的过程，大大减少编译期耗时。

这里其实有一个问题：esbuild 上面介绍过不是很好支持 Code splitting 等等 webpack 早就支持的能力，也不好做一些编译期的分析操作这个是怎么解决的？这里其实参考 webpack 内部将 moduleGraph、outputChunk 等等在编译的各个合适的阶段维护起来就好了（说起来简单实际上工作量不小）

esbuild plugin 代码结构如下：

```javascript
let examplePlugin = {
  name: 'example',
  setup(build) {
    // Redirect all paths starting with "images/" to "./public/images/"
    build.onResolve({ filter: /^images\// }, (args) => {
      return { path: path.join(args.resolveDir, 'public', args.path) }
    })

    // Mark all paths starting with "http://" or "https://" as external
    build.onResolve({ filter: /^https?:\/\// }, (args) => {
      return { path: args.path, external: true }
    })

    build.onLoad({ filter: /\.txt$/ }, async (args) => {
      let text = await fs.promises.readFile(args.path, 'utf8')
      return {
        contents: JSON.stringify(text.split(/\s+/)),
        loader: 'json',
      }
    })
  },
}
```

build 是 esbuild 在编译期间的实例，上面提供了一些回调函数，在不同的时机会触发不同的函数，主要是：

- onResolve：resolve 一个文件路径，在加载文件之前，可以在这里决定当前文件的 loader
- onLoad：加载文件内容，可以在这里处理得到新的文件内容返回给 esbuild 去 bundle

当 esbuild 通过 entry-point 开始加载解析 js 文件的时候，会处理 require 和 import 引入的模块，然后触发对应文件的 resolve 回调，根据*resolve 回调的结果*触发 load 回调，这就给了我们自定义行为的能力，官网上的例子就非常好说明如何自定义加载一个 http 的 module：

http module 实例代码如下：

```javascript
import { zip } from 'https://unpkg.com/lodash-es@4.17.15/lodash.js'
console.log(zip([1, 2], ['a', 'b']))
```

正常的编译器是会按照 node module 的查找逻辑去查找这个 module 可能的本地文件路径是否存在，https 的肯定在本地是找不到的，所以正常是会返回的无法找到对应模块文件的异常出来，我们通过 esbuild 的插件能力就可以更改这个 module 的获取方式，代码如下：

```javascript
import * as esbuild from 'esbuild'
import https from 'node:https'
import http from 'node:http'
let httpPlugin = {
  name: 'http',
  setup(build) {
    build.onResolve({ filter: /^https?:\/\// }, (args) => ({
      path: args.path,
      namespace: 'http-url',
    }))

    build.onResolve({ filter: /.*/, namespace: 'http-url' }, (args) => ({
      path: new URL(args.path, args.importer).toString(),
      namespace: 'http-url',
    }))

    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args) => {
      let contents = await new Promise((resolve, reject) => {
        function fetch(url) {
          console.log(`Downloading: ${url}`)
          let lib = url.startsWith('https') ? https : http
          let req = lib
            .get(url, (res) => {
              if ([301, 302, 307].includes(res.statusCode)) {
                fetch(new URL(res.headers.location, url).toString())
                req.abort()
              } else if (res.statusCode === 200) {
                let chunks = []
                res.on('data', (chunk) => chunks.push(chunk))
                res.on('end', () => resolve(Buffer.concat(chunks)))
              } else {
                reject(new Error(`GET ${url} failed: status ${res.statusCode}`))
              }
            })
            .on('error', reject)
        }
        fetch(args.path)
      })
      return { contents }
    })
  },
}
```

- 第一个 resolve 拦截到 import 为 http 的 module，将其 namespace 改为 `http-url`，这里要重点介绍一下 namespace 的作用：

通常 bundler 在打包的时候的文件都是在本地读取的，但是也有一些情况下会是来自*“虚空”*，比如上面插件从网络获取的文件内容，甚至是在编译期间我们自己的代码生成的（我这里大部分属于这种 case），也就是本地是不存在这个文件路径的，这就会导致如果不告诉 bundler 这个文件不要读取本地资源的话，打包过程中就会报错，因为文件不存在读取不到，esbuild 里面通过 namespace 来创造一个虚拟（virtual）的模块，namespace 默认情况下是 `file`，会从本地文件系统中查找和加载对应的内容，当我们更改 namespace 之后，我们要自己处理虚拟模块的 resolve 和 load 的逻辑。

- 第二个 resolve 是处理 http-url 这 module 里面的可能的 import 或 require 语句
- 当执行 load 回调的时候我们就需要返回真正的文件内容跟到 esbuild 去打包，上面的插件就使用 http 加载到对应的资源内容，返回一个包含对象给到 esbuild。可以在返回的 result 中指定对应的 loader 来控制 esbuild 对当前 contents 的打包。

具体 load 回调需要返回的内容见：[on-load-results](https://esbuild.github.io/plugins/#on-load-results)
