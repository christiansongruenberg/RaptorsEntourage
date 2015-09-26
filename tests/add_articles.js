/**
 * Created by Christianson on 11/09/2015.
 */
var feed = require('feed-read'),
    newsOutlets = require('../news_outlets.js'),
    RssModel = require('../models/rssarticles_model.js'),
    config = require('../config.js'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://' + config.mongolab.username + ':' + config.mongolab.password + '@ds035673.mongolab.com:35673/raptors');

function storeArticle(article){
    var rss = {
        title: article.title,
        author: article.author,
        link: article.link,
        content: article.content,
        published: article.published,
        feed: article.feed
    };

    RssModel.findOneAndUpdate({"title": article.title} ,rss,{upsert: true}, function(err,doc){
        if(err) console.log(err);
        console.log("Article Upserted");
    });
};

for(var outlet in newsOutlets){
    feed(newsOutlets[outlet], function(err, articles){
       articles.forEach(function(article){
          storeArticle(article);
       });
    });
}



