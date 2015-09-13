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
        //Tweets per day
        queryLib.countTweetsPerDay(tweetsCollection)
        .then(
          function(days){

            console.log('\nTWEETS PER DAY');
            days.forEach(function(day){
              console.log(moment(day._id, 'DDD').format('MM-DD-YYYY') + ' ' + day.count);
            });
            console.log('------------------------');

            //tweets per hour
            queryLib.countTweetsPerHour(tweetsCollection)
            .then(
              function(hours){

                console.log('\nTWEETS PER HOUR');
                hours.forEach(function(hour){
                  console.log(hour._id + ' ' + hour.number);
                });

                console.log('------------------------');
                
                queryLib.countTweetsForDay(tweetsCollection, 1)
                .then(
                  function(day){
                    console.log('\nTWEETS FOR DAY');
                    console.log(day);
                    process.exit();

                  }
                )
                .catch(queryError);

              }
            )
            .catch(queryError);

          }
        )
        .catch(queryError);

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
