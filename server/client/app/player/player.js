'use strict';

angular.module('serverApp')
    .config(function($routeProvider) {
        $routeProvider
            .when('/player', {
                templateUrl: 'app/player/player.html',
                controller: 'PlayerCtrl'
            })
            .when('/player/debug', {
                templateUrl: 'app/player/player.html',
                controller: 'PlayerCtrl'
            })
            .when('/player/box', {
                templateUrl: 'app/player/player.html',
                controller: 'PlayerCtrl'
            })
            .when('/player/code', {
                templateUrl: 'app/player/player.html',
                controller: 'PlayerCtrl'
            });
    })
    .run(function($rootScope, $cookies, ngDialog) {
        $rootScope.$on('ngDialog.opened', function() {
            Parse.initialize('GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k', 'WdvDW26S4r3o5F35HCC9gM5tAYah3tyTwXlwRBvE');
            var theForm = document.getElementById('theForm');
            setTimeout(function() {
                new stepsForm(theForm, {
                    onSubmit: function(form) {
                        // hide form
                        var f = $(form).serializeArray();
                        console.log(f);
                        var geocoder = new google.maps.Geocoder();
                        geocoder.geocode({
                            'address': f[1].value
                        }, function(results, status) {
                            classie.addClass(theForm.querySelector('.simform-inner'), 'hide');
                            var PlayerObject = Parse.Object.extend('Player');
                            var playerObject = new PlayerObject();
                            var lat = results[0].geometry.location.D;
                            var lng = results[0].geometry.location.k;
                            playerObject.save({
                                name: f[0].value,
                                UserId: Parse.User.current().id,
                                address: f[1].value,
                                latlng: new Parse.GeoPoint(lng, lat),
                                image: 'http://placehold.it/40x40'
                            }).then(function(object) {
                                // let's just simulate something...
                                var messageEl = theForm.querySelector('.final-message');
                                messageEl.innerHTML = 'The player will start now. Enjoy!';
                                classie.addClass(messageEl, 'show');
                                var socket = io.connect();
                                socket.emit('player:update', {
                                    room: object.id,
                                    boxCode: (f[2] !== undefined)?f[2].value:null
                                });
                            });
                        });
                    },
                    onNext: function() {
                        var colors = ['#3498DB', '#2ecc71'];
                        jQuery('.ngdialog .ngdialog-content').animate({
                            backgroundColor: colors[Math.floor(Math.random() * colors.length)]
                        }, 500);
                    }
                });
            }, 50);
        });
    })
    .factory('socket', function($rootScope) {
        var socket = io.connect();
        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };

    });