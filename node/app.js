var settings = require('./settings.json');

var MongoClient = require('mongodb').MongoClient;
var Twitter = require('node-tweet-stream');
var moment = require('moment');
var t = new Twitter(settings);

MongoClient.connect('mongodb://mongo:27017/walking_dead', function(err, db){
  if(!err){

    var tweetsCollection = db.collection('tweets');

    t.on('tweet', function(tweet){

      //Add data to help queries later
      var now = moment(tweet.timestamp_ms, 'x').utc();
      tweet.now = {};
      tweet.now.dayOfYear = now.dayOfYear();
      tweet.now.dayOfMonth = now.date();
      tweet.now.dayOfWeek = now.weekday();
      tweet.now.hour = now.hour();
      tweet.now.minute = now.minute();

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
