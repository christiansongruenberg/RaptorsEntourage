/**
 * Created by Christianson on 01/09/2015.
 */
var moment = require('moment'),
    tweet = require('./tweet_object.js')

var now = moment();
var nowDateObject = now.toDate();
var tweetMoment = new Date(tweet.created_at);



console.log(tweetMoment);
console.log(tweet.text);
console.log(now.toDate());
console.log(nowDateObject.getFullYear());