/**
 * Created by Christianson on 28/08/2015.
 */
var express = require('express'),
    twit = require('twitter'),
    ig = require('instagram-node').instagram();
    path = require('path');
    fs = require('fs');
    path = require('path');
    players = require('./player_info.js'),
    router = require('./routes/routes'),
    util = require('util');
    morgan = require('morgan');
    favicon = require('serve-favicon'),
    mongoose = require('mongoose');

var app = express()
    , http = require("http").createServer(app)
    , io = require("socket.io").listen(http);

if (fs.existsSync('config.js')){
    config = require('./config.js');
}

var mongousername = process.env.mongousername || config.mongolab.username,
    mongopassword = process.env.mongopassword || config.mongolab.password,
    twitterconsumerkey = process.env.twitterconsumerkey || config.twitter.consumer_key,
    twitterconsumersecret = process.env.twitterconsumersecret || config.twitter.consumer_secret,
    twitteraccesskey = process.env.twitteraccesskey || config.twitter.access_token_key,
    twitteraccesssecret = process.env.twitteraccesssecret || config.twitter.access_token_secret;

mongoose.connect('mongodb://' + mongousername + ':' + mongopassword + '@ds035673.mongolab.com:35673/raptors');

var TweetModel = require('./models/models.js'),
    twitter = new twit({
        consumer_key: twitterconsumerkey,
        consumer_secret: twitterconsumersecret,
        access_token_key:twitteraccesskey,
        access_token_secret:twitteraccesssecret
    });



/*app.use(morgan('combined'));*/

io.on("connection", function(socket){
    console.log("connected...");
    socket.on("myEvent", function(socket){
        console.log('my event seen');
    })
});

var followList = '', playerIDArray = [], count = 0;
for (var player in players){
    followList = followList + players[player].twitter_ID + ',';
    playerIDArray[count] = players[player].twitter_ID;
    count++;
}


function upsertTweet(tweet){
    var newTweet = new TweetModel({
        user_ID: tweet.user.id,
        //tweet_ID: tweet.id_str,
        tweet: tweet.text,
        screen_name: tweet.user.screen_name,
        profile_image_url: tweet.user.profile_image_url,
        created_at: new Date(tweet.created_at),
        entities: tweet.entities,
        extended_entities: tweet.extended_entities
    });

    TweetModel.findOneAndUpdate({"tweet_ID": tweet.id_str} ,newTweet,{upsert: true}, function(err,doc){
        if(err) console.log(err);
    });
}

var env = process.env.NODE_ENV || 'development';
console.log(process.env.NODE_ENV);
/*twitter.stream('statuses/filter', {follow: followList}, function(stream){

    stream.on('data', function(data){
        if(!data.delete){
            console.log("Tweet streamed by: " + data.user.screen_name);
            if (playerIDArray.indexOf(data.user.id) > -1) {
                io.sockets.emit('newTweet', {
                    author: data.user.screen_name,
                    tweet: data.text,
                    created_at: data.created_at,
                    profile_image_url: data.user.profile_image_url
                });

                upsertTweet(data);
            }
        }
    });

    stream.on('error', function(error){
        console.log(error);
        throw error;
    });
});*/

setInterval(function(){
    require('./tests/articlePolling.js')();
}, 10000);

/*if (env == 'production') {
    setInterval(function () {
        require('./tests/instagramPolling.js')();
    }, 30000);
}*/

app.set(function(req,res,next){
   res.set("Cache-Control", "no-cache");
    res.set("Content-Type", "text/plain; charset=utf-8");
   next();
});
app.set('port', (process.env.PORT || 3000));
app.use(favicon(__dirname + "/public/images/favicon.ico"));
app.set('views', path.join(__dirname,"views"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(router.routerFunction());

http.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

var livereload = require('livereload');
var server = livereload.createServer();
server.watch([__dirname + "/public/", __dirname + '/views/']);