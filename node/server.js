var settings = require('./settings.json');

var MongoClient = require('mongodb').MongoClient;
var Twitter = require('node-tweet-stream');
var t = new Twitter(settings);

MongoClient.connect('mongodb://mongo:27017/walking_dead', function(err, db){
  if(!err){

    var tweetsCollection = db.collection('tweets');

    t.on('tweet', function(tweet){

      tweetsCollection.insert(tweet, function(err){
        if(err){
          console.log('SAVE ERROR');
        }
      });
    });

    t.on('error', function(err){
      console.log('ERROR');
      console.log(err);
    });

    t.track('Walking Dead');
    t.track('walking dead');
  }else{
    console.log('Error connecting to mongo server');
  }
});
