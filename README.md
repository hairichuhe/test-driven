# Nodejs的测试和测试驱动开发
测试是保证软件质量必不可少的一环。测试有很多形式：手动、自动、单元测试等等。这里我们只聊使用Mocha这个框架在Nodejs中实现单元测试。单元测试是测试等重要组成，这样的测试只对于一个方法，这样的一小段代码，实施有针对的测试。

这里会逐步深入的讲解单元测试。首先是最简单的单元测试，没有外部依赖，只有简单的输入。接着是实用Sino框架实现stub等有依赖的测试。最后讲解如何单元测试异步代码。

** [参考链接](http://www.jianshu.com/p/abf6551d72b3) **

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
```
// tests/part1/cart-summary-test.js
var chai=require('chai');
var expect=chai.expect;
var CartSummary=require("./../../src/part1/cart-summary");

describe('cartSummary',function(){
	it('如果传空数组进去， getSubtotal方法 将会返回0',function(){
		var cartSummary=new CartSummary([]);
		expect(cartSummary.getSubtotal()).to.equal(0);
	})
})
```
describe方法是用来创建一组测试的，并且可以给这一组测试一个描述。一个测试就用一个it方法。it方法的第一个参数是一个描述。第二个参数是一个包含一个或者多个assertion的方法。

运行测试只需要在项目的根目录运行命令行：mocha tests －－recursive －－watch。recursive指明会找到根目录下的子目录的测试代码并运行。watch则表示Mocha会监视源代码和测试代码的更改，每次更改之后重新测试。
![](img/1.png)

我们测试不过，因为还没有完成功能代码。添加代码：

```
// src/part1/cart-summary.js

function CartSummary () {};

CartSummary.prototype.getSubtotal = function(){
	return 0;
};

module.exports=CartSummary;
function CartSummary () {};

CartSummary.prototype.getSubtotal = function(){
	return 0;
};

module.exports=CartSummary;
```
![](img/2.png)

下一个测试：
```
it('这个测试返回所有商品的总价值',function(){
	var cartSummary=new CartSummary([{
	    id: 1,
	    quantity: 4,
	    price: 50
	  }, {
	    id: 2,
	    quantity: 2,
	    price: 30
	  }, {
	    id: 3,
	    quantity: 1,
	    price: 40
	  }]);
	expect(cartSummary.getSubtotal()).to.equal(300);
});
```
这个测试时失败的。。。
![](img/3.png)
下面就来修改代码，让测试通过：
```
// tests/part1/cart-summary-test.js
var chai=require('chai');
var expect=chai.expect;
var CartSummary=require("./../../src/part1/cart-summary");

describe('cartSummary',function(){
	it('如果传空数组进去， getSubtotal方法 将会返回0',function(){
		var cartSummary=new CartSummary([]);
		expect(cartSummary.getSubtotal()).to.equal(0);
	});
	it('这个测试返回所有商品的总价值',function(){
		var cartSummary=new CartSummary([{
		    id: 1,
		    quantity: 4,
		    price: 50
		  }, {
		    id: 2,
		    quantity: 2,
		    price: 30
		  }, {
		    id: 3,
		    quantity: 1,
		    price: 40
		  }]);
		expect(cartSummary.getSubtotal()).to.equal(300);
	});
});
```
![](img/4.png)

## Stub和Sinon
假设我们现在需要给CartSummary添加getTax方法。最终的使用看起来是这样的：
```
var cartSummary = new CartSummary([ /* ... */ ]);
cartSummary.getTax('NY', function() {
  // executed when the tax API request has finished
});
```
getTax方法会使用量外的一个tax模块，包含一个calculate的方法。虽然我们还没有实现tax模块，但是我们还是可以完成getTax的测试。该怎么做呢？
首先安装sinon：
```
npm install －－save－dev sinon
```

安装Sinon之后，我们就可以给出tax.calculate的定义了：

```
// src/part1/tax.js
module.exports = {
	calculate:function(subtotal,state.callback){
		//这里完成税费计算
	}
};
```
创建完成tax.calculate之后就可以使用Sinon的魔法了。用Sinon给出一个tax.calculate的零时实现。这个零时的实现就是Stub（也叫做桩）。代码：
```
describe('税费计算测试',function(){
	beforeEach(function(){
		sinon.stub(tax,'calculate',function(subtotal,state,callback){
			setTimeout(function(){
				callback({
					amount:30
				});
			},0);
		});
	});

	afterEach(function(){
		tax.calculate.restore();
	});

	it('getTax()将会执行tax amount的回调方法',function(done){
		var cartSummary = new CartSummary([{
			id: 1,
      quantity: 4,
      price: 50
    }, {
      id: 2,
      quantity: 2,
      price: 30
    }, {
      id: 3,
      quantity: 1,
      price: 40
		}])
	});

	cartSummary.getTax('NY',function(taxAmount){
		expect(taxAmount).to.equal(30);
		done();
	})
})
```
上面已经使用Sinon创建stub方法了。这里再细讲一下。使用sinon.stub方法创建Stub：
```
var stub = sinon.stub(object,'method',func);
```
给object添加一个名称为method（第二个参数）的方法，方法体的实现在第三个参数中给出。

上例中使用的方法体：
```
function(subtotal, state, callback) {
  setTimeout(function() {
    callback({
      amount: 30
    });
  }, 0);
}
```
setTimeout方法是用来模拟真实环境的，在实际使用的时候肯定会有一个异步的网络请求来请求tax服务。方法体的替换在beforeEach里，这些代码会在测试开始之前执行。在所有测试完成之后调用afterEach，并把tax.calculate恢复到原来的模样。

上面的例子也展示了如何测试异步代码。在it方法中指明一个参数（上例使用的是done）。Mocha会传入一个方法，并等待异步代码返回再结束测试。当然，这个等待是由超时时间的，一般是2000毫秒。如果异步代码的测试，没有按照上面的方法写的话，那么所有的测试都会通过。

## Sinon的"间谍"
Sinon的间谍（spy）是用来完成另外一种替身测试的（test double），它可以用来记录方法调用。包括方法的调用次数、调用的时候的参数是什么样的以及是否抛出异常。下面就是更新后的测试：
```
describe('cartSummary',function(){
	beforeEach(function(){
		sinon.stub(tax,'calculate',function(subtotal,state,callback){
			setTimeout(function(){
				callback({
					amount:30
				});
			},0);
		});
	});

	afterEach(function(){
		tax.calculate.restore();
	});


	it('如果传空数组进去， getSubtotal方法 将会返回0',function(){
		var cartSummary=new CartSummary([]);
		expect(cartSummary.getSubtotal()).to.equal(0);
	});
	it('这个测试返回所有商品的总价值',function(){
		var cartSummary=new CartSummary([{
		    id: 1,
		    quantity: 4,
		    price: 50
		  }, {
		    id: 2,
		    quantity: 2,
		    price: 30
		  }, {
		    id: 3,
		    quantity: 1,
		    price: 40
		  }]);
		expect(cartSummary.getSubtotal()).to.equal(300);
	});

	it('getTax()将会执行tax amount的回调方法',function(done){
		var cartSummary = new CartSummary([{
			id: 1,
	      	quantity: 4,
	      	price: 50
	    }, {
	      	id: 2,
	      	quantity: 2,
	      	price: 30
	    }, {
	      	id: 3,
	      	quantity: 1,
	      	price: 40
		}]);
		cartSummary.getTax('NY',function(taxAmount){
			expect(taxAmount).to.equal(30);
			expect(tax.calculate.getCall(0).args[0]).to.equal(300);
			expect(tax.calculate.getCall(0).args[1]).to.equal('NY');
			done();
		});
	});
});
```
在测试中添加了两个expect。getCall用来获取tax.calculate的第一次调用的第一个参数值，第二个getCall用来获取tax.calculate的第一次调用的第二个参数。主要可以用来检测被测试方法的参数是否正确。

## 总结
在本文中探讨了如何在Node中使用Mocha以及Chai和Sinon实现单元测试。希望各位喜欢。

## 附件（测试案例启用流程）
**电脑必须装有node环境**

1.浏览器打开[https://github.com/hairichuhe/test-driven](https://github.com/hairichuhe/test-driven)

2.已压缩包的形式将代码下载到本地并解压出来
![](img/5.png)
![](img/6.png)

3.进入到项目目录下的node-testing文件夹中，并在当前文件夹中打开命令行
![](img/7.png)
![](img/8.png)

4.在当前命令行中安装mocha
```
npm install mocha -g
```
![](img/9.png)
5.在当前命令行中执行npm install 命令
![](img/10.png)

6.执行单元测试命令
```
mocha tests --recursive --watch
```
![](img/11.png)

**至此就会看到三个单元测试全部通过**