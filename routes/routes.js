var router = require('express').Router(),
    util = require('util'),
    TweetModel = require('../models/models.js');
    InstagramModel = require('../models/instagram_model.js'),
    RssModel = require('../models/rssarticles_model.js');

exports.routerFunction = function(pusher){

    router.get('/', function(req,res,next){
        res.render("index", {title: "Raptors Entourage"});
    });

    var amountOfTweets = 10;

    router.get('/getTweets', function(req,res,next){
        TweetModel.find({},null,{limit:amountOfTweets, sort: {created_at: -1}}, function(err, tweets){
            res.json({"tweets": tweets});
        });
    });

    router.get('/getTweets/:index', function(req,res,next){
        var skipTweets = req.params.index*amountOfTweets;
        TweetModel.find({},null,{limit:amountOfTweets, sort: {created_at: -1}, skip: skipTweets}, function(err, tweets){
            res.json({"tweets": tweets});
        });
    });

    var amountOfArticles = 4;

    router.get('/getNews', function(req,res,next){
        RssModel.find({}, null, {limit:amountOfArticles, sort: {published: -1}}, function(err, articles){
            res.json({articles: articles});
        });
    });

    router.get('/getNews/:index', function(req,res,next){
        var skipArticles = req.params.index*amountOfArticles;

        RssModel.find({}, null, {limit:amountOfArticles, sort: {published: -1}, skip:skipArticles}, function(err, articles){
            res.json({articles: articles});
        });
    });

    var amountOfInstagrams = 9;

    router.get('/getInstagrams', function(req,res,next){
        InstagramModel.find({}, null, {limit:amountOfInstagrams, sort: {created_time: -1}}, function(err,instagrams){
            res.json({instagrams: instagrams});
        });
    });

    router.get('/getInstagrams/:index', function(req,res,next){
        var skipInstagrams = req.params.index*amountOfInstagrams;
        InstagramModel.find({}, null, {limit:amountOfInstagrams, sort: {created_time: -1}, skip: skipInstagrams}, function(err,instagrams){
            res.json({instagrams: instagrams});
        });
    });

    router.get('/news', function(req,res,next){
        RssModel.find({}, null, {limit:10, sort: {published: -1}}, function(err, articles){
            res.render("news", {articles: articles});
        });
    });

    router.get('/twitter', function(req,res,next){
        TweetModel.find({},null,{limit:100, sort: {created_at: -1}}, function(err, tweets){
            res.render("twitter", {tweets: tweets});

        });
    });
    router.get('/instagram', function(req,res,next){
        InstagramModel.find({}, null, {limit:21, sort: {created_time: -1}}, function(err,instagrams){
            res.render("instagram", {instagrams: instagrams});

        });
    });

    router.post('/messageSent', function(req,res,next){
        console.log("/messageSent Succesful");
        pusher.trigger('test_channel', 'my_event', {
            "message": req.body.message,
            "username": req.body.username
        });
    });

    return router;
}