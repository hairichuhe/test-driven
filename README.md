# Nodejs的测试和测试驱动开发
测试是保证软件质量必不可少的一环。测试有很多形式：手动、自动、单元测试等等。这里我们只聊使用Mocha这个框架在Nodejs中实现单元测试。单元测试是测试等重要组成，这样的测试只对于一个方法，这样的一小段代码，实施有针对的测试。

这里会逐步深入的讲解单元测试。首先是最简单的单元测试，没有外部依赖，只有简单的输入。接着是实用Sino框架实现stub等有依赖的测试。最后讲解如何单元测试异步代码。

文／uncle_charlie（简书作者）
原文链接：http://www.jianshu.com/p/abf6551d72b3
著作权归作者所有，转载请联系作者获得授权，并标注“简书作者”。

## 安装Mocha 和Chai
安装Mocha：
```
npm install mocha －g
```
Mocha和其他的javascript单元测试框架，如：jasmine和QUnit不同，他没有assertion库。但是，Mocha允许你实用你自己的。最流行的Assertion库有should.js、expect.js和Chai，当然Nodejs内置的也可以使用。这里我们用Chai。

首先创建一个package.json并安装Chai：
```
npm install chai --save-dev
```
Chai包含三种assertion方式：should方式、expect方式和assert方式。个人喜欢expect式的，所以下面就使用这个方式了。

## 第一个Test

[项目代码](https://github.com/hairichuhe/test-driven)

第一个例子，我们用测试驱动开发（TDD）的方式创建一个CartSummary的构造函数，这个函数会用来计算购物车的商品总数。测试驱动开发就是在实现功能之前先写单元测试，这样来驱动你设计可以与测试相适应的代码。

测试驱动开发的步骤：

    写一个测试，并且这个测试会失败。
    写最少的代码来使整个测试可以通过。
    重复。

来看代码：