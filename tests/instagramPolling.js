/**
 * Created by Christianson on 26/09/2015.
 */
var util = require('util'),
    ig = require('instagram-node').instagram(),
    players = require('../player_info.js');

if (fs.existsSync('config.js')){
    var config = require('./config.js');
}
InstagramModel = require('../models/instagram_model.js');

/*console.log("ig ID is:  " + process.env.igClientId);
console.log("ig Secret is:  " + process.env.igClientSecret);
console.log("mongopassword is: " + mongopassword);*/

var igClientId = process.env.igClientId || config.instagram.client_id,
    igClientSecret = process.env.igClientSecret || config.instagram.client_secret;



ig.use({client_id: igClientId ,
    client_secret: igClientSecret});

module.exports = function() {
    console.log("instagram polling...");
    for (var player in players) {
        if (players[player].instagram_ID) {
            ig.user_media_recent(players[player].instagram_ID, function (err, medias, pagination, remaining, limit) {
                if (err) console.log(err);

                medias.forEach(function (media) {
                    var instagramPost = {
                        created_time: new Date(parseInt(media.created_time) * 1000),
                        instagramObject: media,
                        id: media.id
                    };

                    /*                instagramPost.save(function(err){
                     if (err) throw err;
                     console.log("gram saved");
                     });*/

                    InstagramModel.findOneAndUpdate({"id": media.id}, instagramPost, {upsert: true}, function (err, doc) {
                        if (err) console.log(err);
                        //console.log("upserted");
                    });
                });
            })
        }
    }
};