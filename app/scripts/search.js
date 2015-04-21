'use strict';
angular.module('Quilava.controllers')
	.controller('SearchCtrl', ['$scope', '$stateParams', '$http', function($scope, $stateParams, $http) {
		if ($stateParams.searchId) {
			$scope.search.term = $stateParams.searchId;
			$scope.doSearch($scope.search.term);
		} else {
			$scope.search = {};
		}
		$scope.doSearch = function(term) {
			$scope.search.loaded = true;
			if (term) {
				$scope.search.loaded = false;
				$http.get(
					$scope.domain + 'music/search?v=' + term
				).success(function(data) {
					$scope.search.tracks = {};
					$scope.search.tracks = data.results;
				});
				$http.get(
					$scope.domain + 'music/search?e=' + term
				).success(function(data) {
					$scope.search.artists = {};
					$scope.search.artists = data.results;
					$scope.search.loaded = true;
				});
				if ($scope.searchHistory.indexOf(term) === -1) {
					$scope.searchHistory.unshift(term);
					if ($scope.searchHistory.length >= 5) {
						$scope.searchHistory = $scope.searchHistory.slice(0, 5);
					}
				}
				//$window.location = '#/app/search/' + term + '/';
			}
		};
	}]);