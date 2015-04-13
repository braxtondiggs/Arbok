'use strict';

angular.module('serverApp')
.controller('MainCtrl', ['$scope', 'ngDialog', function ($scope, ngDialog) {
	var renderedcount = 0;
	$scope.contact = {};
	$scope.newsletter = {};
	$scope.$on('$includeContentLoaded', function() {
		renderedcount++;
		if (renderedcount === 10) {
			angularContentLoaded();
		}
	});
	$scope.newsletterAdd = function() {
		var Newsletter = Parse.Object.extend("Newsletter");
		var newsLetter = new Newsletter();
		var query = new Parse.Query(Newsletter);
		query.equalTo("email", $scope.newsletter.email);
		query.first({
			success: function(object) {
				if (object == undefined) {
				    newsLetter.set("email", $scope.newsletter.email);
					
					newsLetter.save(null, {
						success: function(newsLetter) {
							//output success
						    console.log(newsLetter);
					  	},
					  	error: function(gameScore, error) {
						    alert('Failed to create new object, with error code: ' + error.message);
					  	}
					});
				}else {
					//output already registered
				}
		  	}
		});
	};
	$scope.contactUs = function() {
		Parse.Cloud.run('sendEmail', {name: $scope.contact.name, email: $scope.contact.email, subject: $scope.contact.subject, msg: $scope.contact.msg}, {
		  success: function(result) {
		  	alert(result);
		  },
		  error: function(error) {
		  	alert(error);
		  }
		});
	};
	$scope.onlinePlayer = function() {
		ngDialog.open({
	        template: 'newsLetterTmpl',
	        className: 'ngdialog-newsletter ngdialog-theme-default'
	    });
	}
}]);
