# problem-killer （**简单易用的刷题工具**）

> 基于vue+element实现，所有数据存在浏览器端。
> 
> 不需要数据库，不需要服务器。

<p align="center">
<a href="https://github.com/serfend/problem-killer/releases"><img alt="GitHub release" src="https://img.shields.io/github/release/serfend/problem-killer.svg?style=flat-square" /></a>
<a href="https://github.com/serfend/problem-killer/releases"><img alt="GitHub All Releases" src="https://img.shields.io/github/downloads/serfend/problem-killer/total.svg?style=flat-square&color=%2364ff82" /></a>
<a href="https://github.com/serfend/problem-killer/commits"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/serfend/problem-killer.svg?style=flat-square" /></a>
<a href="https://github.com/serfend/problem-killer/actions/workflows/node.js.yml"><img alt="GitHub Workflow Status" src="https://github.com/serfend/problem-killer/actions/workflows/node.js.yml/badge.svg" /></a>
</p>

## **在线体验**

体验地址：[prokill.serfend.top](http://prokill.serfend.top)

## 使用方法

- 方法一：直接运行
  
  - [下载最新发布的部署包](https://github.com/serfend/problem-killer/releases)，选中其中的`server.zip`文件下载
  - 解压下载好的zip文件
  - 双击运行`http_server.exe`，点击开始，然后使用谷歌浏览器访问 [http:\\电脑的ip地址](http://127.0.0.1)即可
    - ![image-20220508154407390](https://raw.githubusercontent.com/serfend/res.image.reference/main/image-20220508154407390.png)

- 方法二：下载静态资源包使用http服务运行
  
  - [下载最新发布的部署包](https://github.com/serfend/problem-killer/releases)，选中其中的`static.zip`文件下载
  - 解压下载好的zip文件
  - 使用任意方式开启一个http服务，**例如**python在当前目录启用http服务方法 `python -m http.server 80`

- 方法三：使用[node环境](http://nodejs.cn/)部署和运行
  
  - ```shell
    npm install
    npm run dev
    ```
  
  - 运行完成后将自动打开网站

## 功能

- 题库静态加载和统计
- 范围选取（可以灵活选择一个题库中的某个范围内的题）
- 随机题序（将选中的题目顺序打乱）
- 刷题模式（类似于背单词软件的直接选中功能）
- 急速模式（正确的题目将直接提交）
- 斩杀模式（题目完成后将会隐藏起来方便思维聚焦）
- 筛选连对（错题本模式）（只显示连对次数少于某次的题）
- 题目解析和历史统计
- 无限模式（完成一轮后点击立即开始下一轮）

## 演示

### 主页（目前只有`答题`菜单可用）

- ![image-20220505104416266](https://raw.githubusercontent.com/serfend/res.image.reference/main/image-20220505104416266.png)

### 题库选取

- ![image-20220509130912157](https://raw.githubusercontent.com/serfend/res.image.reference/main/image-20220509130912157.png)

### 题库设置

- 在 `data\problems\index.json`中设置题库目录。
- 在`data\problems\database\XXXXX.json`中设置题目内容，文件名与index.json中对应即可，可参考默认案例。
  
  ```json5
  {
      "problems":[
          {
              "content":"单选题干",
              "options":["选项A","选项B","选项C"],
              "analysis":"这题选C",
              "answer":3
          },
          {
              "content":"单选题干",
              "options":["选项A","选项B","选项C"],
              "analysis":"这题选C，同时支持选项引用，这里{{OPT:3}}选项是正确答案",
              "answer":3
          },
          {
              "content":"多选题干",
              "options":["选项A","选项B","选项C"],
              "analysis":"这题选AC",
              "answer":[1,3]
          },
          {
              "content":"多选题干",
              "options":["选项A","选项B","选项C"],
              "analysis":"这题选A",
              "answer":[1] // 数组表示是多选题
          },
          {
              "content":"判断题题干",
              "analysis":"解析也可以不写，直接去掉这个字段即可",
              "answer":true // 布尔类型表示是判断题
          },
          {
              "content":"填空题题干，早上好，{{ANS}}，晚上好。\n一二{{ANS}}四五",
              "answer":["中午好","三"] // 字符串数组表示是填空题
          },
          {
              "content":"简答题题干",
              "answer":"这里填入答案" // 字符串表示是简答题
          },
      ]
  }
  ```

### 刷题

- ![image-20220509130817277](https://raw.githubusercontent.com/serfend/res.image.reference/main/image-20220509130817277.png)

### 题目解析和统计

> 第一次做题时候不会有统计，以后再次刷到这个题的时候则会显示该题的历史做题记录

- ![image-20220509131007779](https://raw.githubusercontent.com/serfend/res.image.reference/main/image-20220509131007779.png)

- 刷题模式
  
  > 如果选中该模式，则将会显示`会做`和`不会做`按钮，点击按钮可以直接完成该题的训练。适合填空题这种输入答案比较慢的题快速刷题。

### 移动端

- 总览
  - ![image-20220509131549430](https://raw.githubusercontent.com/serfend/res.image.reference/main/image-20220509131549430.png)
- 题库选取
  - ![image-20220509131043667](https://raw.githubusercontent.com/serfend/res.image.reference/main/image-20220509131043667.png)
- 刷题设置
  - ![image-20220509131103681](https://raw.githubusercontent.com/serfend/res.image.reference/main/image-20220509131103681.png)
- 刷题
  - ![image-20220509131127594](https://raw.githubusercontent.com/serfend/res.image.reference/main/image-20220509131127594.png)

## 关于

如果存在bug或意见

​    您可以在 [issue](https://github.com/serfend/problem-killer/issues) 中提出

​    或在 [pull request](https://github.com/serfend/problem-killer/pulls) 中提交您的代码

**成为贡献者！**

## 状态

![Alt](https://repobeats.axiom.co/api/embed/63b53df1ed2f24fae0e0a5ba87f10a785cbd5e27.svg "Repobeats analytics image")
