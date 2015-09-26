/**
 * Created by Christianson on 05/09/2015.
 */
var socket = io.connect(document.domain + ":" + location.port);

socket.on('connect', function () {
    sessionId = socket.io.engine.id;
    console.log('Connected ' + sessionId);
});

$(document).ready(function(){


    socket.on('newTweet', function(data){
        $("#tweets").prepend('' +
            '<div class="media animated bounceIn newTweet">' +
                '<div class="media-left media-top">' +
                    '<img class ="media-object" src="' + data.profile_image_url + '"/>' +
                '</div>' +
                '<div class="media-body">' +
                    '<h3 class="tweet-name media-heading">' + data.author + '</h3>' +
                    '<p class="tweet-text">' + data.tweet + '</p>' +
                    '<h6 class="tweet-date">' + data.created_at + '</h6>' +
                '</div>' +
            '</div>' +
            '');
        $('.newTweet').linkify();
        console.log(data.tweet);
    });

    $(document).on("click", ".instagram-video", function() {
        console.log(this);
        this.paused?this.play():this.pause();
    });

    $(document).on("click", ".play-button", function() {
        console.log('play-button click');
        $(this).hide();
        console.log($(this).prev());
        var video = $(this).prev();
        video[0].play();
    });
});