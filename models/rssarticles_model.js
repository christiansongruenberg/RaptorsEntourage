/**
 * Created by Christianson on 11/09/2015.
 */

var mongoose = require('mongoose');

var rssSchema = new mongoose.Schema({
    title: String,
    author: String,
    link: String,
    content: String,
    published: Date,
    feed: Object
},{collection: "rss"});

module.exports = mongoose.model('rss', rssSchema);