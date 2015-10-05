/**
 * Created by Christianson on 28/08/2015.
 */
var express = require('express'),
    twit = require('twitter'),
    ig = require('instagram-node').instagram(),
    path = require('path'),
    fs = require('fs'),
    path = require('path'),
    players = require('./player_info.js'),
    router = require('./routes/routes'),
    util = require('util'),
    morgan = require('morgan'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

var app = express()
    , http = require("http").createServer(app)
    , io = require("socket.io").listen(http);

if (fs.existsSync('config.js')){
    var config = require('./config.js');
}

var mongousername = process.env.mongousername || config.mongolab.username,
    mongopassword = process.env.mongopassword || config.mongolab.password,
    twitterconsumerkey = process.env.twitterconsumerkey || config.twitter.consumer_key,
    twitterconsumersecret = process.env.twitterconsumersecret || config.twitter.consumer_secret,
    twitteraccesskey = process.env.twitteraccesskey || config.twitter.access_token_key,
    twitteraccesssecret = process.env.twitteraccesssecret || config.twitter.access_token_secret
    pusherAppId = process.env.pusherAppId || config.pusher.app_id,
    pusherKey = process.env.pusherKey || config.pusher.key,
    pusherSecret = process.env.pusherSecret || config.pusher.secret;

mongoose.connect('mongodb://' + mongousername + ':' + mongopassword + '@ds035673.mongolab.com:35673/raptors');

var TweetModel = require('./models/models.js'),
    twitter = new twit({
        consumer_key: twitterconsumerkey,
        consumer_secret: twitterconsumersecret,
        access_token_key:twitteraccesskey,
        access_token_secret:twitteraccesssecret
    });

//Set up pusher server
var Pusher = require('pusher');
var pusher = new Pusher({
    appId: pusherAppId,
    key: pusherKey,
    secret: pusherSecret,
    encrypted: true
});

/*app.use(morgan('combined'));*/

var discussionSchema = new mongoose.Schema({
    discussion : String,
    created_at: Date,
    population: Number
}, {collection: 'discussions'});

var DiscussionModel = mongoose.model('discussion', discussionSchema);

var messageSchema = new mongoose.Schema({
    created_at: Date,
    text: String,
    username: String,
    discussion: String
}, {collection: 'messages'});

var MessageModel = mongoose.model('messages', messageSchema);

var storeMessage = function(message){
    console.log('message is ' + message.text);
    var newMessage = new MessageModel ({
        created_at: Date.now(),
        text: message.text,
        username: message.username,
        discussion: message.discussion
    });

    newMessage.save(function(){
       console.log('message saved');
    });
};

var mainPopulationSchema = new mongoose.Schema({
    population: Number
}, {collection: 'mainPopulation'});

var MainPopulationModel = mongoose.model('mainPopulation', mainPopulationSchema);

io.on("connection", function(socket){
    console.log("connected...");

    socket.on('messageSent', function(message){
        storeMessage(message);
        io.emit('messageSent', message);
    });

    socket.on('userAdded', function(discussion){
        console.log('userAdded emitted');
        DiscussionModel.findOne({discussion: discussion}, null, {}, function(err, discussion){
            var populationIncrement = discussion.population + 1;
            DiscussionModel.findOneAndUpdate({discussion: discussion.discussion}, {population: populationIncrement},{}, function(err,doc){
                if (err) throw err;
            });
        })
    });

    socket.on('createDiscussion', function(topic, username){
        console.log(topic + ': created by ' + username );
        var newDiscussion = new DiscussionModel({
            discussion: topic,
            created_at: Date.now(),
            population: 1
        });

        newDiscussion.save(function(){
            console.log('discussion saved');
        });

        this.join(topic);
        io.emit('discussionCreated', newDiscussion, username);
    });

    socket.on('joinMainRoom', function(){
        MainPopulationModel.update({chat:'main'},{$inc:{population: 1}},{}, function(err,doc){
            console.log(doc);
        });
    });

    socket.on('leaveMainRoom', function(){
        MainPopulationModel.update({chat:'main'},{$inc:{population: -1}},{}, function(err,doc){
            console.log(doc);
        });
    });

    socket.on('joinRoom', function(discussion){
        this.join(discussion);
        console.log('Join Discussion: ' + discussion);
        io.emit('userAddedToRoom', discussion);
    });

    socket.on('leaveRoom', function(discussion){
        this.leave(discussion);
        DiscussionModel.findOne({discussion: discussion}, null, {}, function(err, discussion){
            var populationDecrement = discussion.population - 1;
            console.log('leaving discussion: '+discussion);
            DiscussionModel.findOneAndUpdate({discussion: discussion.discussion}, {population: populationDecrement},{}, function(err,doc){
                if (err) throw err;
            });
        })
    });

    socket.on('sendDiscussionMessage', function(message){
        storeMessage(message);
        console.log(message.text + ' to ' + message.discussion);
        io.to(message.discussion).emit('discussionMessage', message);
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

/*setInterval(function(){
    require('./tests/articlePolling.js')();
}, 20000);

setInterval(function () {
    require('./tests/instagramPolling.js')();
}, 30000);*/


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
app.use(bodyParser.json());
app.use(router.routerFunction(DiscussionModel, MessageModel, MainPopulationModel));

http.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

/*
var livereload = require('livereload');
var server = livereload.createServer();
server.watch([__dirname + "/public/", __dirname + '/views/']);*/
