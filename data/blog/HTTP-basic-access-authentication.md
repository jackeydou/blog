---
title: HTTP basic access authentication
date: '2022-12-01'
tags: ['Web Development']
draft: false
summary: '简单介绍一下HTTP basic access authentication'
---

Basic access authentication 是允许在请求是提供用户名和密码的一种方式。

在进行基本认证的过程里，请求的[HTTP 头字段](https://zh.wikipedia.org/wiki/HTTP%E5%A4%B4%E5%AD%97%E6%AE%B5) 会包含`Authorization`字段，形式如下： `Authorization: Basic <凭证>`，该凭证是用户和密码的组和的[base64 编码](https://zh.wikipedia.org/wiki/Base64)。

优点：
简单，支持好（基本上所有流行的网页浏览器），

缺点：
基本认证没有提供任何保护，需要和 HTTPS 一起使用

现存的浏览器保存认证信息直到标签页或浏览器被关闭，或者用户清除历史记录。HTTP 没有为服务器提供一种方法指示客户端丢弃这些被缓存的密钥。这意味着服务器端在用户不关闭浏览器的情况下，并没有一种有效的方法来让用户退出。

拼接方式：base64(\[username\]:\[password\])，

浏览器中 base64 的编码解码方式：

- 编码：`window.btoa`
- 解码：`window.atob`
