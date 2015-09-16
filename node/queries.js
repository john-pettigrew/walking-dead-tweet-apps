var MongoClient = require('mongodb').MongoClient;
var queryLib = require('./query_lib');
var moment = require('moment');

MongoClient.connect('mongodb://mongo:27017/walking_dead', function(err, db){
  if(!err){
    var tweetsCollection = db.collection('tweets');

    //Count all tweets
    queryLib.findTotalTweets(tweetsCollection)
    .then(
      function(tweetNumber){
        console.log('\nNumber of tweets: '+tweetNumber);
        console.log('------------------------');

        return queryLib.countTweetsPerDay(tweetsCollection);
      }
    )
    .then(
      //Tweets per day
      function(days){

        console.log('\nTWEETS PER DAY');
        days.forEach(function(day){
          console.log(moment(day._id, 'DDD').format('MM-DD-YYYY') + ' ' + day.count);
        });
        console.log('------------------------');


        return queryLib.countTweetsPerHour(tweetsCollection);
      }
    )
    .then(
      function(hours){
        //tweets per hour

        console.log('\nTWEETS PER HOUR');
        hours.forEach(function(hour){
          console.log(hour._id + ' ' + hour.number);
        });

        console.log('------------------------');

        return queryLib.countTweetsForDay(tweetsCollection, 1);
      }
    )
    .then(
      function(day){
        console.log('\nTWEETS FOR DAY');
        console.log(day);
        process.exit();

      }
    )
    .catch(queryError);




    function queryError(err){
      console.log('Error');
      console.log(err);
      process.exit();
    }

  }else{
    console.log('Error connecting to mongo server');
  }
});
