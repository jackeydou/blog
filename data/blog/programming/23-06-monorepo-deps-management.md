---
title: monorepo dependencies management
date: '2023-06-12'
tags: ['Web Development']
draft: true
summary:
---

前端项目越来越复杂，现在经手的所有项目几乎都是以 monorepo 的形式组织代码的，相比多个 repo，monorepo 的一个好处是项目的依赖可以在同一个 repo 下通过 workspace 关联起来，但是这可能会带来一些 dependency 管理的问题。

最近在做一些编译工具链代码优化整理和拆分，正好记录一下前端 monorepo 的依赖管理的一些思考。
