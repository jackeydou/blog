---
title: SolidJS walkthrough 03 - createSignal
date: '2023-05-19'
tags: ['Web Development', 'Framework', 'SolidJS']
draft: true
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

```

## writeSignal
