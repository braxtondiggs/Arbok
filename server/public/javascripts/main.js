var coords = {
        lat: 0,
        lng: 0
    },
    sid = localStorage.getItem("QBox") || null,
    tid = null,
    playlist = [],
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
    socket.emit('get playlist', {
        sid: sid
    }, function(confirm) {
        playlist = confirm;
        console.log(playlist);
        current = 0;
        if (playlist.length === 0) {
            emptyQueue();
        }
    });
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
    } else {
        emptyQueue();
    }
});

function onYouTubeIframeAPIReady() {
    player = new YT.Player('ytapiplayer', {
        height: $(window).height(),
        width: $(window).width(),
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        },
        playerVars: {
            'controls': 0,
            'disablekb': 0,
            'showinfo': 0,
            'rel': 0,
            'iv_load_policy':3
        }
    });
}

function onPlayerReady(event) {
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
        console.log("ended");
    }
}

function onPlayerError(event) {
    console.log('error');
    current++;
    socket.emit('song ended', {
        sid: sid,
        tid: tid
    }, function() {
        //window.location.reload();
    });
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
        });
    }
}

function PlaySong(id) {
    if (playlist[id] && player) {
        player.loadVideoById(playlist[id].youtube_id);
        tid = playlist[id].track_id;
        localStorage.setItem("lastArtist", playlist[id].artist);
        player.playVideo();
    }
}

function emptyQueue() {
    socket.emit('empty queue', {
        lastArtist: (localStorage.getItem("lastArtist") || "Taylor Swift"),
        server_id: sid
    });
}