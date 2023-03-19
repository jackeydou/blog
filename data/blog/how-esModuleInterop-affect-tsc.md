---
title: esModuleInterop是如何影响tsc的
date: '2022-10-04'
tags: ['Web Development']
draft: false
summary: '本文尝试从 CommonJS 和 ES Module 两者规范的差异，详细说明该配置是如何影响 tsc 编译结果的。'
---

本文尝试从 CommonJS 和 ES Module 两者规范的差异，详细说明该配置是如何影响 tsc 编译结果的。

## 背景：从一个意外的问题说起

`tsconfig`有个配置项`esModuleInterop: boolean`，它会影响 typescript 在编译时如何处理模块加载。该配置修改后(false -> true) 导致图片上传代码报错，报错部分代码摘要如下：

```tsx
import * as TPS from '@ali/tps-node'

const tps = new TPS({
  accesstoken: config.accessToken,
})
```

报错信息如下：

```tsx
TypeError: TPS is not a constructor
```

修复方案很简单，常见的 2 种：

1. 把`esModuleInterop`改回`false`，同时修改新增代码的模块导入方式。
2. 调整已有代码，变更如下：

```
- import * as TPS from '@ali/tps-node';
+ import TPS from '@ali/tps-node';
```

问题很快被修复。但是细想下，自己没有深究过这个特性背后的细节，例如还有没有其他修复方案？本文尝试从 CommonJS 和 ES Module 两者规范的差异，详细说明该配置是如何影响 tsc 编译结果的。

## ES Module 语法简介

假设一个 ES Module`foo.ts`定义如下：

```tsx
export const foo = 'foo'
class Foo {}
export default Foo
```

`import Foo from './foo'`表示导入 foo 模块的默认导出，即`Foo Class`

`import * as foo from './foo'`表示导入 foo 模块的所有导出，即：`{ foo: 'foo', default: Foo }`。

## \***\*CommonJS 语法简介\*\***

CommonJS 比较简单，类似前面示例 1，转为 CommonJS 写法如下：

```tsx
;(exports.foo = 'foo'), class Foo {}
exports.default = Foo
```

## tsc  如何将 ES Module 转为 CommonJS 的

Typescript 采用的 ES Module 规范，但是 Node.js 环境下，tsc 需要将 ES Module 编译为符合 CommonJS   规范的代码，才能在 Node.js 中执行。二者差异众多，其中和 esModuleInterop 属性关联较大的一点是：ES Module 有默认导入/导出的概念，CommonJS 没有这个概念。

当我们在 ts 代码中导入一个模块时，为了抹平这一层差异有两种策略：

1. 默认不做特殊处理，即：`esModuleInterop=false`，使用`import * as XX from 'XX'`语法导入一个 CommonJS 模块
2. 兼容模式，即：`esModuleInterop=true` ，将 **CommonJS 的所有导出合并作为一个 default export**，使用`import XX from 'XX'`语法导入 CommonJS 模块。

注：不论 `esModuleInterop` 值为`false`或`true`对导入 ES Module 模块无影响。

### \***\*esModuleInterop = false 时如何编译\*\***

其默认编译行为如下：

1. `import * as foo from 'abc'`会被编译为：`const foo = require('abc')`。
2. `import foo, { bar } from 'abc'`会被编译为：`const foo_1 = require('abc')`，同时调用该模块的代码会被 tsc 一同修改：

```tsx
;-foo.xxx()
;-bar()
;+foo_1.default.xxx()
;+foo_1.bar()
```

此时，当我们导入一个 CommonJS 模块时，主要注意：

1. 该 CommonJS 模块导出的是否为一个普通对象，如果是的话，也可以用`import { XX } from 'abc'`导入该模块的部分属性。
2. 该 CommonJS 模块是否导出`default`属性（一般情况下是没有的）。没有则不能使用`import XX from 'abc'`的语法。

### \***\*esModuleInterop = true 时如何编译\*\***

Interop：可以理解为系统间不需要特殊配置就可以配合工作。

配置开启后，tsc 会对 CommonJS 打补丁，将其转为一个符合 ES Module 规范的模块：tsc 会引入两个助手方法：**importDefault、**importStar，来抹平 CommonJS 和 ES module 模块导出的差异。

**\_\_importDefault 说明**

当使用默认导入语法时：`import XX from 'abc'`，其会被编译为：`const XX_1 = __importDefault(require('abc'))`。

一般情况下 CommonJS 模块是没有导出 default 属性的，所以无法使用默认导入语法。`__importDefault`就是将 CommonJS 导出的内容，合并为一个默认导出：

```tsx
{
  "default": require('一个CommonJS模块')
}
```

这么一来，类似`fs`模块，就可以直接用`import fs from 'fs'`导入了：

```tsx
import fs from 'fs'
fs.readFileSync()

// 编译后伪代码如下所示：

const fs = __importDefault(require('fs'))
// 此时 fs = { default: { readFileSync, writeFileSync} };
fs.default.readFileSync()
```

**\_\_importStar 说明**

当使用导入所有语法`import * as XX from 'abc'`时，其会被编译为：`const XX = __importStar(require('abc')`

`importStar`是`importDefault`的升级版：除了设置`default`属性为被导出模块，还会将被导入模块的所有可枚举属性（不含原型链继承），都代理过去。示例如下：

```tsx
import * as fs from 'fs'
fs.readFileSync()

// 编译后伪代码如下所示：

const fs = __importStar(require('fs'))
// 此时 fs = { readFileSync, writeFileSync,  default: { readFileSync, writeFileSync} };

fs.readFileSync()
```

## 回到开头的问题

通过前面 importStar 和 importDefault 的实现分析会发现：对于类似 fs 这样的模块（导出结果是一个普通对象），不论是使用哪种方法是导入，都是可以正确使用的。即，在开启 esModuleInterop 前，使用`import * as fs`  语法导入 fs 模块，开启 esModuleInterop 后，改写法仍然是兼容的，不需要修改。

而文章开头的代码之所以会在运行时报错，是因为 tps-node 模块导出的是一个 class。\_\_importStar 会把模块可枚举属性导出，但是在  module.exports = 函数/类   这一场景下，是否无法导出函数、类的。但是我们可以用 default 属性来调用：

```tsx
import * as TPS from '@ali/tps-node';
- const tps = new TPS({
+ const tps = new TPS.default({
   accesstoken: config.accessToken,
});
```

这就是第三种解法。这种写法看上去比较怪异，不熟悉的人会完全看不懂：default 属性哪里来的？所以，ts 中导入一个 CommonJS 模块最佳实践仍然是：

1. `esModuleInterop=false`，使用`import * as XX`语法
2. `esModuleInterop=true`，使用`import XX from 'XX'`语法

## 原文链接

[esModuleInterop 是如何影响 tsc 的](https://mp.weixin.qq.com/s/37DtrXeRioq-xSKayIJbCg)
