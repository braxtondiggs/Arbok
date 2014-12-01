var coords = {
        lat: 0,
        lng: 0
    },
    sid = localStorage.getItem("QBox") || null,
    tid = null,
    playlist = null,
    current = 0,
    player;

$(function() {
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});
var socket = io.connect();
socket.on('connect', function() {

});
socket.on('playlist', function(data) {
    console.log(data);
});
socket.on('new song', function(data) {
    playlist.push(data);
    if (player.getPlayerState() == YT.PlayerState.ENDED || player.getPlayerState == YT.PlayerState.UNSTARTED) {
        current++;
        PlaySong(current);
    }
});
socket.on('next song', function(data) {
    console.log(playlist.length - 1 + "==" + current);
    if (playlist.length - 1 > current) {
        current++;
        PlaySong(current);
    }
});

function onYouTubeIframeAPIReady() {
    player = new YT.Player('ytapiplayer', {
        height: $(window).height(),
        width: $(window).width(),
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars: {
            'controls': 0,
            'disablekb': 0,
            'showinfo': 0,
            'rel': 0
        }
    });
}

function onPlayerReady(event) {
    //event.target.playVideo();
    getLocation();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        //setTimeout(stopVideo, 6000);
        //done = true;
    } else if (event.data == YT.PlayerState.ENDED) {
        socket.emit('song ended', {
            sid: sid,
            tid: tid
        });
    }
}

function stopVideo() {
    player.stopVideo();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function displayPosition(position) {
    coords.lat = position.coords.latitude;
    coords.lng = position.coords.longitude;

    if (sid === null) {
        socket.emit('server init', {
            location: {
                lat: coords.lat,
                lng: coords.lng
            },
            name: "Casa De Melo"
        }, function(confirm) {
            localStorage.setItem("QBox", confirm['sid']);
            sid = confirm['sid'];
            playlist = confirm.playlist;
        });
    } else {
        socket.emit('get playlist', {
            sid: sid
        }, function(confirm) {
            localStorage.setItem("QBox Playlist", JSON.stringify(confirm));
            playlist = confirm;
            PlaySong(current);
        }); ///localStorage.getItem("QBox Playlist");console.log(playlist)}); // should get frm localSt
    }
    //socket.join(sid);
}

function PlaySong(id) {
    if (playlist[id] && player) {
        player.loadVideoById(playlist[id].youtube_id);
        tid = playlist[id].customtrack_id;
    }
}