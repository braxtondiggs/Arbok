'use strict';
angular.module('Quilava.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
            $scope.modal.hide();
        },

        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('PlaylistsCtrl', function($scope) {
        $scope.playlists = [{
            title: 'Reggae',
            id: 1
        }, {
            title: 'Chill',
            id: 2
        }, {
            title: 'Dubstep',
            id: 3
        }, {
            title: 'Indie',
            id: 4
        }, {
            title: 'Rap',
            id: 5
        }, {
            title: 'Cowbell',
            id: 6
        }];
    })
    .controller('PlaylistCtrl', function() {})
    .controller('ArtistCtrl', function($scope) {
        $scope.artist ={
            name: 'Weezer',
            img: 'http://imvdb.com/assets/img/n/weezer-music-videos.jpg'
        };
        $scope.artist.videography = [{
            album_img: 'http://ionicframework.com/img/docs/blue-album.jpg',
            artist: 'Weezer',
            title: 'Blue Album'
        }, {
            album_img: 'http://ionicframework.com/img/docs/siamese-dream.jpg',
            artist: 'Smashing Pumpkins',
            title: 'Siamese Dream'
        }, {
            album_img: 'http://ionicframework.com/img/docs/nevermind.jpg',
            artist: 'Nirvana',
            title: 'Nevermind'
        }];
        $scope.artist.featured = [{
            album_img: 'http://ionicframework.com/img/docs/blue-album.jpg',
            artist: 'Weezer',
            title: 'Blue Album'
        }, {
            album_img: 'http://ionicframework.com/img/docs/siamese-dream.jpg',
            artist: 'Smashing Pumpkins',
            title: 'Siamese Dream'
        }, {
            album_img: 'http://ionicframework.com/img/docs/nevermind.jpg',
            artist: 'Nirvana',
            title: 'Nevermind'
        }];
    })
    .controller('QueueCtrl', function($scope) {
        $scope.queue_list = [{
            id: 1,
            album_img: 'http://ionicframework.com/img/docs/blue-album.jpg',
            artist: 'Weezer',
            title: 'Blue Album'
        }, {
            id: 2,
            album_img: 'http://ionicframework.com/img/docs/siamese-dream.jpg',
            artist: 'Smashing Pumpkins',
            title: 'Siamese Dream'
        }, {
            id: 3,
            album_img: 'http://ionicframework.com/img/docs/nevermind.jpg',
            artist: 'Nirvana',
            title: 'Nevermind'
        }];
    })
    .controller('PlayerCtrl', function($scope) {
        $scope.players = [{
            avatar_img: 'http://placehold.it/40x40',
            location_title: 'Casa de Melo',
            distance: 0.5,
            address: '8878 N Front St SE, Washington DC 20067',
            playing_img: 'http://images.imvdb.com/video/662822171196-freddie-gibbs-have-u-seen-her_music_video_ov.jpg?v=2'
        }];
    })
    .controller('ChatCtrl', function($scope, $ionicScrollDelegate) {
        $scope.msg = [{
            from: 'JODY HiGHROLLER',
            body: 'Yeah, neato. I beat up the block like Steven Seagal',
            self: true,
            img: 'http://blogs.villagevoice.com/music/assets_c/2014/01/RiffRaffTweets-thumb-560x439.jpg',
            timestamp: 'Today 7:26PM'
        }, {
            from: 'Andy Milonakis',
            body: 'What\'s up, sonny? Que pasa mijo,  Chillin\' with Rihanna out in Puerto Rico',
            img: 'http://gagorder.me/wp-content/uploads/2013/02/Three-Loco-ft.-Diplo-We-Are-Farmers-Andy-milonakis.jpeg',
            timestamp: 'Today 7:29PM'
        }, {
            from: 'Andy Milonakis',
            body: 'She ate my coconut, cause she thought it was a Zico',
            img: 'http://gagorder.me/wp-content/uploads/2013/02/Three-Loco-ft.-Diplo-We-Are-Farmers-Andy-milonakis.jpeg',
            timestamp: 'Today 7:46PM'
        }, {
            from: 'Dirty Nasty',
            body: 'Neato, still whip it like Devo Cause my dick short and fat like Danny DeVito',
            img: 'http://i.ytimg.com/vi/b01Bnr1aXt8/maxresdefault.jpg',
            timestamp: 'Today 7:47PM'
        }, {
            from: 'Andy Milonakis',
            body: 'I keep it underground, you\'re commercial like Vevo',
            img: 'http://gagorder.me/wp-content/uploads/2013/02/Three-Loco-ft.-Diplo-We-Are-Farmers-Andy-milonakis.jpeg',
            timestamp: 'Today 7:52PM'
        }, {
            from: 'JODY HiGHROLLER',
            body: 'You got a low self-esteem? You can rent my ego',
            self: true,
            img: 'http://blogs.villagevoice.com/music/assets_c/2014/01/RiffRaffTweets-thumb-560x439.jpg',
            timestamp: 'Today 7:59PM'
        }];
        $scope.scrollBottom = function() {
            $ionicScrollDelegate.scrollBottom();
        };
    });