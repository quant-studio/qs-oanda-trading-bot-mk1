
var _			= require("underscore");
var request		= require("request");
var path		= require("path");
var pstack		= require("pstack");
var fstool		= require("fs-tool");
var fs			= require("fs");


lib = function(core, options) {
	var methods = {};
	methods = {
		apikey:	process.env['OANDA_API_KEY'],
		accId:	process.env['OANDA_ACC'],
		account: {
			summary:	function(callback) {
				methods.get("/accounts/"+methods.accId+"/summary", {
					
				}, function(response) {
					//core.log("Oanda", "account.summary response", response);
					if (response.account) {
						callback(response.account);
					} else {
						callback(core.errorResponse('Error getting the account summary', response));
					}
				});
			},
			instruments:	function(callback) {
				methods.get("/accounts/"+methods.accId+"/instruments", {
					
				}, function(response) {
					//core.log("Oanda", "account.summary response", response);
					if (response.instruments) {
						callback(response.instruments);
					} else {
						callback(core.errorResponse('Error getting the instrument list', response));
					}
				});
			},
		},
		orders: {
			list:	function(callback) {
				methods.get("/accounts/"+methods.accId+"/orders", {
					
				}, function(response) {
					//core.log("Oanda", "orders.list response", response);
					if (response.orders) {
						callback(response.orders);
					} else {
						callback(core.errorResponse('Error getting the orders', response));
					}
				});
			},
			get:	function(orderId, callback) {
				methods.get("/accounts/"+methods.accId+"/orders/"+orderId, {
					
				}, function(response) {
					//core.log("Oanda", "account.summary response", response);
					if (response.order) {
						callback(response.order);
					} else {
						callback(core.errorResponse('Error getting the order details', response));
					}
				});
			},
			open:	function(order, callback) {
				//core.log("Oanda", "Open order: ", order);
				methods.post("/accounts/"+methods.accId+"/orders", {
					order:	_.extend({
						"units":		"1",
						"instrument":	"EUR_USD",
						"timeInForce":	"FOK",
						"type":			"MARKET",
						"positionFill":	"DEFAULT"
					}, order)
				}, function(response) {
					//core.log("Oanda", "account.summary response", response);
					if (response) {
						callback(response);
					} else {
						callback(core.errorResponse('Error open the position', response));
					}
				});
			},
			close:	function(orderId, callback) {
				methods.post("/accounts/"+methods.accId+"/trades/"+orderId+"/close", {
					units:	"ALL"
				}, function(response) {
					//core.log("Oanda", "account.summary response", response);
					if (response) {
						callback(response);
					} else {
						callback(core.errorResponse('Error open the position', response));
					}
				});
			},
			takeProfit:	function(orderId, price, callback) {
				methods.post("/accounts/"+methods.accId+"/orders", {
					order:	{
						"timeInForce":	"GTC",
						"price":		price,
						"type":			"TAKE_PROFIT",
						"tradeID":		orderId
					}
				}, function(response) {
					//core.log("Oanda", "account.summary response", response);
					if (response) {
						callback(response);
					} else {
						callback(core.errorResponse('Error open the position', response));
					}
				});
			},
			stopLoss:	function(orderId, price, callback) {
				methods.post("/accounts/"+methods.accId+"/orders", {
					order:	{
						"timeInForce":	"GTC",
						"price":		price,
						"type":			"STOP_LOSS",
						"tradeID":		orderId
					}
				}, function(response) {
					//core.log("Oanda", "account.summary response", response);
					if (response) {
						callback(response);
					} else {
						callback(core.errorResponse('Error open the position', response));
					}
				});
			}
		},
		post:	function(endpoint, params, callback) {
			methods.api("POST", endpoint, params, callback);
		},
		get:	function(endpoint, params, callback) {
			methods.api("GET", endpoint, params, callback);
		},
		api:	function(method, endpoint, params, callback) {
			var obj = {
				url:		"https://api-fxpractice.oanda.com/v3"+endpoint,
				method: 	method,
				json:		params,
				headers:	{
					"Content-Type":		"application/json",
					"Authorization":	"Bearer "+methods.apikey
				}
			};
			
			//core.log("Oanda", "api obj", obj);
			
			request(obj, function(error, response, body) {
				/*var output;
				try {
					output	= JSON.parse(body);
				} catch (e) {
					callback({
						status:		'Request Error',
						error:		error,
						body:		body,
						response:	response
					});
					return false;
				}
				
				callback(output.body);*/
				callback(body);
			});
		}
	}
	return methods;
}



module.exports = lib;