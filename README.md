aph-cli -- APH命令行工具
===

## Install

```
$ npm i -g aph-cli
```

全局安装`aph-cli`后，可以通过`aph ser`命令，开启本地随启随用的静态文件服务器，并且拥有api动态数据的反向代理（反向代理对接APH系统，关于`APH`系统[请看这里](https://github.com/liujinyu1029/APH)）

PS:因为APH地址可能会随时调整，所以`config/index.js`中对接APH的系统地址的配置，放在了线上维护 http://liujinyu.xyz/resources/config/aph-cli.json


## help
```js
$ aph -h

APH命令行工具

Options:
  -V,  --version        output the version number
  -h,  --help           output usage information

Commands:
  ser            启动一个当前目录的http(s)服务
  login          登录APH，输入用户名、密码
  logout         logout退出登录的账号
```

```js
$ aph ser -h

Usage: aph ser [options]

Options:
  -p, --port   Specify a http port                        [default: "8080"]
  -o, --open   Open in browser when http server launched  [default: true]
  -s, --ssl    Enable https                               [default: true]
  -d, --php    Enable PHP parser(by local php-fpm cgi)    [default: false]
  -H, --host   Specify host                               [default: "0.0.0.0"]
  -r, --root   root dir                                   [default: "./"]
  -P, --proxy  Enable http proxy                          [default: ""]
  -h, --help   Help infomation
```

## Usage

1、登录APH系统，没有账号的，请先到APH系统注册账号
```js
$ aph login

     _      ____    _   _
    / \    |  _ \  | | | |
   / _ \   | |_) | | |_| |
  / ___ \  |  __/  |  _  |
 /_/   \_\ |_|     |_| |_|

-------------------- 登录APH -------------------
? 请输入你的APH用户名: liujinyu
? 请输入密码: 123456
[登录成功] liujinyu
```

2、启动server服务
```js
// 创建本地服务器根目录
$ mkdir myServer && cd myServer

// 创建根目录下的首页
$ curl http://liujinyu.xyz -o index.html

// 启动本地服务，会自动在浏览器打开，会匹配内网地址，方便发给同事联调
$ aph ser

  Available on:
  https://127.0.0.1:8080
  https://192.168.59.165:8080
  https://192.168.2.1:8080
  Hit CTRL-C to stop the server

// 改变服务参数，修改启动服务的假域名与端口号
$ aph ser -H my.liujinyu.com -p 8888

  Available on:
  https://my.liujinyu.com:8888
  Hit CTRL-C to stop the server
```

3、退出登录`aph logout`。切换账号时要先`aph logout`退出当前账号，再`aph login`登录新账号

```r
$ aph logout

--------------- 正在退出当前账号 ---------------
  [退出成功] 请重新登录

```

4、查看aph系统的地址 `aph show`

```r
$ aph show

[APH代理服务器地址] http://liujinyu.xyz:8089
[APH控制台页面地址] http://liujinyu.xyz:8090

```

5、`aph cope` 复制a文件部分内容替换到b文件。注意：必须要用`<!--aph[n]begin-->`XXXXX`<!--aph[n]end-->`来标记内容范围。如下例：从a.html文件复制部分内容替换到b.vm文件内


```r
// a.html
<html>
  <body>
    <div>1111</div>
    <!-- aph 1 begin -->
    <div>2222</div>
    <!--aph 1 end-->
    <div>3333</div>
    <!-- aph 2 begin -->
    <div>4444</div>
    <!--aph 2 end-->
    <div>5555</div>
  </body>
</html>  

// b.vm
<div>
  <div>ssss</div>
  <!-- aph 1 begin -->
  <!--aph 1 end-->
  <div>xxxx</div>
  <!-- aph 2 begin -->
  <!--aph 2 end-->
</div>

$ aph cope ./a.html ./b.vm

[替换成功]：局部标记为 <!-- aph 1 begin -->
[替换成功]：局部标记为 <!-- aph 2 begin -->

//替换成功后 b.vm 为
<div>
  <div>ssss</div>
  <!-- aph 1 begin -->
  <div>2222</div>
  <!--aph 1 end-->
  <div>xxxx</div>
  <!-- aph 2 begin -->
  <div>4444</div>
  <!--aph 2 end-->
</div>

```


## 用途

1. 借助APH，使得像anywhere起的静态服务中也能跑出数据，完全模拟线上，本地可以各种测试。
2. 在进行非spa项目开发时，不用借助java、php等提供的服务支持，不用搭建沉重的java等环境
3. 非spa也能像spa的开发模式一样，跑出本地数据来。模拟线上，快速排错

## 关键词

前端开发与后台完全解耦、非SPA如何在本地跑出动态数据、前后端都能用的工具

## aph-cli 诞生缘由

SPA在webpack的支撑下，使开发与生产环境得以分开，使得开发环境得以注入大量可能：本地dev-server、热更新、api反向代理，开始名为‘工程’、‘框架’，结合mock使的前后端开发实现解耦，一飞冲天。

但是这些情况还并不适用非SPA应用，例如摸版型动态页面的开发方式，如asp等，还是依赖在后台框架，前端开发必须先搭建后台环境，十分耽误时间，在这种场景下，诞生了aph-cli，一个命令行式的server工具。

aph-cli = anywhere + aph反向代理 = 完全拟态线上环境

能干什么：

1、解耦非SPA应用与后台的联系，前端无需本地搭建后台环境，使得单个html页面也能不依赖与java、c#起的服务，就开始dev的开发模式：本地server、mock数据、线上api实时对接。而且实现方式就是简单的一个命令：`aph ser`

一些撕逼用途：

1、线上出错时，定位是数据的问题，还是前端交互的问题，容易扯皮，但是线上数据不可造，而拉到本地后，可以解除aph随意造各种数据，来复现错误，定位追踪错误
2、后台开发有些部门，没有线上权限，要本地盲写代码，然后同步到服务器端，才能查看效果，磨平数据接口问题相对路径