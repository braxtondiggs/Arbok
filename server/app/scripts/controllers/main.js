'use strict';
angular.module('MVPlayer').controller('MainCtrl', ['$scope', '$window', 'ngDialog', function ($scope, $window, ngDialog) {
	/*global Parse*/
	$scope.contact = {};
	$scope.newsletter = {};
	$scope.$on('$viewContentLoaded', function(){
		angularContentLoaded();// jshint ignore:line
	});
	$scope.newsletterAdd = function() {
		var Newsletter = Parse.Object.extend('Newsletter');
		var newsLetter = new Newsletter();
		var query = new Parse.Query(Newsletter);
		query.equalTo('email', $scope.newsletter.email);
		query.first({
			success: function(object) {
				if (object === undefined) {
				    newsLetter.set('email', $scope.newsletter.email);
					
					newsLetter.save(null, {
						success: function(newsLetter) {
							//output success
						    console.log(newsLetter);
					  	},
					  	error: function(gameScore, error) {
						    $window.alert('Failed to create new object, with error code: ' + error.message);
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
		  	$window.alert(result);
		  },
		  error: function(error) {
		  	$window.alert(error);
		  }
		});
	};
	$scope.onlinePlayer = function() {
		ngDialog.open({
	        template: 'newsLetterTmpl',
	        className: 'ngdialog-newsletter ngdialog-theme-default'
	    });
	};
}]);