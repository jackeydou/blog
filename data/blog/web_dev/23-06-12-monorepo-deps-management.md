---
title: Monorepo dependencies management
date: '2023-06-12'
tags: ['Web Development']
summary: 前端项目越来越复杂，现在经手的所有项目几乎都是以 monorepo 的形式组织代码的，相比多个 repo，monorepo 的一个好处是项目的依赖可以在同一个 repo 下通过 workspace 关联起来，但是这可能会带来一些 dependency 管理的问题。最近在做一些编译工具链代码优化整理和拆分，正好记录一下前端 monorepo 的依赖管理的一些思考。
---

前端项目越来越复杂，现在经手的所有项目几乎都是以 monorepo 的形式组织代码的，相比多个 repo，monorepo 的一个好处是项目的依赖可以在同一个 repo 下通过 workspace 关联起来，但是这可能会带来一些 dependency 管理的问题。

最近在做一些编译工具链代码优化整理和拆分，正好记录一下前端 monorepo 的依赖管理的一些思考。

# multi repo 是的依赖是怎么管理的

multi repo 因为单个仓库只有一个 package.json 文件，项目的依赖全部集中到这个一个 package.json 中定义，其实相对来讲不太需要考虑 dependency 是怎么引入的（换句话说就是你怎么往里 package.json 里面塞都差不多那样，假设我们的项目最终要用 bundler 打包到一份或多份 js 文件中），当然我们可以将依赖进一步划分代码依赖的会 bundle 到 js 文件中的放到 dependencies 中，和 dev 开发相关的放到 devDependencies 中，在 [npm doc](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file)中也可以找到 dependency 和 devDependency 的对比。

- "dependencies": Packages required by your application in production.
- "devDependencies": Packages that are only needed for local development and testing.

但这更像是规范上的定义，实际上 dependencies 和 devDependencies 在 install 的时候都会全部安装到本地 node_modules 下，所以如果你的代码依赖了 devDependencies 下的 package，一样会 bundle 到生产环境。

如果你当前的仓库是一个 library，你可能还要考虑其他依赖的兼容性，这时候还要使用 [peerDependencies](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#peerdependencies).

以 `react-redux` 这个库的 [package.json](https://github.com/reduxjs/react-redux/blob/master/package.json) 为例:

```javascript
{
  "peerDependencies": {
    "@types/react": "^16.8 || ^17.0 || ^18.0",
    "@types/react-dom": "^16.8 || ^17.0 || ^18.0",
    "react": "^16.8 || ^17.0 || ^18.0",
    "react-dom": "^16.8 || ^17.0 || ^18.0",
    "react-native": ">=0.59",
    "redux": "^4 || ^5.0.0-beta.0"
  },
  "dependencies": {
    "@babel/runtime": "^7.12.1",
    "hoist-non-react-statics": "^3.3.2",
    "react-is": "^18.0.0",
    // ...
  },
  "devDependencies": {
    "@babel/cli": "^7.12.1",
    "@babel/core": "^7.12.3",
    //...
  }
}
```

`react-redux` 因为一定要依赖`react`运行时，但是它自己肯定不能直接在 install dependency 的时候去装一个 react，这样可能会导致用户 node_modules 中有两个 react 运行时，导致一些不可知的问题，所以使用 peerDependencies + 版本限制（`"^16.8 || ^17.0 || ^18.0"`）来约束用户安装 react 并且使用满足自己的要求的 react 版本。

## multi repo 如何做本地调试

multi repo 之间的调试相比 monorepo 会更复杂一些，不同仓库之间的依赖要通过[npm link](https://docs.npmjs.com/cli/v9/commands/npm-link)来建立：

- `npm link` 会将当前所在目录的 package 创建一个 symbol link 到 npm 全局目录下
- 在需要使用当前 package 的项目下执行 `npm link [your_package_name]`

或者直接 `npm link [path/to/local/package]`

# monorepo

[Monorepo](https://en.wikipedia.org/wiki/Monorepo) 是将原本多个仓库放到单个仓库中维护。

这意味着 monorepo 中可能有直接部署到生产环境的项目和这个项目依赖的一些工具库，他们在自己的目录下有自己的 package.json，可以自己独立发布。

一个 monorepo 下的目录结构可能如下：

```
- packages
  - app1 // 发布到生产环境
    - src
    - package.json
  - app2 // 发布到生产环境
    - src
    - package.json
  - lib1 // internal
    - src
    - package.json
  - lib2 // 发布到npm
    - src
    - package.json
- package.json
```

前端社区中有一些 Monorepo 的解决方案，比如：lerna、rush、pnpm workspace、turborepo，个人比较喜欢 pnpm workspace，因为他足够精简并且是 pnpm 原生支持，有一种“大道至简”的感觉。在 monorepo 内部 package 之间的依赖为了方便调试我们经常会将内部 package 的版本依赖设置成`workspace:*`，例：

```
{
  "name": "project-a"
  "dependencies": {
    "project-b": "workspace:*"

  }
}

{
  "name": "project-b"
  "version": "1.0.2",
  "dependencies": {
  }
}
```

pnpm 很方便的帮我们在发布阶段更新这些`workspace`的版本到具体的版本，[文档传送](https://pnpm.io/workspaces#publishing-workspace-packages)

## monorepo 可能有更复杂的依赖关系

在维护项目过程中会经常遇到这种 case：

1. 我们通过 monorepo 维护我们的项目 A，项目 A 发布给其他人使用
2. 项目 A 依赖了 monorepo 里面的项目 B、C、D，项目 B、C 也发布到 npm（有其他的场景需要使用），项目 D 只在 monorepo 里面各个项目中被引用
3. B 项目也依赖 C 项目
4. 这些项目发布前需要都需要 bundle 成一个 js 文件后发布

我们 A、B、C、D 项目之间这种依赖关系 dependencies 该怎么维护？

- C 项目不依赖其他项目，直接发布到 NPM 即可；
- B 依赖 C，B 发布方式有两种可能：
  - B 直接将 C bundle 到自己的 output.js 代码中后发布；
  - B 在 bundle 的时候忽略 C，在运行时 `require("C")`;
- A 依赖 B、C、D，因为 D 是内部依赖，D 可以直接 bundle 到最终的 output.js 文件中，对于 B 和 C 这里要稍作考量：
  - 考虑下 C 项目：因为 B 也依赖 C，所以这里最理想的情况就是 A 和 B 最终用到同一个 C 的代码，也就是说 B 不能将 C bundle 到自己的 output 中，所以 C 在 B 项目中要以一个上面的方案 2（也就是 require 的方式）使用，那 A 对于 C 的依赖方式也就确定了，也是 `require` 的方式;
  - 考虑下 B 项目：A 在 bundle 的时候是否要将 B 一起 bundle 进去我觉得需要具体情况具体分析，这决定了用户在使用 A 的时候在安装依赖的时候是否要同时安装 B（A 把 B bundle 进去就不需要再安装 B，反之需要）

怎么控制是否将某个 package 打包到当前 output 还是保留 require 方式呢？主流的 bundler 都支持 external 来控制一个模块是否需要被 bundle：

- [webpack external](https://webpack.js.org/configuration/externals/)
- [rollup external](https://rollupjs.org/configuration-options/#external)
- [esbuild external](https://esbuild.github.io/api/#external)

设置了 external 之后，bundler 会忽略设置的 package，保留一个 require，所以这也要求用户在使用的时候一定要保证该 package 被 install 到了自己的项目中。
