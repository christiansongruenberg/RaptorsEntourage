/**
 * Created by Christianson on 26/09/2015.
 */
var feed = require('feed-read'),
    newsOutlets = require('../news_outlets.js'),
    RssModel = require('../models/rssarticles_model.js');

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
/*        console.log("Article Upserted");*/
    });
};

module.exports = function() {
    console.log("articles polling...");
    for (var outlet in newsOutlets) {
        feed(newsOutlets[outlet], function (err, articles) {
            articles.forEach(function (article) {
                storeArticle(article);
            });
        });
    }
};