var _			= require("underscore");
var pstack		= require("pstack");
var request		= require("request");



bot = function(core, options) {
	this.core	= core;
	this.oanda	= require("./oanda")(core, {});
}
bot.prototype.refresh = function(callback) {
	var scope	= this;
	this.getAccountStats(function(response) {
		scope.status = response;
		scope.core.log("Oanda", "Account Status", scope.status);
		callback(scope.status);
	});
}
bot.prototype.getAccountStats = function(callback) {
	this.oanda.account.summary(function(response) {
		callback({
			Account: 		response.alias,
			balance: 		response.balance,
			margin: 		(parseFloat(response.marginCallPercent)*100),
			unrealizedPL: 	response.unrealizedPL,
			gain:			(response.NAV-1000)/1000*100
		});
	});
}
bot.prototype.report = function(callback) {
	callback();
	return false;
	
	// Connect your own servers to log positions and account status
	var scope = this;
	var obj = {
		url:		"https://8adtqvu5ne.execute-api.us-east-1.amazonaws.com/Prod/lab/record/agent",
		method: 	"POST",
		json:		{
			agent:		scope.oanda.accId,
			account:	scope.status
		},
		headers:	{
			"Content-Type":		"application/json"
		}
	};
	
	request(obj, function(error, response, body) {
		console.log("/lab/record/agent", body);
		callback(body);
	});
}
bot.prototype.recordPosition = function(position, callback) {
	callback();
	return false;
	
	// Connect your own servers to log positions and account status
	var scope = this;
	var obj = {
		url:		"https://8adtqvu5ne.execute-api.us-east-1.amazonaws.com/Prod/lab/record/position",
		method: 	"POST",
		json:		{
			agent:		scope.oanda.accId,
			position:	{
				type:		parseInt(position.order.orderCreateTransaction.units)<0?"sell":"buy",
				sid:		position.sid,
				instrument:	position.order.orderCreateTransaction.instrument,
				price:		parseFloat(position.order.orderFillTransaction.price),
				takeprofit:	parseFloat(position.order.orderCreateTransaction.takeProfitOnFill.price),
				stoploss:	parseFloat(position.order.orderCreateTransaction.stopLossOnFill.price),
				data:		position
			}
		},
		headers:	{
			"Content-Type":		"application/json"
		}
	};
	
	request(obj, function(error, response, body) {
		console.log("/lab/record/position", body);
		callback(body);
	});
}
bot.prototype.sell = function(options, callback) {
	var scope	= this;
	var stack	= new pstack();
	var buffer	= {
		sid:	'tbmk1-'+this.core.id()
	};
	
	// Open the order
	stack.add(function(done) {
		
		var orderObj	= {
			"units":		(options.size*-1).toString(),
			"instrument":	"EUR_USD",
			"timeInForce":	"FOK",
			"type":			"MARKET",
			"positionFill":	"DEFAULT",
			"clientExtensions": {
				"comment": "tradebot-mk1: trade "+buffer.sid,
				"tag": "tradebot-mk1",
				"id": buffer.sid
			}
		};
		
		if (options.stoploss) {
			orderObj["stopLossOnFill"]	= {
				"timeInForce":	"GTC",
				"price":		options.stoploss
			};
		}
		if (options.takeprofit) {
			orderObj["takeProfitOnFill"]	= {
				"price": options.takeprofit
			};
		}
		
		scope.oanda.orders.open(orderObj, function(response) {
			buffer.order	= response;
			done();
		});
	});
	
	// Record the postion
	stack.add(function(done) {
		scope.recordPosition(buffer, done);
	});
	
	stack.start(function() {
		callback(buffer);
	});
}
bot.prototype.buy = function(options, callback) {
	var scope	= this;
	var stack	= new pstack();
	var buffer	= {
		sid:	'tbmk1-'+this.core.id()
	};
	
	// Open the order
	stack.add(function(done) {
		
		scope.core.log("orders", "options", options);
		
		var orderObj	= {
			"units":		parseInt(options.size).toString(),
			"instrument":	"EUR_USD",
			"timeInForce":	"FOK",
			"type":			"MARKET",
			"positionFill":	"DEFAULT",
			"clientExtensions": {
				"comment": "tradebot-mk1: trade "+buffer.sid,
				"tag": "tradebot-mk1",
				"id": buffer.sid
			}
		};
		
		if (options.stoploss) {
			orderObj["stopLossOnFill"]	= {
				"timeInForce":	"GTC",
				"price":		options.stoploss
			};
		}
		if (options.takeprofit) {
			orderObj["takeProfitOnFill"]	= {
				"price": options.takeprofit
			};
		}
		
		scope.core.log("orders", "orderObj", orderObj);
		
		scope.oanda.orders.open(orderObj, function(response) {
			
			scope.core.log("orders", "response", response);
			
			buffer.order	= response;
			done();
		});
	});
	
	// Record the postion
	stack.add(function(done) {
		scope.recordPosition(buffer, done);
	});
	
	stack.start(function() {
		callback(buffer);
	});
}



module.exports = bot;