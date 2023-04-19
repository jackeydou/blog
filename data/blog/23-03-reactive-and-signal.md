---
title: SolidJS walkthrough 01 - Signal and reactive programming
date: '2023-03-11'
tags: ['Web Development']
summary: SolidJS源码系列第一篇， Signal and reactive programming
---

# Signal

Signal 是一个随时间变化的值。当 signal 发生变化时，依赖他的下游会自动发生变化。

基于 signal 的响应式编程，我们不需要关注系统的输入和输出，只需要定义 signal 之间关系，这样当发生变化后，整个系统会自动更新。

Signal 并非是一个确切的值，准确的说 signal 是一个时间线先上的值，例如下面的表达式：

```
c = a + b
```

在响应式编程中，需要以 stream 的方式考虑 c = a + b 的过程：

```
Stream a: --1-----------2------------3-------->
Stream b: --10----20----------30-------------->
Stream c: --11----21----22----32-----33------->
```

Stream 上有多个节点，每个节点表示当前值。响应式编程就是面向 Steam 的编程， c = a + b 等同于 Stream c = Stream a + Stream b。

在前端响应式框架中，实现 Stream 之间的操作，主要通过 Event 的方式，一个 Signal 就是一个事件源，通过订阅事件源的变更，来衍生出其他 Signal 或者执行副作用。

在前端 Signal 响应式编程中，有以下三要素：

1. Signals：如同上面所描述的，Signals 是一个随时间变化的值，并且也是一个可观察的对象。在不同框架中有着不同的叫法：Observables，Atoms，Refs 等
2. Reactions：反应也叫副作用，即：定义能对 signal 变化做出反应的行为。
3. Derivations：一个 Signal 能衍生出另一个 Signal，这是一种很常见的行为。当一个 Signal 变化时，其衍生的 signal 也会自发更新，这个过程可以被缓存、懒加载。

以 SolidJS 为例，实现上面要素的 API 如下：

1. createSignal：创建一个 Signal，Signal 可以被追踪
2. createMemo：创建一个衍生的只读 Signal，只有依赖的 Signal 发生变化时，才会重新求值。
3. createEffect：创建一个副作用，依赖的 signal 发生变化时，会执行回调。

# Signal 实现

主流框架的 Signal 都是基于 js Proxy 特性实现的：

```javascript
const p = new Proxy(target, {
  get: function (target, property, receiver) {},
  set: function (target, property, receiver) {},
})
```

Proxy 可以代理对象，并拦截某些操作。一般会在 get 时，添加对响应式对象的监听，在 set 时，通知订阅者。基于 Proxy 的好处是：可以让依赖追踪变得自然和简单，只需要调用特定 API（createMemo、createEffect），然后正常取值和赋值，就可以完成数据和副作用触发。

但也有一些响应式框架并非基于 Proxy，而是基于事件和回调，例如：rxjs、remesh。为了实现响应式，必须显示的 subscribe、set、get 数据源:

```javascript
const var1 = new Subject()
var1.next(1)
const var2 = var1.pipe(
  map((var1) => {
    return var1 * 2
  })
)
var2.subscribe((var2) => {
  console.log(var2)
})
var1.next(2)
```

# Reactive

在 [A Survey on Reactive Programming](https://jose.proenca.org/post/reactive-programming/slides/survey-on-RP.pdf) 一文中，作者从 6 大维度对比了多种 Reactive Programming 实践。
![Survey on Reactive Programming](/static/resources/23-03-reactive-and-signal/survery-reactive-programming.png)

## Evaluation model（求值模型）

Evaluation model 分位两种：拉取（Pull）和推送（Push）。
| -- | 生产者 | 消费者 |
| ---- | ---------------------------- | ---------------------------- |
| 拉取 | 被动的：当被请求时产生数据 | 主动的：决定何时请求数据 |
| 推送 | 主动的：按自己的节奏产生数据 | 被动的：对收到的数据做出反应 |
在拉取体系中，有消费者来决定何时从生产者那里接收数据。生产者本身不知道数据是何时交付到消费者手中的：

- 普通 Javascript 函数。函数是生产者，消费者主动调用函数“取出”一个数据。
- Generator 函数。另一种拉取体系，调用 iterator.next()的代码是消费者，从 iterator（生产者）中取出多个值。

在推送体系中，由生产者来决定何时把数据发送给消费者。消费者本身不知道何时会接收到数据。

- Promise。通过注册回调函数的方式（消费者），由 Promise（生产者）决定何时把值“推送”给回调函数。
- Event。

Vue、SolidJS、preact、rxjs、remesh 实现的都是 Push 体系，即：Push-based reactivity。

另一方面，pull-based reactivity 表现在：当上游变化时，并不会主动推送数据给下游计算，而是当下游在使用时，在从上游取数据，重新计算，所以 pull-based reactivity 是 lazy 的。

pull-based reactivity 一般采用定时轮询的方式实现，这会存在两个缺点：

1. 资源浪费，每次轮询到来时，即使依赖未发生变化，也会重新求值。
2. 更新会有一定延时。

## Lifting（提升）

Lifting 的含义为：将函数通过一个配置，转换为另一个通用函数。
Lifting is a concept which allows you to transform a function into a corresponding function within another (usually more general) setting.

对于响应式编程，如果有一个 add 函数是处理两个 int 类型的相加，那么通过 lift，可将这个 add 函数用来处理两个 Stream 的相加，并能够自动跟踪依赖变化。

Lift 有三种表现：显式的、隐式的、手动的。

1. 显式的：通过一个特定的 Lift 函数，将 add 函数转换为能处理两个 Stream 之间的相加的函数
2. 隐式的：这个 add 函数能自发处理两个 Stream 相加。
3. 手动的：手动从 Stream 中取出当前值，传入 add 函数相加

```
Explicit lift(add): (Stream, Stream) -> Stream

Implicit add: (Int, Int) -> Int
		s3 = add(stream1, stream2)

Manual x = add(get(stream1), get(stream2))
```

基于 Proxy 的前端响应式框架，是 Implicit 和 Manual 的结合：

1. 对于 Signal 的值是 object，这个过程是隐式的
2. 对于 Signal 的值是基础类型，这个过程是 Manual 的，需要使用 `.value` 或者 `stream()`的方式获取当前值。

## Glitch avoidance（闪烁避免）

Glitch avoidance 是指响应式实现需要规避一个问题：两个上游依赖拥有相同依赖，当共同依赖变更时，会产生重复的计算过程，从而暴露 inconsistent data 给下游。

```
var1 = 1
var2 = var1 * 2
var3 = var1 + var2

// var1 变成2，var3会计算几次？
```

var3 依赖 var1 两次，一次直接依赖，一次间接依赖（通过 var2）。那么当 var1 变化时，通知 var3 重计算可能会发生两次，这取决于框架的实现：

- 第一次计算取的是最新的 var1 和旧的 var2，
- 第二次计算取的是最新的 var1 和最新的 var2

响应式需要规避这一现象，成为 glitch avoidance。

未做到 Glitch Avoidance 会导致意料之外的问题，例如：var3 是一个转账金额，那当 watch var3 作转账时，这种中间态的错误数据会导致 bug。

从上面的描述，Glitch Avoidance 一定是 push-based reactivity 所存在的问题，对于 pull-based reactivity 因为是消费者主动触发的重计算，是 lazy 的，所以不会有这样的问题。

### 解决方案

既然是中间态数据导致了问题，那么只要处理好中间态数据，就能实现 Glitch Avoidance，有两种思路：

1. 跳过（合并）过渡数据。
2. 延迟更新

#### 跳过（合并）过渡数据

上面的例子如果 var3 能在 var1 更新之后判断出 var2 还未更新，需要跳过这次更新。需要做到这样，需要知道某个值的上游依赖是否有相同依赖。
但要做到这种分析并不容易，原因在于：

1. 2 个上游依赖并不一定直接依赖某个相同依赖。
2. 会存在多个上游依赖有相同依赖

#### 延迟更新

当 var1 变化时，通知到 var3，var3 不会立刻更新（无论是计算值还是副作用回调执行），而是延迟更新。

实现延迟更新有两种方式：

1. 开启一个异步队列来更新。
2. 主动提供 batch 函数。在 batch 函数中更新，都不会立刻执行而是被标记 dirty（preact 的实现），或是推入队列（solidjs 的实现）。当传入 batch 函数执行完毕后，一次性 apply 所有更新。

**问题**：
延迟更新会破坏事务的原子性，原因如下：
当我们延迟更新 var3 的值后，相应的 var2 的更新则不能延迟，因为只有这样，var3 更新是才能获取到最新的 var2 的值。如果强行把 var2 的值也延迟更新，那 var2 的上游就不能延迟更新。即：不能将所有的更新延迟。
现在主流框架大多采用的“延迟更新”方案，但它们都有自己的办法去解决“事务原子性”的问题。

**解决**:

- Lazy Computed: Lazy Computed 指 Computed 是懒加载模式，即只在访问 computed 时才去重新计算 computed 的值。
- Computed 优先执行: 对于 solid 来说，solid 的 memo 和 effect 会放入两个队列， memo 回调总是会先于 effect 执行。使用这种策略，solid 也实现了 Glitch Avoidance 。

# 推荐阅读

- [Super Charging Fine-Grained Reactive Performance](https://dev.to/modderme123/super-charging-fine-grained-reactive-performance-47ph)
- [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
- [Push-Pull Functional Reactive Programming](http://conal.net/papers/push-pull-frp/push-pull-frp.pdf)
