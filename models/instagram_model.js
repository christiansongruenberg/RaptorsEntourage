/**
 * Created by Christianson on 10/09/2015.
 */
var mongoose = require('mongoose'),
    ig = require('instagram-node').instagram(),
    players = require('../player_info.js'),
    util = require('util');

var schema = new mongoose.Schema({
    created_time : Date,
    instagramObject: Object,
    id : String
}, {collection: "instagrams"});

module.exports = mongoose.model('instagram', schema);