/**
 * Created by Christianson on 10/09/2015.
 */
var util = require('util'),
    request = require('request'),
    ig = require('instagram-node').instagram(),
    players = require('../player_info.js'),
    config = require('../config.js');
    mongoose = require('mongoose');

    InstagramModel = require('../models/instagram_model.js');

mongoose.connect('mongodb://' + config.mongolab.username + ':' + config.mongolab.password + '@ds035673.mongolab.com:35673/raptors');


ig.use({client_id: config.instagram.client_id,
    client_secret: config.instagram.client_secret});

for(var player in players) {
    if(players[player].instagram_ID) {
        ig.user_media_recent(players[player].instagram_ID, function (err, medias, pagination, remaining, limit) {
            if (err) console.log(err);

            medias.forEach(function(media){
                var instagramPost = {
                    created_time : new Date(parseInt(media.created_time)*1000),
                    instagramObject: media,
                    id: media.id
                };

/*                instagramPost.save(function(err){
                    if (err) throw err;
                    console.log("gram saved");
                });*/

                InstagramModel.findOneAndUpdate({"id": media.id} ,instagramPost,{upsert: true}, function(err,doc){
                    if(err) console.log(err);
                    console.log("upserted");
                });
            });
        })
    }
}



