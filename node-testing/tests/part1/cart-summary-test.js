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