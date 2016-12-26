// tests/part1/cart-summary-test.js
var chai=require('chai');
var expect=chai.expect;
var CartSummary=require("./../../src/part1/cart-summary");
var sinon=require('sinon');

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

describe('税费计算测试',function(){
	beforeEach(function(){
		sinon.stub(tax,'calculate',function(subtotal,state,done){
			setTimeout(function(){
				done({
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