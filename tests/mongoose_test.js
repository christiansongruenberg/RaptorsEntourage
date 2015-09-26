/**
 * Created by Christianson on 02/09/2015.
 */
var mongoose = require('mongoose'),
    twit = require('twitter'),
    util = require('util'),
    twitter = new twit({
        consumer_key:'8wZ5oiqWZtTPJAcgxdOIbGp2A',
        consumer_secret:'4RbgL2k0vrfWFiNw2wJKq1vtMxjnuVSr9aetlcsF3JKiNEkZO7',
        access_token_key:'135667016-xvKWQlivNQNjmtuccx0wGySq3XvBIzCnuxQKp6co',
        access_token_secret:'1V1xuT3qGRKciC3qiMi60Nff4eEGjDVtUe68BzUx9vxfU'
    });

mongoose.connect('mongodb://cgruenberg:dbdbzdbgt@ds035673.mongolab.com:35673/raptors');
var schema = new mongoose.Schema({
    user_ID: Number,
    tweet_ID: String,
    tweet: String,
    screen_name: String,
    profile_image_url: String,
    created_at: Date,
    /*    entities: mongoose.Schema.Types.ObjectId,
     extended_entities: mongoose.Schema.Types.ObjectId*/
}, {collection: "tweeters"});

var tweetModel = mongoose.model('tweeters', schema);

tweetModel.find({}, null, {sort:{"created_at" : -1}, limit: 20},function(err, tweets){
    if(err) throw err;
    tweets.forEach(function(tweet){
        console.log(util.inspect(tweet.profile_image_url));
/*       console.log(tweet.created_at + " By: " + tweet.screen_name);*/
   });
});