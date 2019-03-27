var app			= require('./app');
var request 	= require('request');
var port		= 479;

var server = require('http').createServer(app);

// Start the server
server.listen(port, function() {
	console.log('Server started on port '+port);
	
	
	var tests = {}
	tests = {
		api:	function(endpoint, params, callback) {
			request({
				url:		"http://localhost:"+port+endpoint,
				method: 	"GET",
				json:		params,
				headers:	{
					env:			'beta',
					'local-test':	'true'
				}
			}, function(error, response, body) {
				var output;
				try {
					output	= JSON.parse(body);
				} catch (e) {
					output	= body;
				}
				
				callback(JSON.stringify(output, null, 4));
				
				//console.log("Output:", JSON.stringify(output, null, 4));
				
				//server.close();
			});
		},
		run:	function() {
			tests.api('/', {}, function(response) {
				console.log(response);
			});
		}
	}
	
	tests.run();
});
