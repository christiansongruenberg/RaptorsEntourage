/**
 * Created by Christianson on 09/09/2015.
 */
var util = require('util'),
    request = require('request'),
    fs = require('fs'),
    moment = require('moment'),
    ig = require('instagram-node').instagram();

ig.use({client_id:'654ff94de9ee44cead7e4de4891d5d18',
    client_secret: 'e96b9424eee14238a947738fc4e6a753'});

/*ig.user_search('demar_derozan', function(err,users,remaining,limit){
    if (err) console.log(util.inspect(err));
    console.log(users);
});*/

ig.user('11032693', function(err,result,remaining,limit){
    if (err) console.log(util.inspect(err));
    console.log(util.inspect(result));
});

/*ig.user_media_recent('11032693', function(err, medias, pagination, remaining, limit){
    if (err){
        console.log(util.inspect(err));
        throw err;
    }
    console.log(util.inspect(medias));
});*/

ig.user_media_recent('11032693', function(err, medias, pagination, remaining, limit) {
    if(err) throw err;
    fs.writeFile('instaMedia.txt', JSON.stringify(medias), function(err){
        if (err) throw err;
        console.log('media saved');
    });
    console.log(medias[0].images.standard_resolution.url);
    var newDate = new Date(parseInt(medias[0].created_time)*1000);

    console.log(newDate);
/*    console.log(parseInt(medias[0].created_time));*/
});







