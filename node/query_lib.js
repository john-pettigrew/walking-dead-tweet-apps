var async = require('async');

exports.findTotalTweets = function(tweetsCollection){
  var p = new Promise(function(resolve, reject){
    tweetsCollection.find({}).count(function(err, res){
      if(!err){
        resolve(res);
      }else{
        reject(err);
      }
    });
  });
  return p;
};

exports.countTweetsPerDay = function(tweetsCollection){

  var p = new Promise(function(resolve, reject){
    tweetsCollection.aggregate(
      [
        {
          $group: {
            _id:  "$now.dayOfYear",
            count: {$sum: 1}
          }
        }
      ],
      function(err, res){
      if(!err){
        resolve(res);
      }else{
        reject(err);
      }
    });
  });
  return p;
};

exports.countTweetsForDay = function(tweetsCollection, day){

  var p = new Promise(function(resolve, reject){

    tweetsCollection.aggregate(
      [
        {
          $match:{
            "now.dayOfYear": day
          }
        },
        {
          $group: {
            _id: "$now.dayOfYear",
            number: {$sum: 1}
          }
        }
      ],
      function(err, res){
      if(!err){
        resolve(res);
      }else{
        reject(err);
      }
    });
  });
  return p;
};

exports.countTweetsPerHour = function(tweetsCollection){

  var p = new Promise(function(resolve, reject){
    tweetsCollection.aggregate(
      [
        {
          $group: {
            _id: "$now.hour",
            number: {$sum: 1}
          }
        }
      ],
      function(err, res){
      if(!err){
        resolve(res);
      }else{
        reject(err);
      }
    });
  });
  return p;
};

exports.mostUsedTweetWords = function(tweetsCollection){

  var p = new Promise(function(resolve, reject){

    tweetsCollection.mapReduce(
      //map
      function(){
        var self = this;
        self.text = self.text.toLowerCase();


        //remove some punctuation
        this.text = this.text.replace(/\./g, '').replace(/\!/g, '').replace(/\,/g, '').replace(/\?/g, '').replace(/\)/g, '').replace(/\(/g, '').replace(/\-/g, '').replace(/\_/g, '');

        var invalidWords = ['\\n', '\n', '\r', '\\r', '\"', '\'', 'for', 'and'];
        invalidWords.forEach(function(invalidWord){
          self.text = self.text.replace((new RegExp(invalidWord, 'g')), ' ');
        });


        //convert to array
        var wordsFromTweet = this.text.split(' ');

        //emit words
        for(var wordIndex in wordsFromTweet){
          if(wordsFromTweet[wordIndex] && wordsFromTweet[wordIndex].length > 2){
            emit(wordsFromTweet[wordIndex], 1);
          }
        }
      },
      //reduce
      function(word, freq){
        //count the number of times the word was used
        return freq.length;
      },
      {
        query: {},
        out: {inline: 1}
      },
      function(err, results){
        if(!err){
          //sort results
          async.sortBy(
            results,
            function(word, wordCallback){
              wordCallback(null, (-1 * (word.value)));
            },
            function(err, sortedResults){
              //return top results
              resolve(sortedResults.slice(0, 40));
            }
          );

        }else{
          reject(err);
        }
      }
    );
  });
  return p;
};
