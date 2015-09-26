/**
 * Created by Christianson on 10/09/2015.
 */
var mongoose = require('mongoose'),
    ig = require('instagram-node').instagram(),
    players = require('../player_info.js'),
    util = require('util');

mongoose.connect('mongodb://cgruenberg:dbdbzdbgt@ds035673.mongolab.com:35673/raptors');
ig.use({client_id:'654ff94de9ee44cead7e4de4891d5d18',
    client_secret: 'e96b9424eee14238a947738fc4e6a753'});

var schema = new mongoose.Schema({
    testObj: Object
}, {collection: "instagrams"});

var ObjModel = mongoose.model('instagram', schema);

/*ig.user_media_recent("1509605543", function(err, medias, pagination, remaining, limit) {
    if (err) throw err;
/!*    console.log(medias[0]);*!/

    var objDoc = new ObjModel({
        testObj: medias[0]
    });

    objDoc.save(function(err){
        if (err) throw err;
        console.log("saved");
    });

});*/

for(var player in players) {
    if (players[player].instagram_ID) {
        ig.user_media_recent(players[player].instagram_ID, function (err, medias, pagination, remaining, limit) {
            if (err) console.log(err);

            medias.forEach(function (media) {
                var objDoc = new ObjModel({
                    testObj: media
                });

                objDoc.save(function (err) {
                    if (err) throw err;
                    console.log("saved");
                });
            });
        })
    }
}