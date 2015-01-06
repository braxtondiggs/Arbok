$(function() {
    var domain = "localhost",
        remote_server = "http://" + domain + ":5000/",
        socket = io.connect('http://' + domain + ':5000', {
            secure: false
        }),
        server_id = localStorage.getItem("server"),
        track_id = null,
        customtrack_id = null,
        playlist = [],
        current = 0,
        joind = false,
        hasVoted = parseInt(localStorage.getItem("hasVoted"), 10) || 0,
        music_bar = $(".music-bar").clone(),
        uid = Math.floor(Math.random() * 100);
    $(".artist_info .bio").dotdotdot({
        watch: true,
        height: 75,
        after: "i.readmore"
    });
    $(".menu-button").on("click", function() {
        $(this).toggleClass("closing opening").css({
            'background-color': '#666'
        }).delay(150).queue(function() {
            $(this).css({
                'background-color': 'transparent'
            });
            $(this).dequeue();
        });
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
        var position = {
            coords: {
                latitude: 38.903274,
                longitude: -77.021602
            }
        };
        onSuccess(position);
        PageSwitch("servers");
        return false;
    });
    $(".search").on("keyup", function() {
        if ($(this).val().length >= 1) {
            $(".clear-search").fadeIn();
        } else {
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
        playSong($(this).data("id"));
    });
    $(".artist_info .videography, .artist_info .featured").on("click", "div.video", function() {
        playSong($(this).data("id"));
    });
    $("#search-artist").on("click", "li", function() {
        getArtistInfo($(this).data("id"));
        console.log($(this).data("id"));
        PageSwitch("artist_info");
        return false;
    });
    $(".servers > ul").on("click", "li", function() {
        server_id = $(this).data("id");
        connect2Server();
        localStorage.setItem("server", server_id);
        PageSwitch("homepage");
        MenuItem($(".menu-browse"));
        return false;
    });
    $(".vote-info, .queue_list").on("click", ".vote-data", function() {
        socket.emit('vote', {
            uid: uid,
            sid: server_id,
            tid: $(this).parents(".music-bar, li").data("id"),
            vote: $(this).data("vote")
        });
        localStorage.setItem("hasVoted", ($(this).data("vote")) ? 1 : -1);
        voteAction($(this).children('i'));
        return false;
    });
    $(".music-bar .music-info").on("click", function() {
        $(".menu-title .current").text("What's Playing");
        if ($(".queue_list > li").length === 0) {
            $(".empty-queue").show();
        } else {
            $(".empty-queue").hide();
        }
        PageSwitch("queue");
        return false;
    });
    $(".queue .queue_list").on("click", "li .music-info, li.album-cover", function() {
        getArtistInfoSlug($(this).parent("li").data("artist-id"));
        PageSwitch("artist_info");
        return false;
    });
    $(".artist_info .bio").on("click", function() {
        $(this).trigger("destory");
        return false;
    });
    socket.on('new song', function(data) {
        console.log("new song");
        playlist.push(data);
        updateUserQueue(data);
        Player(current);
        localStorage.setItem("hasVoted", 0);
    });
    socket.on('next song', function(data) {
        nextSong();
    });
    socket.on('vote info', function(data) {
        if (data.success) {
            $(".vote-info").parents(".music-bar, li").each(function() {
                if ($(this).data('id')) {
                    if ($(this).data('id') == data.track_id) {
                        $(this).find(".vote-info .upvote").text(data.upvote).end().find(".vote-info .downvote").text(data.downvote);
                    }
                }
            });
        }
    });
    socket.on('vote off', function(data) {
        if (data.track_id !== track_id) {
            connect2Server();
        }else {
            setTimeout(function() {
                nextSong();
            }, 11000);
        }
    });
    socket.on('connect', function() {
        connect2Server();
    });
    updateMusic();
    if (hasVoted === 1) {
        voteAction($('.vote-info i.glyphicon-thumbs-up'));
    } else if (hasVoted === -1) {
        voteAction($('.vote-info i.glyphicon-thumbs-down'));
    }
    function nextSong() {
        $('.music-bar .vote-info i.selected').removeClass("selected");
        $(".queue_list > li:first-child").fadeOut("slow", function() {
            $(this).remove();
        });
        if (playlist.length - 1 > current) {
            current++;
            Player(current);
        } else {
            current++;
            Player(current, true);
        }
    }
    function connect2Server() {
        socket.emit('subscribe', {
            room: server_id
        }, function(confirm) {
            joined = confirm.joined;
        });
        socket.emit('get playlist', {
            sid: server_id
        }, function(confirm) {
            playlist = confirm;
            console.log(playlist);
            current = 0;
            Player(current);
            $(".queue .queue_list").html("");
            $.each(playlist, function(k, v) {
                updateUserQueue(v);
            });
        });
    }

    function Player(id, empty) {
        var image = "http://placehold.it/50x50",
            artist = "Tap Here to Add More!",
            track = "No Songs Currently Playing",
            upvote = 0,
            downvote = 0;
        empty = empty || false;
        $(".music-bar .vote-info").hide();
        console.log(playlist[id] + "&&" + !empty + " " + id);
        if (playlist[id] && !empty) {
            image = playlist[id].image;
            track = unescape(playlist[id].track);
            artist = unescape(playlist[id].artist);
            upvote = playlist[id].upvote;
            downvote = playlist[id].downvote;
            track_id = playlist[id].track_id;
            $(".music-bar .vote-info").css("display", "inline-block");
        }
        $(".music-bar").data("id", track_id).find(".album-cover img").prop("src", image).end().find(".music-info h3").text(track).next("p").text(artist);
        $(".vote-info").find(".upvote").text(upvote).end().find(".downvote").text(downvote);
        customtrack_id =  track_id;
    }

    function PageSwitch(page) {
            $("ul#pages").children("li.active").removeClass("active").end().children("li." + page).addClass("active").animate({
                scrollTop: 0
            }, 0);
            if (page !== "search-page") {
                removeSearch();
            }
        }
        //alert("hi");
        //console.log("hello");

    function playSong(_track_id) {
        if (confirm("Add this song?")) {
            if (server_id) {
                socket.emit('add song', {
                    server_id: server_id,
                    track_id: _track_id
                }, function(confirm) {
                    console.log(confirm);
                    if (confirm.status === 0) {
                        alert("This song is already in the queue! Try a diffrent song.");
                    } else if (confirm.status === 1) {
                        alert("Your song is now in the queue! Sit back and jam.");
                    } else {
                        alert("A Serious Error Occured, Sorry Bro!");
                    }
                });
            } else {
                alert("You Need to First Select a MVPlayer");
                var position = {
                    coords: {
                        latitude: 38.903274,
                        longitude: -77.021602
                    }
                };
                onSuccess(position);
                PageSwitch("servers");
            }
        }
        return false;
    }

    function getArtistInfoSlug(artist_slug) {
        $.ajax({
            type: "GET",
            crossDomain: true,
            async: false,
            url: remote_server + "music/search",
            data: {
                e: artist_slug
            }
        }).done(function(data) {
            console.log(data.results[0].id);
            getArtistInfo(data.results[0].id);
        });
    }

    function getArtistInfo(artist_id) {
        $.ajax({
            type: "GET",
            crossDomain: true,
            async: false,
            url: remote_server + "music/artist",
            data: {
                e: artist_id
            }
        }).done(function(data) {
            $(".menu-title .current").text((data.name !== null) ? data.name : convertSlug(data.slug));
            $(".artist_info").find(".img-thumbnail").prop("src", checkImage(data.image)).end().find(".bio").trigger("update").show().end().find(".videography, .featured").html("");
            loadVideos("videography", data.artist_videos.videos);
            loadVideos("featured", data.featured_artist_videos.videos);

            function loadVideos(section, videos) {
                $.each(videos, function(k, v) {
                    $(".artist_info ." + section).append($("<div />", {
                        class: "col-md-6 video",
                        "data-id": v.id
                    }).append($("<img />", {
                        src: v.image.l
                    })).append($("<div />", {
                        class: "video_info"
                    }).append($("<h3 />").text(v.song_title)).append($("<p />").text(v.artists[0].name))));
                });
            }
        });
    }

    function updateUserQueue(data) {
        $(music_bar).find(".album-cover img").prop("src", data.image).end().find(".music-info h3").text(data.track).end().find(".music-info p").text(data.artist).end().find(".vote-info span.upvote").text(data.upvote).end().find(".vote-info span.downvote").text(data.downvote);
        $(".queue .queue_list").append($("<li />", {
            "data-artist-id": data.imvdbartist_id,
            "data-id": data.track_id
        }).html($(music_bar).html()));
    }

    function search() {
        var s = $("input.search").val(),
            artist = [];
        $.ajax({
            type: "GET",
            crossDomain: true,
            url: remote_server + "music/search",
            data: {
                v: s
            }
        }).done(function(data) {
            $("#search-tracks, #search-artist").html("");
            $.each(data.results, function(k, v) {
                $("#search-tracks ").append($("<li />", {
                    "data-id": v.id
                }).append($("<img />", {
                    src: v.image.b
                })).append($("<div />", {
                    "class": "track-wrapper"
                }).append($("<h5 />").text(v.artists[0].name)).append($("<p />").text(v.song_title))));
            });

            $.ajax({
                type: "GET",
                crossDomain: true,
                url: remote_server + "music/search",
                data: {
                    e: s
                }
            }).done(function(data) {
                $.each(data.results, function(k, v) {
                    $("#search-artist ").append($("<li />", {
                        "data-id": v.id
                    }).append($("<img />", {
                        src: checkImage(v.image)
                    })).append($("<div />", {
                        "class": "artist-wrapper"
                    }).append($("<h5 />").text((v.name !== null) ? v.name : convertSlug(v.slug)))));
                });
            });
        });
    }

    function convertSlug(slug) {
        return slug.replace("-", " ").replace("-", " ").replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function checkImage(img) {
        return (img.slice(-3) === "jpg") ? img : "http://placehold.it/125x70";
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
        }).done(function(data) {
            $("#best_new_music .carousel-inner").html("");
            var sections = ["best_new_music", "brand_new_music", "top_week_music", "top_month_music", "top_all_music"];
            $.each(data, function(k, v) {
                var len = $("#" + sections[v.section] + " .carousel-inner > div").length;
                if (len <= 10) {
                    $("#" + sections[v.section] + " .carousel-inner").append($("<div />", {
                        "class": "item" + ((len === 0) ? " active" : "")
                    }).append($("<div />", {
                        class: "col-lg-2"
                    }).append($("<a />", {
                            href: "#"
                        }).append($("<img />", {
                            src: v.artist_image,
                            class: "img-responsive"
                        }))
                        /*.append($("<div />", {
                                                "class": "carousel-caption"
                                            }).append($("<h3 />").text((len + 1) + "). " + v.artist_title)).append($("<p />").text(v.artist_name)))*/
                    )));
                }
            });
            $('#best_new_music').carousel('pause');
            $('.carousel .item').each(function() {
                var next = $(this).next();
                if (!next.length) {
                    next = $(this).siblings(':first');
                }
                next.children(':first-child').clone().appendTo($(this));

                for (var i = 0; i < 2; i++) {
                    next = next.next();
                    if (!next.length) {
                        next = $(this).siblings(':first');
                    }

                    next.children(':first-child').clone().appendTo($(this));
                }
            });
            $("li.homepage").fadeIn("slow", function() {
                $(this).addClass("active").removeAttr("style");
            });
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

    function voteAction(_this) {
        if (_this !== null) {
            $('.vote-info i.selected').removeClass("selected");
            $(_this).addClass("selected");
        }
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
            data: {
                lat: lat,
                lng: lng,
                distance: 75
            }
        }).done(function(data) {
            console.log(data);
            $.each(data, function(k, v) {
                $(".servers > ul").append($("<li />", {
                    "data-id": v.sid
                }).append($("<img />", {
                    src: "http://placehold.it/125x70"
                })).append($("<div />", {
                    "class": "server-wrapper"
                }).append($("<h5 />").text(v.name)).append($("<p />").text("~ " + (Math.round(v.distance * 1000) / 1000) + " miles")).append($("<a />", {
                    href: "#",
                    class: "join-server"
                }).text("Join"))));
            });
            if (!$(".servers > ul > li").length) {
                $(".servers > ul").text("Currently no MVPlayer servers available");
            }
        });
    }

    function onError(error) {
        alert('code: ' + error.code + '\n' +
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