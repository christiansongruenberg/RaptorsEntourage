/**
 * Created by Christianson on 14/09/2015.
 */
var rapsApp = angular.module('raptorsEntourageApp', ['ngRoute', 'ngSanitize', 'infinite-scroll', 'pusher-angular']);

rapsApp.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'html/news.html',
            controller: 'newsController'
        })
        .when('/twitter',{
            templateUrl: 'html/twitter.html',
            controller: 'twitterController'
        })
        .when('/instagram',{
            templateUrl: 'html/instagram.html',
            controller: 'instagramController'
        });
});

rapsApp.controller('twitterController', ['$scope','$location','$http', '$log','$timeout', function($scope, $location, $http, $log, $timeout){

    $scope.counter = 0;

    $http.get('/getTweets').success(function(data){
        $scope.tweets = data.tweets;

        $timeout(function(){
            $log.log(angular.element($('.tweet-text')));
            angular.element($('.tweet-text')).linkify();
            }
            , 1000);

    });

    $scope.players = {
        "Bebe Nogueira" : {
            twitter_ID: 180032892,
            instagram_ID: "1509605543"
        },
        "Bismack Biyombo" : {
            twitter_ID: 273532957
        },
        "Bruno Caboclo" : {
            twitter_ID: 2515059460,
            instagram_ID: "285901596"
        },
        "Cory Joseph" : {
            twitter_ID: 279697145,
            instagram_ID: "1469384191"
        },
        "Delon Wright" : {
            twitter_ID: 3225971468,
            instagram_ID: "1742843330"
        },
        "Demar DeRozan" : {
            twitter_ID: 43658360,
            instagram_ID: "11032693"
        },
        "Demarre Carroll" : {
            twitter_ID: 332627423,
            instagram_ID: "1694451619"
        },
        "James Johnson" : {
            twitter_ID: 3033470114
        },
        "Jonas Valanciunas" : {
            twitter_ID: 2227318080,
            instagram_ID: "743177498"
        },
        "Kyle Lowry" : {
            twitter_ID: 28066436,
            instagram_ID: "1331661501"
        },
        "Luis Scola" : {
            twitter_ID: 117618450
        },
        "Norman Powell" : {
            twitter_ID: 155674676,
            instagram_ID: "20845570"
        },
        "Patrick Patterson" : {
            twitter_ID: 55749605,
            instagram_ID: "183298110"
        },
        "Raptors Entourage": {
            twitter_ID: 3486135013,
            instagram_ID: "2178280818"
        },
        "Shannon Scott" : {
            twitter_ID: 1671866024
        },
        "Terrance Ross" : {
            twitter_ID: 231335961,
            instagram_ID: "594752713"
        }
    };

    $scope.showingPlayers = [
        43658360, 273532957, 2515059460, 332627423,
        3033470114, 279697145, 28066436, 180032892,
        55749605, 155674676, 231335961, 117618450,
        1671866024, 2227318080, 3225971468, 3486135013];

    $scope.toggleSelection = function toggleSelection(playerID){
        var index = $scope.showingPlayers.indexOf(playerID);
        if (index > -1){
            $scope.showingPlayers.splice(index, 1);
        } else {
            $scope.showingPlayers.push(playerID)
        }
    };

    $scope.twitterFilter = function (tweet){
        if($scope.showingPlayers.indexOf(tweet.tweetObject.user.id) > -1 ){
            return true;
        } else {
            return false;
        }
    };



    $scope.getMoreTweets = function getMoreTweets(){
        $log.log("get tweets called");
        if ($scope.counter > 0 ) {
            $http.get('/getTweets/' + $scope.counter).success(function (data) {
                $scope.tweets = $scope.tweets.concat(data.tweets);

            });
        }
        $scope.counter += 1;
        $timeout(function(){
                $log.log(angular.element($('.tweet-text')));
                angular.element($('.tweet-text')).linkify();
            }
            , 1000);
    };

    $scope.$on('$viewContentLoaded', function(){
        console.log("logged");
    });

}]);

rapsApp.controller('newsController', ['$scope','$location','$http', '$log', '$sce', function($scope, $location, $http, $log, $sce){
    $scope.counter = 0;
    $scope.articles = [];
    $http.get('/getNews').success(function(data){
        $scope.articles = data.articles;
        for(var i = 0; i < $scope.articles.length; i++){
            $scope.articles[i].content = $sce.trustAsHtml($scope.articles[i].content);
        }
    });

    $scope.outlets = {
        "Courtside": "http://blogs.canoe.com/courtside/feed/",
        "Raptors Cage" : "http://www.raptorscage.ca/feed/",
        "Real GM" : "http://basketball.realgm.com/rss/wiretap/26/28.xml",
        "Raptors HQ": "http://www.raptorshq.com/rss/current",
        "Raptors Recap" : "http://www.raptorsrecap.com/feeds/posts/default?alt=rss",
        "Raptors Republic": "http://feeds.feedburner.com/RaptorsRepublic?fmt=xml",
        "Raptors Watch" : "http://raptorswatch.com/feed/"
    };

    $scope.showingOutlets = [
        "http://www.raptorshq.com/rss/current",
        "http://feeds.feedburner.com/RaptorsRepublic?fmt=xml",
        "http://basketball.realgm.com/rss/wiretap/26/28.xml",
        "http://blogs.canoe.com/courtside/feed/",
        "http://raptorswatch.com/feed/",
        "http://www.raptorsrecap.com/feeds/posts/default?alt=rss",
        "http://www.raptorscage.ca/feed/"];

    $scope.toggleSelection = function toggleSelection(outletName){
        var index = $scope.showingOutlets.indexOf(outletName);
        if (index > -1){
            $scope.showingOutlets.splice(index, 1);
        } else {
            $scope.showingOutlets.push(outletName)
        }
    };



    $scope.articleFilter = function articleFilter(article){
        if($scope.showingOutlets.indexOf(article.feed.source) > -1 ){
            return true;
        } else {
            return false;
        }
    };

    $scope.getMoreArticles = function getMoreArticles(){
        $log.log("get news called");
        if ($scope.counter > 0 ) {
            $http.get('/getNews/' + $scope.counter).success(function (data) {
                for(var i = 0; i < data.articles.length; i++){
                    data.articles[i].content = $sce.trustAsHtml(data.articles[i].content);
                }
                $scope.articles = $scope.articles.concat(data.articles);

            });
        }
        $scope.counter += 1;
    }

}]);

rapsApp.controller('instagramController', ['$scope','$location','$http','$sce','$log', function($scope, $location, $http, $sce, $log){
    $scope.counter = 0;

    $scope.players = {
        "Bebe Nogueira" : {
            twitter_ID: 180032892,
            instagram_ID: "1509605543"
        },
        "Bruno Caboclo" : {
            twitter_ID: 2515059460,
            instagram_ID: "285901596"
        },
        "Cory Joseph" : {
            twitter_ID: 279697145,
            instagram_ID: "1469384191"
        },
        "Delon Wright" : {
            twitter_ID: 3225971468,
            instagram_ID: "1742843330"
        },
        "Demar DeRozan" : {
            twitter_ID: 43658360,
            instagram_ID: "11032693"
        },
        "Demarre Carroll" : {
            twitter_ID: 332627423,
            instagram_ID: "1694451619"
        },
        "Jonas Valanciunas" : {
            twitter_ID: 2227318080,
            instagram_ID: "743177498"
        },
        "Kyle Lowry" : {
            twitter_ID: 28066436,
            instagram_ID: "1331661501"
        },
        "Norman Powell" : {
            twitter_ID: 155674676,
            instagram_ID: "20845570"
        },
        "Patrick Patterson" : {
            twitter_ID: 55749605,
            instagram_ID: "183298110"
        },
        "Raptors Entourage": {
            twitter_ID: 3486135013,
            instagram_ID: "2178280818"
        },
        "Terrance Ross" : {
            twitter_ID: 231335961,
            instagram_ID: "594752713"
        }
    };

    $scope.showingPlayers = [
        "594752713","2178280818","183298110","20845570",
        "1331661501","743177498","1694451619","11032693",
        "1742843330","1469384191","285901596","1509605543"];

    $scope.toggleSelection = function toggleSelection(playerID){
        var index = $scope.showingPlayers.indexOf(playerID);
        if (index > -1){
            $scope.showingPlayers.splice(index, 1);
        } else {
            $scope.showingPlayers.push(playerID)
        }
    };

    $scope.instagramFilter = function (instagram){

        if($scope.showingPlayers.indexOf(instagram.instagramObject.user.id) > -1 ){
            return true;
        } else {
            return false;
        }
    };

    $http.get('/getInstagrams').success(function(data){
        $scope.instagrams = data.instagrams;
        for (var i = 0; i < $scope.instagrams.length; i++){
            if ($scope.instagrams[i].instagramObject.videos) {
                $scope.instagrams[i].instagramObject.videos.standard_resolution.url = $sce.trustAsResourceUrl($scope.instagrams[i].instagramObject.videos.standard_resolution.url);
            }
        }

    });

    $scope.getMoreGrams = function getMoreGrams(){

        if ($scope.counter > 0 ) {
            $http.get('/getInstagrams/' + $scope.counter).success(function (data) {
                for (var i = 0; i < data.instagrams.length; i++){
                    if (data.instagrams[i].instagramObject.videos) {
                        data.instagrams[i].instagramObject.videos.standard_resolution.url = $sce.trustAsResourceUrl(data.instagrams[i].instagramObject.videos.standard_resolution.url);
                    }
                }
                $scope.instagrams = $scope.instagrams.concat(data.instagrams);

            });
        }
        $scope.counter += 1;
    };
}]);

var client = new Pusher('e007ecf99bcbd70051de');

rapsApp.controller('chatController', ['$scope','$pusher','$log','$http', function($scope, $pusher, $log, $http){

    var pusher = $pusher(client);
    pusher.subscribe('test_channel');
    pusher.subscribe('second');
    $scope.username = 'CGruenberg';

    pusher.bind('my_event', function(data){
        angular.element($('.chat-messages')).append('<p>'+ $scope.username + ': ' + data.message + '</p>');
        //$log.log(angular.element($('.chat-box')));
    });

    $scope.sendMessage = function(){
        $http.post('/messageSent',{message: $scope.message});
        $scope.message = '';
    }

}]);

rapsApp.directive('navButtons', function(){
   return{
       templateUrl: '/html/templates/navButtons.html'
   }
});

/*
rapsApp.directive('showonhoverparent', function(){
    return {
        link: function(scope,element, attrs){
            element.parent().bind('mouseenter', function(){
               element.show();
            });
            element.parent().bind('mouseleave', function(){
               element.hide();
            });
        }
    }
});*/
