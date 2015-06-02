'use strict';
/*global Parse*/
Parse.Cloud.define('LoggerisActive', function(request, response) {
	response.success();
});
Parse.Cloud.job('isActive', function(request, response) {
	Parse.Cloud.useMasterKey();

	var query = new Parse.Query('Player');
	query.equalTo('isActive', true);
	query.lessThanOrEqualTo('updatedAt', new Date(new Date().getTime() - 60 * 60 * 24 * 1000));
	query.find({
		success: function(result) {
			for (var i = 0; i < result.length; i++) {
				result[i].set('isActive', false);
				result[i].save();
			}
			response.success('Success: Rows Affected - ' + result.length.toString());
		},
		error: function() {
			response.error('Lookup Failed');
		}
	});
});