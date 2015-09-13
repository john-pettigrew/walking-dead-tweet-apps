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
