---
title: SolidJS walkthrough 02 - Types in SolidJS
date: '2023-04-08'
tags: ['Web Development', 'Framework', 'SolidJS']
summary: SolidJS源码系列第二篇， SolidJS内的数据结构类型
---

# SolidJS 内的数据结构

## SignalState

当我们调用 createSignal，在其内部就创建了一个 SignalState 类型的对象，SignalState 就是响应式的数据源，当 SignalState 更新后会触发其观察者更新或者副作用的触发。

见下方 TS 类型 `SignalState`：

```typescript
export interface SourceMapValue {
  value: unknown
  name?: string
  graph?: Owner
}

export interface SignalState<T> extends SourceMapValue {
  value: T
  observers: Computation<any>[] | null
  observerSlots: number[] | null
  tValue?: T
  comparator?: (prev: T, next: T) => boolean
}
```

主要的 property：

- value：当前 Signal 的值
- observers：当前 Signal 的 observer（比如 Effect、Memo），当 signal 的 value 更新之后，observer 会被触发执行
- observerSlots: 当前 Signal 在对应 observer 的 sources 的位置（下面会讲到 `Computation` 这个类型）
- tValue： Transition 下临时保存待更新的值（暂不考虑 Transition）

## Computation

createEffect、createMemo、createComputed、createReaction 内部都会创建一个 Computation 对象，Computation 对象就是响应式的观察者，当 SignalState 更新后，Computation 对象会触发更新或者副作用的执行。

```typescript
export interface Computation<Init, Next extends Init = Init> extends Owner {
  fn: EffectFunction<Init, Next>
  state: ComputationState
  tState?: ComputationState
  sources: SignalState<Next>[] | null
  sourceSlots: number[] | null
  value?: Init
  updatedAt: number | null
  pure: boolean
  user?: boolean
  suspense?: SuspenseContextType
}
```

主要的几个属性：

- fn：当前 Computation 保存的函数，在观察的 signal 变化的时候会触发 fn 的重新执行
- state：当前 Computation 保存的状态，state 有 0、1、2。 1 代表 STALE，表示当前 Computation 已经过期需要重新计算最新的值，2 代表 PENDING，表示当前 Computation 需要等待其他值更新完毕之后再做更新计算
- tState：和 Transition 相关的 state（先不考虑）
- sources：当前 Computation 关联的所有 signal
- sourceSlots：当前 Computation 在对应的 signal 的 observers 数组中的位置
- pure：当前 Computation 是否涉及副作用，（Memo 的 pure 为 true，effect 为 false），pure 值会影响到在更新时该 Computation 的执行时机是在 Updates 数组中还是在 Effects 数组中。

## Owner

从上面可以看到 Computation 是 extends 于 Owner 这个类型的，很多场景下 Computation 就是当前上下文的 Owner，Owner 保存着当前上下文（or 作用阈？）内的一些信息，比如 onCleanUp 函数、ErrorBoundary 函数等等。

Owners 构成了一棵树，由 owner 属性关联其父节点的 owner，owned 数组保存其子 owner 节点。其主要作用是帮助 SolidJS 建立 **组件**粒度，使得生命周期、ErrorBoundary 可以存在（个人的粗浅理解，可能不准确）。

```typescript
export interface Owner {
  owned: Computation<any>[] | null
  cleanups: (() => void)[] | null
  owner: Owner | null
  context: any | null
  sourceMap?: SourceMapValue[]
  name?: string
}
```

## Memo

Memo 其实是一个 Signal + Computation 的结合，它本身是一个可以拿去使用的值，但是它又依赖了其他 SignalState，当其依赖的 State 更新之后，Memo 本身也会更新，从类型定义也可以看出来：

```typescript
export interface Memo<Prev, Next = Prev> extends SignalState<Next>, Computation<Next> {
  value: Next
  tOwned?: Computation<Prev | Next, Next>[]
}
```
