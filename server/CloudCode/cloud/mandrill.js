'use strict';
var Mandrill = require('mandrill');
Mandrill.initialize('teFqEIqTxBzb_8p6pBMnMw');
/*global Parse*/
/*jshint camelcase: false */
Parse.Cloud.define('sendEmail', function(request, response) {
	Mandrill.sendEmail({
		message: {
			text: request.params.msg,
			subject: request.params.subject,
			from_email: request.params.email,
			from_name: request.params.name,
			to: [{
				email: 'braxtondiggs@gmail.com',
				name: 'MVPlayer | Braxton Diggs'
			}]
		},
		async: true
	},{
		success: function() {
			response.success('Email sent!');
		},
		error: function() {
			response.error('Uh oh, something went wrong');
		}
	});
});