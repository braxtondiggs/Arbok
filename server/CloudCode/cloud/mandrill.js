var Mandrill = require('mandrill');
Mandrill.initialize('teFqEIqTxBzb_8p6pBMnMw');

Parse.Cloud.define('sendEmail', function(request, response) {
	Mandrill.sendEmail({
		message: {
			text: request.params.msg,
			subject: request.params.subject,
			from_email: request.params.email,
			from_name: request.params.name,
	    to: [
	      {
	      	email: 'braxtondiggs@gmail.com',
	        name: 'MVPlayer | Braxton Diggs'
	      }
	    ]
	  },
	  	async: true
	},{
		success: function(httpResponse) {
			response.success('Email sent!');
		},
		error: function(httpResponse) {
			response.error('Uh oh, something went wrong');
		}
	});
});