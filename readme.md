---
title: 自定义一个将图片相对路径在发布时替换为绝对路径的插件
top: 0
date: 2020-02-11 21:31:15
tags:
    - hexo
    - npm
categories: hexo
---

# 笔记

在使用 Hexo 的时候有一个痛点，就是关于图片路径的问题。hexo 官方推荐的是开启`post_asset_folder`并安装`hexo-asset-image`包，每创建一个文件，就创建与之对应名称的文件夹，该文件中的所有引用图片都存放到这个文件夹中，然后在引用的时候通过相对路径引用就可以了。但是并不是所有的文章都包含有图片，或者图片的数量很少，不值当构建一个文件，因为这样很容易引起文件夹结构臃肿。

更理想的方式是在`source/images`目录下按照文章的目录构建子文件夹，然后将各自的图片丢进去，然后在 md 文件中通过相对路径引用，例如我们可能在`source/_posts`下构建一个`android`的文件夹，所有`android`相关的文件都放在这个目录下，而所有的图片都存放在`source/images/android`目录下，然后文章中通过`![备注](../../images/android/bug01.png)`这种方式引用图片，但是在`hexo s`预览和`hexo g`发布状态都不能正确显示图片，所以有没有一种方式就是在发布时将其更改为绝对路径，通过研究 hexo 官方的 api 文档，发现有一个过滤器`before_post_render`可以利用。

## 构建一个 hexo 的插件

### 了解 Hexo 运作模式

研究`Hexo`的项目结构，主要研究页面的编译过程，也就是`Hexo g`命令是如何执行的。

根据`Hexo`的概述，`Hexo`项目的执行过程如下：

1.  初始化
2.  载入文件
3.  执行指令
4.  结束

**第一步：初始化**

初始化阶段，会创建`Hexo`实例，各种配置，各种插件，各种扩展全部就位，就等待载入文章进行处理。

`Hexo`通过项目包管理文件`package.json`引入各种插件扩展。

**第二步：载入文件**

载入`source`下所有的文章及样式、脚本等资源。如有指令，则可以监控该文件下面文件的变化。

**第三步：执行指令**

执行控制台指令，根据指令执行相应的命令。

**第四步：退出**

### 创建一个 npm 包

```sh
# 创建一个文件夹
mkdir hexo-img-path && cd hexo-img-path

# 创建一个npm包
npm init
```

package.json 内容如下：

```json
{
    "name": "hexo-img-path",
    "version": "1.0.0",
    "description": "将hexo中的markdown图片的相对路径更改为绝对路径,使得在markdown预览和发布状态下都能看到图片",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/ANDYGE/hexo-img-path.git"
    },
    "keywords": ["hexo", "image", "path"],
    "author": "geshaofei@126.com",
    "license": "ISC"
}
```

### 添加入口文件

index.js:

```js
var deal_image = function(data) {
    data.content = data.content.replace(
        /!\[(.*?)\]\((\.\.\/)+images\//,
        '![$1](/images/'
    )
}
hexo.extend.filter.register('before_post_render', deal_image, 9)
```

### 将代码上传到 github

```sh
# github上创建仓库

# 本地处理
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/ANDYGE/hexo-img-path.git
git push -u origin master
```

### 发布到 npm 仓库

```sh
# 查看当前的npm源
npm config get registry

# 设置回原本的就可以了
npm config set registry http://registry.npmjs.org

# 登录，需要首先在https://www.npmjs.com/ 注册有账户
npm login

# 发布
npm publish

#发布完成之后,如果还想回到之前的cnpm,使用下面的命令
npm config set registry https://registry.npm.taobao.org
```

### 添加到 hexo 项目引用

可以有两种引用方式

#### npm

```sh
# 两种方式
yarn add hexo-img-path
```

package.json:

```json
"hexo-img-path": "^1.0.0",
```

#### git 下载

在项目的 package.json 的 dependencies 中添加 git 引用方式，如下：

```json
"hexo-img-path": "git+https://github.com/ANDYGE/hexo-img-path.git",
```
