---
title: Redux的核心原理，其实很简单
date: '2021-03-01'
tags: ['Web Development']
draft: false
summary: '本文主要介绍了Redux的核心原理。'
---

# Flux 架构

Redux 是基于 Facebook 提出的 Flux 架构设计出来的。Flux 不是一个框架或者库，可以认为 Redux 是 Flux 的一种实现形式。Flux 架构强调数据应该是单向的数据流。

Flux 架构将应用拆分成四个部分：

![flux](/static/resources/flux1.png)

- View（视图层）：UI 界面
- Action（动作）：View 会触发的一系列事件动作
- Dispatcher（分发器）：对 Action 进行分发
- Store（数据层）：存储应用的数据状态，store 的变化最终会映射到 View 上。

![flux](/static/resources/flux2.png)

单向数据流的优势在于：对于数据装填的变化是可预测的。如果 store 中的状态发生了变化，那么一定是因为 dispatch 了某个 action。所以在 Redux 官网映入眼帘的就是：

Redux：A Predictable State Container for JS Apps

了解了 Flux 架构之后再来看 Redux 就会更容易理解。

# Redux 核心原理

Redux 核心组成有三部分：

- Store：存储数据状态的容器
- Action：动作
- Reducer：一个函数，接受两个参数，第一个参数是当前的 state，第二个参数是 action。reducer 负责根据 action 对状态进行处理。为什么叫 Reducer，是因为 Reducer 函数可以作为 Array 的 reduce 函数的参数。

Flux 的 dispatch 哪去了？Redux 并不是严格遵循 Flux 架构设计的，dispatch 在 Redux 中被整合到了 Store 中。

Redux 整个工作过程中，数据流是严格单向的，只能通过 dispatch action 的方式触发数据状态的修改。Action 会进入对应的 Reducer 进行处理最终得到新的状态 State，然后进一步的触发 View 的数据更新。

我们使用 Redux 最重要的一步就是通过 `createStore` 创建一个 store：

`createStore` 接受三个参数：

- reducer
- 初始状态 initState
- enhancer, 对 `createStore` 能力进行增强的函数，如 `applyMiddleware`，添加一些中间件

具体做了什么事情？下面我简化了 createStore 方法的逻辑（去掉了边界 case 相关的代码）并对每一步进行了注释：

```javascript
export default function createStore(reducer, preloadedState) {
  // 保存reducer的变量
  let currentReducer = reducer
  // 保存state的变量
  let currentState = preloadedState
  // 订阅状态的改变，在state改变之后会触发里面的监听事件
  let currentListeners = []

  // 获取当前的state
  function getState() {
    return currentState
  }

  // 订阅函数
  function subscribe(listener: () => void) {
    let isSubscribed = true
    // 将订阅函数放到listeners队列中，state更新后会一次调用里面的函数
    currentListeners.push(listener)
    // 返回一个取消订阅的函数
    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      const index = currentListeners.indexOf(listener)
      currentListeners.splice(index, 1)
    }
  }

  // 分发action的函数
  function dispatch(action) {
    // 执行reducer，根据action生成新的state保存到currentState
    currentState = currentReducer(currentState, action)

    const listeners = currentListeners
    // 依次触发listeners中订阅的函数，更新UI
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    return action
  }

  // 这里触发一个dispatch，不会命中reducer里面的任何逻辑，
  // 所以直接走default，返回初始的state，达到设置初始默认值的目的
  dispatch({ type: ActionTypes.INIT })
  // 闭包
  const store = {
    dispatch: dispatch,
    subscribe,
    getState,
    // ...
  }
  return store
}
```

# redux 中间件

redux 中间件使用方式是通过 applyMiddleware 方法，applyMiddleware 接受任意个数个中间件作为参数，在一开始介绍 createStore 的时候用到了`applyMiddleware` 方法。

`applyMiddleware` 函数实际的作用是对 store 的 dispatch 方法进行增强。下面对 `applyMiddleware` 方法每一步进行了注释：

```javascript
export default function applyMiddleware(
  ...middlewares
) {
  // 返回一个函数，接受参数是createStore方法。
  return (createStore) => <S, A extends AnyAction>(
    reducer: Reducer<S, A>,
    preloadedState?: PreloadedState<S>
  ) => {
    // 调用createStore，创建一个store
    const store = createStore(reducer, preloadedState)
    let dispatch: Dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }
    // middleware接受的参数，一个middleware实际上就是一个函数
    // 参数包含两个属性，getState和dispatch，所以一个redux的中间件需要接受并使用这两个方法
    const middlewareAPI: MiddlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }
    // 遍历middleware数组，给middleware数组传递上面的middlewareAPI参数，得到一个新的函数数组
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    // 得到一个新的dispatch方法，替换原有store的dispatch方法。
    // 新的dispatch方法通过compose方法将上一步得到的函数数组组合成一个函数，具体如何做到的，下面会描述。
    dispatch = compose<typeof dispatch>(...chain)(store.dispatch)
    // 返回一个新的store对象，dispatch是通过compose函数得到的新的dispatch方法
    return {
      ...store,
      dispatch
    }
  }
}
```

业务代码中调用的 `dispatch` 实际上会将传过来的 action 经过各个 Middleware 处理后调用 `createStore()` 返回的真正的 dispatch。

`applyMiddleware` 最终最需要搞清楚的就是 `compose` 函数是如何将 middleware 函数数组组合成一个函数的？函数合成（compose）并不是 Redux 的专利，它是函数式编程的一个概念，在 Koa 中也可以看到一个 compose 函数是相同的事情。compose 函数的代码非常精简：

```javascript
export default function compose(...funcs: Function[]) {
  // 处理数组为空的边界case
  if (funcs.length === 0) {
    return (arg) => arg
  }
  // 处理数组为1的情况，这种情况下也不需要组合，直接返回第一个元素就行
  if (funcs.length === 1) {
    return funcs[0]
  }
  // 有多个函数，通过 array的reduce方法来组合
  return funcs.reduce(
    (a, b) =>
      (...args: any) =>
        a(b(...args))
  )
}
```

如果你还不了解`reduce` 方法，那么这是一个绝好的机会去真正认识到 reduce 函数的威力。reduce 函数的特点就是会执行 reduce 函数参数的逻辑，将数组中的数组组合成一个结果。

假设我们执行 `compose(f1,f2,f3)` ，得到的结果就是：

```javascript
;(...args) => f1(f2(f3(...args)))
```

通过 `compose` 函数，我们就可以将多个函数整合成一个函数。

那 redux 的中间件又是一个什么结构呢？
这里我们找一个 redux 最常见的中间件`redux-thunk`，`redux-thunk` 是 redux 中经典的一步 action 解决方案。`redux-thunk` 非常简洁，只有几行代码：

```javascript
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) =>
    (next) =>
    (action) => {
      // 当action是一个函数的时候，调用这个函数，传递dispatch、getState给action
      // 在action函数中去处理异步逻辑，调用dispatch
      if (typeof action === 'function') {
        return action(dispatch, getState, extraArgument)
      }
      // 如果不是函数，就是一个正常的同步action，直接dispatch
      return next(action)
    }
}

const thunk = createThunkMiddleware()
thunk.withExtraArgument = createThunkMiddleware

export default thunk
```

看到`createThunkMiddleware`函数的返回函数接收的参数是不是非常熟悉？这里就是 `applyMiddleware`中向 middleware 传递的 middlewareAPI。

一个 redux middleware 的结构就是这样的：

```javascript
;({ dispatch, getState }) =>
  (next) =>
  (action) => {
    /*  */
  }
```

compose 函数最终会将函数合并成：

```javascript
;(...args) => middleware1(middleware2(middleware3(args)))
```

在 `applyMiddleware` 中给 `compose` 合成的函数传递的参数是 `store.dispatch`，所以`({ dispatch, getState }) => (next) => (action) => { /*  */ }`中的这个 next 参数就是`store.dispatch`。所以中间件最终会调用到 store 的 `dispatch` ，完成 action 的分发，中间件的作用是对 dispatch 的能力进行增强（最终还是要靠 dispatch 方法），比如`redux-thunk`使得`dispatch`可以处理异步逻辑。

# 当然你可能并不需要 Redux

> 任何技术设计、思想框架，与其说他们的优缺点，不如用“适合不适合”某类场景来表达更加准确、客观。

作为 Redux 的 creators 之一的 Dan Abramov 在很久之前也说过 “You might not need Redux”。Redux 的官网中也有关于 [When should I use Redux](https://redux.js.org/faq/general#when-should-i-use-redux) 的版块。对于一个拥有复杂状态更新频繁的 App 使用 redux 可能会带来一些维护上的优势，但是对于轻量简单的应用来讲，Redux 的使用就不是那么必要的了。使用 Redux，开发者必须要写很多模板代码，这种重复和繁琐可能不是开发者所能忍受的。在 React 中，React hooks 的出现可能是对 redux 的一次降维打击，对于是否使用 Redux，还是需要根据具体业务场景进行一次"trade-off"。
