/**
 * Created by Christianson on 02/09/2015.
 */

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
/*    user_ID: Number,*/
    tweet_ID: String,
/*    tweet: String,
    screen_name: String,
    profile_image_url: String,*/
    created_at: Date,
/*    entities: Object,
    extended_entities: Object*/
    tweetObject: Object
}, {collection: "tweeters"});

module.exports = mongoose.model('tweeters', schema);

