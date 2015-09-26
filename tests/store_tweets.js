/**
 * Created by Christianson on 02/09/2015.
 */
var mongoose = require('mongoose'),
    twit = require('twitter'),
    util = require('util'),
    players = require('../player_info.js'),
    config = require('../config.js');
    twitter = new twit({
        consumer_key: config.twitter.consumer_key,
        consumer_secret:config.twitter.consumer_secret,
        access_token_key:config.twitter.access_token_key,
        access_token_secret:config.twitter.access_token_secret
    });

mongoose.connect('mongodb://' + config.mongolab.username + ':' + config.mongolab.password + '@ds035673.mongolab.com:35673/raptors');

/*var schema = new mongoose.Schema({
    user_ID: Number,
    tweet_ID: String,
    tweet: String,
    screen_name: String,
    profile_image_url: String,
    created_at: Date,
/!*    entities: mongoose.Schema.Types.ObjectId,*!/
    entities: Object,
    extended_entities: Object
}, {collection: "tweeters"});

var tweetModel = mongoose.model('tweeters', schema);*/

var TweetModel = require('../models/models.js')

for (var player in players){
    console.log(player);
    twitter.get('statuses/user_timeline', {user_id: players[player].twitter_ID, count: 200}, function(error, tweets, response){

        tweets.forEach(function(tweet){
            var newTweet = {
/*                user_ID: tweet.user.id,*/
                tweet_ID: tweet.id_str,
/*                tweet: tweet.text,
                screen_name: tweet.user.screen_name,
                profile_image_url: tweet.user.profile_image_url,*/
                created_at: new Date(tweet.created_at),
/*                entities: tweet.entities,
                extended_entities: tweet.extended_entities*/
                tweetObject: tweet
            };

            TweetModel.findOneAndUpdate({"tweet_ID": tweet.id_str} ,newTweet,{upsert: true}, function(err,doc){
                if(err) console.log(err);
            });
        });
    });
}

