var braintree = require('braintree');
var gateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: "xh3pdcfkffgh6fzd",
	publicKey: "5h3x9kdgnkjybd6h",
	privateKey: "889dde73e1114b9aceca54a24e52b362"
});

var controller = {
	getClientToken: function (callback) {
		gateway.clientToken.generate({}, function (err, response) {
			if (err) {
				callback(err)
			}
			if (response.clientToken) {
				callback(response.clientToken)
			} else {
				callback(response)
			}
		});

	},
	getPlansAvailable: function (callback) {
		gateway.plan.all(function (err, response) {
			if (err) {
				callback(err)
			}
			if (response.plans) {
				callback(response.plans)
			} else {
				callback(response)
			}
		});
	},
	createSubscription: function (plan, nonce, userid, username, callback) {

		console.log('paypal.js User Id: ' + userid);
		console.log('paypal.js User Name: ' + username);
	
		gateway.customer.create({
			firstName: username,
			id: userid,
			paymentMethodNonce: nonce
		}, function (err, result) {
			if (result.success) {
				var token = result.customer.paymentMethods[0].token;
				gateway.subscription.create({
					paymentMethodToken: token,
					planId: plan
				}, function (err, result) {
					callback(result);
				});
			} else {
				callback(undefined);
			}
		});
	}
}
module.exports = controller;
