---
title: React RFCS - useEvent
date: '2022-09-01'
tags: ['React', 'Web Development', 'Framework']
draft: false
summary: 'React发布了新的RFC - useEvent, useEvent为了解决哪些问题？'
---

## 概述

RFC 链接：

[rfcs/0000-useevent.md at useevent · reactjs/rfcs](https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md)

useEvent 要解决一个问题：如何同时保持函数引用不变与访问到最新状态。

提案中的例子：

```tsx
function Chat() {
  const [text, setText] = useState('')

  const onClick = useEvent(() => {
    sendMessage(text)
  })

  return <SendButton onClick={onClick} />
}
```

## 在 useEvent 出现之前是怎么处理的

想要保持 onClick 不变，那就需要使用 useCallback 将 onClick 包装一下，然后将 state 上的数据同步一份在 ref 上这样才可以在 useCallback 里面获取到最新的值

```tsx
function Chat() {
  const [text, setText] = useState('')
  const textRef = useRef('')
  const onClick = useCallback(() => {
    sendMessage(textRef.current)
  }, [])

  // setText(newText);
  // textRef.current = newText;

  return <SendButton onClick={onClick} />
}
```

## 为什么要提出这样一个新的 hook

### state 和 props 变更可能会引起性能问题

我们在 react 组件中定义一个函数最常用的就是作为子组件的 props 传递给子组件，比如定义一个 onClick 函数 在子组件点击的时候 触发回调给外面做一些业务逻辑。e.g.：

```tsx
function Chat() {
  const [text, setText] = useState('')

  const onClick = () => {
    sendMessage(text)
  }

  return <SendButton onClick={onClick} />
}
```

但是在函数式组件中，上面的例子每一次触发 Chat 组件的 re-render（props 或 state 更新）都意味着 onClick 会被重新创建，函数的引用地址将改变，SendButton 组件就算做了 memo 浅比较的处理（默认不传 memo 第二个参数比较函数的情况下）也无济于事，会触发 SendButton 组件的 re-render。

### useEffect 不应该被重新触发

rfc 中给出的例子：

```tsx
function Chat({ selectedRoom }) {
  const [muted, setMuted] = useState(false)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    const socket = createSocket('/chat/' + selectedRoom)
    socket.on('connected', async () => {
      await checkConnection(selectedRoom)
      showToast(theme, 'Connected to ' + selectedRoom)
    })
    socket.on('message', (message) => {
      showToast(theme, 'New message: ' + message)
      if (!muted) {
        playSound()
      }
    })
    socket.connect()
    return () => socket.dispose()
  }, [selectedRoom, theme, muted]) // 🟡 Re-runs when any of them change
  // ...
}
```

在 selectedRoom 变化的时候会连接新的 socket，在 socket 的 connect 和 message 事件，并展示一个 toast，toast 的内容来自于 context 和 state，为了让 useEffect 能拿到最新的值必须把 theme 和 muted 作为 useEffect 的 dependencies 传入，每次 muted 和 theme 的更新都会让 useEffect 重新执行重新连接 socket。

当有了 useEvent 之后，可以将 socket 的 connect 和 message 事件的回调函数用 useEvent 进行包装：

```tsx
function Chat({ selectedRoom }) {
  const [muted, setMuted] = useState(false)
  const theme = useContext(ThemeContext)

  // ✅ Stable identity
  const onConnected = useEvent((connectedRoom) => {
    showToast(theme, 'Connected to ' + connectedRoom)
  })

  // ✅ Stable identity
  const onMessage = useEvent((message) => {
    showToast(theme, 'New message: ' + message)
    if (!muted) {
      playSound()
    }
  })

  useEffect(() => {
    const socket = createSocket('/chat/' + selectedRoom)
    socket.on('connected', async () => {
      await checkConnection(selectedRoom)
      onConnected(selectedRoom)
    })
    socket.on('message', onMessage)
    socket.connect()
    return () => socket.disconnect()
  }, [selectedRoom]) // ✅ Re-runs only when the room changes
}
```

## 提案给出的可能的实现方式

```tsx
// (!) Approximate behavior

function useEvent(handler) {
  const handlerRef = useRef(null)

  // In a real implementation, this would run before layout effects
  useLayoutEffect(() => {
    handlerRef.current = handler
  })

  return useCallback((...args) => {
    // In a real implementation, this would throw if called during render
    const fn = handlerRef.current
    return fn(...args)
  }, [])
}
```

有两个 In a real implementation 的注释需要我们关注一下：

1. In a real implementation, this would run before layout effects。react 官方在真正实现 useEvent 的时候触发 ref 赋值的操作会早于 useEffectLayout。这是为了保证函数在一个事件循环中被直接消费时，可能访问到旧的 Ref 值；
1. In a real implementation, this would throw if called during render。这个函数不能在 render 中执行，因为 useEvent 包裹的函数内部很有可能会触发 props 或 state 的更新，为了保证 render 数据的结果不被影响。

## 值得注意的点

### useEvent 内获取的值是最新的，但不是实时的

提案中给出的方案的实现的话，其实是在每次都会生成一个最新的函数只不过用 useCallback 维持对外暴露的引用不变。所以每次拿到的是这次更新之后的一次快照，并不像 useCallback + useRef 那样能一直获取到最新的值。e.g.

```tsx
function App() {
  const [count, setCount] = useState(0)

  const onClick = useEvent(async () => {
    console.log(count)
    await doSomethingAsync(1000)
    console.log(count)
  })

  return <Child onClick={onClick} />
}
```

上面的例子中 即使在 doSomethingAsync 中更改 count，这两次输出的 count 还是一致的。

### 为什么要提前到 layoutEffect 之前执行 ref 挂载

因为如果在值变更之后立即执行，那么拿到的会是旧的 ref 值（因为 layoutEffect 还没执行过，没有重新更新函数）
