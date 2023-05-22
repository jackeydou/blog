---
title: JSX里面哪些让人迷惑的类型们：Element、IntrinsicElements、ReactNode、ReactElement……
date: '2023-05-22'
tags: ['Web Development', 'Typescript']
summary:
---

今天接到一个 oncall 是咨询 Typescript 类型的，具体问题是他们的代码里面对于 React render 函数的返回值类型由好多种：

```typescript
render()
render(): React.ReactNode
render(): JSX.Element
render(): JSX.IntrinsicElements
```

这些类型的具体区别是什么？之前写 React 的时候 render 函数我几乎不写返回值类型（`extends Component`会有默认类型）函数式组件的话一般写 `React.FC`，其他的确实没怎么用过，查了下资料，整理一下。

当然有时间的话最好去好好看一下 `@types/react` 这个 package 里面的类型定义，能学到不少。

## JSX.IntrinsicElements

`JSX.IntrinsicElements` 是 Typescript 提供的 JSX 规范里面支持自定义 element 和 attributes 定义的一个 interface，具体可以查看：(intrinsic elements)[https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements]

**通常情况下我们只需要定义自己的 intrinsic elements，而不需要在代码中使用这个类型**

上面也给了一个直接的例子：

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    foo: any
  }
}
;<foo /> // ok
;<bar /> // error
```

可以直接在 JSX.IntrinsicElements 下面定义自己的自定义元素，key 就是元素的 tag name，value 是对应的 attributes。

看一下 `@types/react`这个库里面定义的一些 IntrinsicElements，正是因为有了这些定义，在书写 JSX 的时候才有了对应的 attributes 提示。

```typescript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // HTML
      a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
      abbr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      address: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      area: React.DetailedHTMLProps<React.AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>
      article: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      aside: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      audio: React.DetailedHTMLProps<React.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>
      // ...
      samp: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      slot: React.DetailedHTMLProps<React.SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>
      script: React.DetailedHTMLProps<
        React.ScriptHTMLAttributes<HTMLScriptElement>,
        HTMLScriptElement
      >
      section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      select: React.DetailedHTMLProps<
        React.SelectHTMLAttributes<HTMLSelectElement>,
        HTMLSelectElement
      >
      small: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      source: React.DetailedHTMLProps<
        React.SourceHTMLAttributes<HTMLSourceElement>,
        HTMLSourceElement
      >
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
      strong: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      style: React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>
      // ...
    }
  }
}
```

## React.ReactNode

React 中的 class component 默认的 render 函数返回值类型就是`ReactNode`;

```typescript
class Component<P, S> {
  // ...
  render(): ReactNode
}
```

`ReactNode` 在 `@types/react` 中的定义如下：

```typescript
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined

type ReactChild = ReactElement | ReactText
type ReactFragment = {} | Iterable<ReactNode>
interface ReactPortal extends ReactElement {
  key: Key | null
  children: ReactNode
}
interface ReactElement<
  P = any,
  T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>
> {
  type: T
  props: P
  key: Key | null
}
```

所以 render() 和 render(): React.ReactNode 其实是一样的写法，只不过一种是显式声明一种是隐式推导。
ReactNode 包括了所有能想到的 jsx 返回类型，可以是 null、undefined、具体的 jsx elements、text……等等，是大而全的返回类型。

## JSX.Element

`JSX.Element`定义如下：

```typescript
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
}

interface ReactElement<
  P = any,
  T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>
> {
  type: T
  props: P
  key: Key | null
}
```

JSX.Element 等价于 ReactElement，是 ReactNode 的子集，仅仅包含 JSX 转换后的 element，不包括 null、undefined、text 等等。
