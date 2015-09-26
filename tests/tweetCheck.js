/**
 * Created by Christianson on 08/09/2015.
 */
/**
 * Created by Christianson on 02/09/2015.
 */
var twit = require('twitter'),
    util = require('util'),
    players = require('../player_info.js'),
    twitter = new twit({
        consumer_key:'8wZ5oiqWZtTPJAcgxdOIbGp2A',
        consumer_secret:'4RbgL2k0vrfWFiNw2wJKq1vtMxjnuVSr9aetlcsF3JKiNEkZO7',
        access_token_key:'135667016-xvKWQlivNQNjmtuccx0wGySq3XvBIzCnuxQKp6co',
        access_token_secret:'1V1xuT3qGRKciC3qiMi60Nff4eEGjDVtUe68BzUx9vxfU'
    });

for (var player in players){
    if(player == "powell"){
        twitter.get('statuses/user_timeline', {user_id: players[player].twitter_ID, count: 22}, function(error, tweets, response){

            tweets.forEach(function(tweet){
                console.log(tweet.created_at + " : " + tweet.text);
                console.log(util.inspect(tweet.entities));
            });
        });
    }
}

