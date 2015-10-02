/**
 * Created by Christianson on 05/09/2015.
 */
/*var socket = io.connect(document.domain + ":" + location.port);

socket.on('connect', function () {
    sessionId = socket.io.engine.id;
    console.log('Connected ' + sessionId);
});*/

$(document).ready(function(){

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

    $(document).on("click", ".chatbox", function(){
        console.log($(this).scrollTop());
        $(this).animate({
            scrollTop: $(this)[0].scrollHeight - $(this)[0].offsetHeight
        }, 200);
    });
});