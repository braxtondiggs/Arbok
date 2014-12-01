$(function() {
    var domain = "192.168.1.13",
        remote_server = "http://"+domain+":5000/",
        socket = io.connect('http://'+domain+':5000', {secure:false}),
        server_id = localStorage.getItem("server"),
        playlist = null,
        current = 0,
        empty = true;
    $(".menu-button").on("click", function() {
        $(this).toggleClass("closing opening").css({'background-color':'#666'}).delay(150).queue(function(){$(this).css({'background-color':'transparent'});$(this).dequeue();});
        $(".slidr").toggleClass("opened closed");
        return false;
    });
    $(".menu-browse").on("click", function() {
        MenuItem($(this));
        PageSwitch("homepage");
        toggleSlidr();
        return false;
    });
    $(".menu-search").on("click", function() {
        MenuItem($(this));
        toggleSlidr();
        $("header").addClass("search");
        $(".search").trigger("focus");
        return false;
    });
    $(".menu-find").on("click", function() {
        MenuItem($(this));
        toggleSlidr();
        var position = {coords: {latitude: 38.903274, longitude:-77.021602}};
        onSuccess(position);
        PageSwitch("servers");
        return false;
    });
    $(".search").on("keyup", function() {
        if ($(this).val().length >= 1) {
            $(".clear-search").fadeIn();
        }else{
            $(".clear-search").fadeOut();
        }
    });
    $(".clear-search").on("click", function() {
        $(".search").val("");
        $(this).fadeOut();
        return false;
    });
    $("#header-search form").on("submit", function() {
        search();
        $("input.search").trigger("blur");
        PageSwitch("search-page");
        return false;
    });
    $("#search-tracks").on("click", "li", function() {
        var track_id = $(this).data("id");
        socket.emit('add song', {server_id: server_id, track_id: track_id});
        return false;
    });
    $(".servers > ul").on("click", "li", function() {
        server_id = $(this).data("id");
        socket.emit('join server', {server_id: server_id});
        localStorage.setItem("server", server_id);
        //socket.join(server_id);
        PageSwitch("homepage");
        MenuItem($(".menu-browse"));
        return false;
    });
    socket.on("playlist", function(data){
        console.log(data);
    });
    socket.on('new song', function(data) {
        playlist.push(data);
        if (empty === false) {
            current++;
            Player(current);
        }
    });
    socket.on('next song', function(data) {
        if (playlist.length - 1 > current) {
            current++;
            Player(current);
            empty = false;
        }else {
            empty = true;
        }
    });
    socket.on('connect', function() {
        socket.emit('get playlist', {
            sid: server_id
        }, function(confirm) {
            playlist = confirm;
            Player(current);
            empty = false;
        });
    });
    updateMusic();
    function Player(id) {
        var image = "http://placehold.it/50x50",
            artist = "Tap Here to Add More!",
            track = "No Songs Currently Playing";
        if (playlist[id]) {
            image = playlist[id].image;
            track = unescape(playlist[id].track);
            artist = unescape(playlist[id].artist);
        }
        $(".music-bar").find(".album-cover img").prop("src", image).end().find(".music-info h3").text(track).next("p").text(artist);
    }
    function PageSwitch(page) {
        $("ul#pages").children("li.active").removeClass("active").end().children("li."+page).addClass("active");
    }
    function search() {
        var s = $("input.search").val(),
            artist = [];
        $.ajax({
            type: "GET",
            crossDomain: true,
            url: remote_server + "music/search",
            data: {v: s}
        }).done(function(data){
            $(".search-tracks, #search-artist").html("");
            $.each(data.results, function(k, v) {
                $("#search-tracks ").append($("<li />",{"data-id":v.id}).append($("<img />", {src: v.image.b})).append($("<div />", {"class": "track-wrapper"}).append($("<h5 />").text(v.artists[0].name)).append($("<p />").text(v.song_title))));
                if(!isInArray(v.artists[0].name, artist)) {
                    $("#search-artist").append($("<li />",{"data-id":v.id}).append($("<img />", {src: v.image.b})).append($("<div />", {"class": "track-wrapper"}).append($("<h5 />").text(v.artists[0].name))));
                    artist.push(v.artists[0].name);
                }
                console.log(artist);
            });
            function isInArray(value, array) {
              return array.indexOf(value) > -1;
            }
        });
    }
    function toggleSlidr() {
         $(".slidr").toggleClass("opened closed");
         $(".menu-button").toggleClass("closing opening");
         removeSearch();
    }
    function updateMusic() {
        $.ajax({
            type: "GET",
            crossDomain: true,
            url: remote_server + "music"
        }).done(function(data){
            $("#best_new_music .carousel-inner").html("");
            var sections = ["best_new_music", "brand_new_music", "top_week_music", "top_month_music", "top_all_music"];
            $.each(data, function(k, v) {
                var len = $("#"+sections[v.section]+" .carousel-inner > div").length;
                if (len <= 10) {
                    $("#"+sections[v.section]+" .carousel-inner").append($("<div />",{"class":"item" + ((len === 0)?" active":"")}).append($("<img />", {src: v.artist_image})).append($("<div />", {"class": "carousel-caption"}).append($("<h3 />").text((len+1) + "). "+v.artist_title)).append($("<p />").text(v.artist_name))));
                }
            });
            $('#best_new_music').carousel(0);
            $(".homepage").fadeIn("slow", function() {$(this).addClass("active").removeAttr("style");});
        });
    }
    function removeSearch() {
         $("header").removeClass("search");
    }
    function MenuItem(_this) {
         $(".slidr-menu li.active").removeClass("active");
         $(_this).addClass('active');
         $(".menu-title .current").text($(_this).text());
    }
    
    function onSuccess(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        $(".servers > ul").html("");
        $.ajax({
            type: "GET",
            dataType: "json",
            crossDomain: true,
            url: remote_server + "player/search",
            data: {lat: lat, lng: lng, distance: 75}
        }).done(function(data){
            $.each(data, function(k, v) {
                $(".servers > ul").append($("<li />",{"data-id": v.sid}).append($("<img />", {src: "http://placehold.it/125x70"})).append($("<div />", {"class": "server-wrapper"}).append($("<h5 />").text(v.name)).append($("<p />").text("~ "+(Math.round(v.distance * 1000) / 1000)+" miles")).append($("<a />", {href: "#", class:"join-server"}).text("Join"))));
            });
        });
    }
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
});

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    }
};
