---
title: SolidJS walkthrough 03 - createSignal
date: '2023-05-19'
tags: ['Web Development', 'Framework', 'SolidJS']
---

## createSignal 源码分析

先来看一下 createSignal 的类型定义：

```typescript
export function createSignal<T>(): Signal<T | undefined>
export function createSignal<T>(value: T, options?: SignalOptions<T>): Signal<T>

export type Signal<T> = [get: Accessor<T>, set: Setter<T>]
```

createSignal 返回一个元组（类似 React 的 useState），有两个元素，但是和 React 的 useState 的最大的区别就是，这个元组的第一个元素是一个 getter 函数，而不是具体的值。函数贯穿了 SolidJS 的整个设计理念，从 React 切换到 SolidJS 最需要适应的我个人觉得就是返回的一些需要响应式的内容都要是函数类型（为了数据能被成功捕获为响应式，这个后面再说）。

再来看一下 createSignal 的具体代码（删减了一些 dev 下的代码）：

```typescript
export function createSignal<T>(
  value?: T,
  options?: SignalOptions<T | undefined>
): Signal<T | undefined> {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions

  const s: SignalState<T | undefined> = {
    value,
    observers: null,
    observerSlots: null,
    comparator: options.equals || undefined,
  }

  // ...omit some code in dev

  const setter: Setter<T | undefined> = (value?: unknown) => {
    if (typeof value === 'function') {
      if (Transition && Transition.running && Transition.sources.has(s)) value = value(s.tValue)
      else value = value(s.value)
    }
    return writeSignal(s, value)
  }
  return [readSignal.bind(s), setter]
}
```

`createSignal` 主要逻辑就是：

1. 创建了一个`SignalState`对象 s;
2. 创建一个`setter`函数，这个`setter`函数内部调用了`writeSignal`, 通过闭包关联了上面创建的`SignalState` s;
3. `readSignal`也通过`bind`绑定了 s，作为最后的`getter`，然后将`getter`和`setter`函数返回;

所以 createSignal 的关键逻辑都在`readSignal`和`writeSignal`中，下面来看下这两个函数：

## readSignal

```typescript
export function readSignal(this: SignalState<any> | Memo<any>) {
  // ...omit some code about Memo

  if (Listener) {
    const sSlot = this.observers ? this.observers.length : 0
    if (!Listener.sources) {
      Listener.sources = [this]
      Listener.sourceSlots = [sSlot]
    } else {
      Listener.sources.push(this)
      Listener.sourceSlots!.push(sSlot)
    }
    if (!this.observers) {
      this.observers = [Listener]
      this.observerSlots = [Listener.sources.length - 1]
    } else {
      this.observers.push(Listener)
      this.observerSlots!.push(Listener.sources.length - 1)
    }
  }
  // ...omit some code about transition
  return this.value
}
```

这里我们省略了一些 Memo 和 Transition 的代码（关于 Memo 可以看 [walkthrough 02](/blog/23-04-solidjs-02-types-in-signal), Transition 放在后面再聊）。

readSignal 如果不看 if 条件句的话，其实最后就是 return this.value，因为 createSignal 返回的 getter 是通过 bind SignalState 生成的新的函数，this 就是 SignalState，所以这里就是直接返回对应的 SignalState 的值。

那 Listener 是什么？从名字看我们就知道是关联到这个 Signal 的监听者，但是一个具体的 Listener 是怎么来的呢？

查找一下 Listener 的相关代码，我们能看到设置全局 Listener 的代码有：

```typescript
function updateComputation(node: Computation<any>) {
  if (!node.fn) return
  cleanNode(node)
  const owner = Owner,
    listener = Listener,
    time = ExecCount
  Listener = Owner = node
  runComputation(
    node,
    Transition && Transition.running && Transition.sources.has(node as Memo<any>)
      ? (node as Memo<any>).tValue
      : node.value,
    time
  )
  // ....

  Listener = listener
  Owner = owner
}
```

这里可以看到 Listener 和 Owner 在 `updateComputation` 中被同时设置成 `Computation`，`updateComputation` 从名字上就可以知道其作用是更新 Computation (关于 Computation 可以看 [walkthrough 02](/blog/23-04-solidjs-02-types-in-signal)，Computation 就是 Signal 的依赖，signal 更新会触发 Computation 的函数的重新执行)。
所以一个 Computation 在执行的时候会设置全局的一个 Listener（在 Computation 执行完之后 Listener 会被重置），在这个 Listener 的生命周期内如果触发了 readSignal，对应的 Signal 就会将当前的 Listener 捕获到 observers 中，这样当 signal 更新的时候我们就知道该触发哪些函数需要被重新执行和更新。

readSignal 过程还会设置 sources、sourceSlots、observers、observerSlots 几个字段，这几个字段的具体含义可以参考[walkthrough 02](/blog/23-04-solidjs-02-types-in-signal)

## writeSignal

```typescript
export function writeSignal(node: SignalState<any> | Memo<any>, value: any, isComp?: boolean) {
  let current =
    Transition && Transition.running && Transition.sources.has(node) ? node.tValue : node.value
  if (!node.comparator || !node.comparator(current, value)) {
    // ...
    node.value = value
    if (node.observers && node.observers.length) {
      runUpdates(() => {
        for (let i = 0; i < node.observers!.length; i += 1) {
          const o = node.observers![i]
          const TransitionRunning = Transition && Transition.running
          if (TransitionRunning && Transition!.disposed.has(o)) continue
          if (TransitionRunning ? !o.tState : !o.state) {
            if (o.pure) Updates!.push(o)
            else Effects!.push(o)
            if ((o as Memo<any>).observers) markDownstream(o as Memo<any>)
          }
          if (!TransitionRunning) o.state = STALE
          else o.tState = STALE
        }
        if (Updates!.length > 10e5) {
          Updates = []
          // ...
        }
      }, false)
    }
  }
  return value
}
```

writeSignal 除了更新对应 signal 的值以外（先不考虑 Transition），还要更新监听当前 signal 的所有 Computation，从而响应式的更新，signal 的观察者都在 signal.observers 数组内。

当然 SolidJS 不会立即触发所有的 observers 的重新执行（可能会带来一些重复更新、卡顿等问题），而是会将所有 observers 分流到 Updates 和 Effects 两个数组内，区分的依据就是 observer 是否为 pure

```typescript
if (o.pure) Updates!.push(o)
else Effects!.push(o)
```

pure 代表的是什么？pure 就是表明当前的数据更新没有一些副作用，比如 memo 的更新。pure 为 false 的就比如 createRenderEffect 这种有副作用的更新，在 SolidJS 中，Updates 数组最终全部更新完之后再触发 Effects 数组内的更新，这样可以做到 Glitch Avoidance（参考 [walkthrough 01](/blog/23-03-solidjs-01-reactive-and-signal)）
