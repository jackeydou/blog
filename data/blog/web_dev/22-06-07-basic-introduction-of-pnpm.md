---
title: pnpm的基本介绍
date: '2022-06-07'
tags: ['Web Development']
draft: false
summary: '对于pnpm的基本原理介绍，建议使用pnpm替代npm/yarn'
---

本质上和 yarn、npm 一样是包管理器，有两个优势：

- 包安装速度极快；
- 磁盘空间利用非常高效。

官网：[Fast, disk space efficient package manager | pnpm](https://pnpm.io/)

pnpm 内部使用`基于内容寻址`的文件系统来存储磁盘上所有的文件，这个文件系统出色的地方在于:

- 不会重复安装同一个包。用 npm/yarn 的时候，如果 100 个项目都依赖 lodash，那么 lodash 很可能就被安装了 100 次，磁盘中就有 100 个地方写入了这部分代码。但在使用 pnpm 只会安装一次，磁盘中只有一个地方写入，后面再次使用都会直接使用 `hardlink`。
- 即使一个包的不同版本，pnpm 也会极大程度地复用之前版本的代码。举个例子，比如 lodash 有 100 个文件，更新版本之后多了一个文件，那么磁盘当中并不会重新写入 101 个文件，而是保留原来的 100 个文件的 `hardlink`，仅仅写入那`一个新增的文件`。

随着前端工程的日益复杂，越来越多的项目开始使用 monorepo。之前对于多个项目的管理，我们一般都是使用多个 git 仓库，但 monorepo 的宗旨就是用一个 git 仓库来管理多个子项目，所有的子项目都存放在根目录的`packages`目录下，那么一个子项目就代表一个`package`。

pnpm 与 npm/yarn 另外一个很大的不同就是支持了 monorepo，体现在各个子命令的功能上，比如在根目录下 `pnpm add A -r`, 那么所有的 package 中都会被添加 A 这个依赖，当然也支持 `--filter`字段来对 package 进行过滤。

# pnpm 如何链接本地其他位置的代码

在目的代码仓库中 执行

```bash
pnpm link [path to source]
```

不同于`npm`，`npm` 需要在 source 项目和 target 项目分别执行

```bash
# source项目
npm link
# target项目
npm link [packageName]
```

**如何解除链接？**
`pnpm`：在 target 项目下

```bash
pnpm unlink [packageName]
```

`npm`：

```bash
# target项目
npm unlink [packageName]
# source项目
npm unlink
```

### 硬链接和软连接

为了共享使用，给一个文件在其他地方创建一个链接，使用 ln 或者 link 命令实现。

通俗地理解：

- 软链接（符号链接）：相当于 windows 里的快捷方式，在其他地方给文件创建一个快捷方式，快捷方式删了，原来文件还是存在的。
- 硬链接：可以理解为是复制了一份文件（只是通俗理解，其实并不占用磁盘空间）链接文件和原始文件只要有一个存在，文件就会存在，不会消失。

相同点：linux 的软链接和硬链接删除都不会影响原始文件，但是修改的话都会影响原始文件。

软连接：ln –s 源文件 目标文件
硬链接：ln 源文件 目标文件

区别：硬链接的 inode 和源文件是一样的，但是软连接和源文件是不一样的。

inode 号即索引节点号（是文件元数据的一部分但其并不包含文件名），是文件的唯一标识而非文件名，文件名仅是为了方便人们的记忆和使用，系统或程序通过 inode 号寻找正确的文件数据块。
![Pasted image 20230122184620.png](/static/resources/Pasted-image-20230122184620.png)
![Pasted image 20230122184628.png](/static/resources/Pasted-image-20230122184628.png)

硬链接存在以下几点特性：

- 文件有相同的 inode 及 data block；
- 只能对已存在的文件进行创建；
- 不能交叉文件系统进行硬链接的创建；
- 不能对目录进行创建，只可对文件创建；
- 删除一个硬链接文件并不影响其他有相同 inode 号的文件；

软链接就是一个普通文件，它是记录了源文件的一些信息（如 inode 等），并且软链接有着自己的 inode 号以及用户数据块（故 inode 和源文件是不同的）。
![Pasted image 20230122184640.png](/static/resources/Pasted-image-20230122184640.png)
![Pasted image 20230122184647.png](/static/resources/Pasted-image-20230122184647.png)

软链接的创建与使用没有类似硬链接的诸多限制：

- 软链接有自己的文件属性及权限等；
- 可对不存在的文件或目录创建软链接；
- 软链接可交叉文件系统；
- 软链接可对文件或目录创建；
- 创建软链接时，链接计数 i_nlink 不会增加；
- 删除软链接并不影响被指向的文件，但若被指向的原文件被删除，则相关软连接被称为死链接（即 dangling link，若被指向路径文件被重新创建，死链接可恢复为正常的软链接）。
