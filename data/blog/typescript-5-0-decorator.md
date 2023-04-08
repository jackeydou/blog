---
title: Decorator in Javascript and Typescript
date: '2023-03-18'
tags: ['Typescript', 'Web Development']
draft: true
summary: 'Typescript发布了5.0版本支持了最新的Decorator方案，本文详细介绍一下ecmascript的Decorator的各种方案及使用方式'
---

# Decorator

Javascript decorator 在 22 年的 3 月份正式进入 stage 3，在一年之后的 Typescript 5.0 也正式对最新的 decorator 进行了支持。

## ES 标准下的 Decorator

## Typescript 的新版 Decorator

## Typescript 的旧版 Decorator

Typescript 之前也支持了一个版本的 decorator，需要在 tsconfig 或者命令行显示声明 `experimentalDecorators: true` 或者 `--experimentalDecorators`，在 5.0 之前如果不开启这个开关使用 decorator 则会报错。

之前在做一些移动端的性能优化时我使用过 Decorator 来帮助我抽象出通用的缓存能力（缓存用来提升 FCP，较少接口耗时带来的白屏等待时间），直接从例子出发来看一下 Typescript 旧版本的 Decorator 的使用。

大概的实现如下：

```typescript
// cache.ts
export function cached<T extends { cached: boolean }>() {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const { value: fetchMethod } = descriptor;
    if (typeof fetchMethod === 'function') {
      // 在Decorator里面可以拿到传过来的参数做一些自己的逻辑
      descriptor.value = async (params: ApiCacheParams<T>) => {
        // 拿到外面传过来的一部分数据：
        // useCache（判断是否需要读缓存的数据）
        // cacheKey（读的缓存的key）
        // cacheCallback（读到的缓存的数据传给回调）
        const { useCache, cacheKey, cacheCallback, ...restParams } = params;
        if (useCache) {
          const cacheData = getStorageFromCache(cacheKey);
          cacheCallback(cacheData);
        }
        // 调用原来的fetch方法
        const response = await fetchMethod(restParams);
        if (useCache) {
          setDataToStorage(response)
        }
        return response
      }
    }
  }
}

// api.ts
class Api {
  @cached()
  fetch(params) {
    return request(params);
  }
}
export api = new Api();

// index.ts
api.fetch({
  useCache: true,
  cacheKey: 'xxxx',
  cacheCallback: (data) => {}
})
```
