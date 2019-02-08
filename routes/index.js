var express = require('express');
var router = express.Router();
var Paypal = require('../controllers/paypal');

/* GET home page. */
router.get('/data', function (req, res, next) {	

	var response = {};

	response.userid = req.query.userid;
	response.username = req.query.username;

	Paypal.getClientToken(function (token) {
		if (token) {
			response.token = token;
			Paypal.getPlansAvailable(function (plans) {
				if (plans) {
					response.plans = plans;
					res.render('index', {
						page: 'home',
						data: response
					});
				}
			});
		}
	});
});

/* POST Value for subscription */
router.post('/subscribe', function (req, res) {
	var nonce = req.body.payment_method_nonce;
	var plan = req.body.plan;

	console.log('subscribe button Firebase Id: ' + req.query.userid);
	console.log('subscribe button User Name: ' + req.query.username);

	var userid = req.query.userid;
	var username = req.query.username;

	if (nonce && plan) {
		Paypal.createSubscription(plan, nonce, userid, username, function (subscribed) {
			if (subscribed) {

				res.redirect('https://urltv-mcbattlearena.firebaseapp.com/home/one');

				/*res.render('index', {
					page: 'subscribed',
					data: JSON.stringify(subscribed, null, 3)
				});*/
			} else {
				// TODO: Something went wrong report back to user
				res.status(404).send('Service is not avialble at this time');
			}
		});
	} else {
		res.status(401).send('Unauthorized!');
	}
});

module.exports = router;
