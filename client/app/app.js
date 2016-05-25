'use strict';

angular.module('arbokApp', [
        'arbokApp.constants',
        'ngRoute',
        'ngMessages',
        'ngStorage',
        'ngDialog',
        'ngAnimate',
        'ngMaterial',
        'ngIdle',
        'ngLodash',
        'angularMoment',
        'youtubePlayer',
        'firebase',
        '720kb.fx'
    ])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    }).directive('compareTo', function() {
        return {
            require: 'ngModel',
            scope: {
                otherModelValue: '=compareTo'
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue === scope.otherModelValue;
                };

                scope.$watch('otherModelValue', function() {
                    ngModel.$validate();
                });
            }
        };
    });
