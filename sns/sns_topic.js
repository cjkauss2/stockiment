// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
//var uuid = require('uuid');

// Set credentials (only need to do it once)
AWS.config.update({
  accessKeyId: 'AKIA3EZLVHR7ZZFIPU6Q',
  secretAccessKey: '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',
  region: 'us-west-2'
});

var sns = new AWS.SNS({apiVersion: '2010-03-31'});

/* test whether credentials are loaded */
AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
    console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
  }
});


/* create a topic */
// parameter for 
var params = {
    Name: 'GOOGL_price_is_low', /* required */
};
sns.createTopic(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log("Topic ARN is " + data.TopicArn);           // successful response
});


/* list topics */
sns.listTopics({}, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});


/* delete a topic */
var params = {
    TopicArn: 'arn:aws:sns:us-west-2:766206360703:GOOGL_price_is_low' /* required */
};
sns.deleteTopic(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});


/* Getting Topic Attributes */
var params = {
    TopicArn: 'arn:aws:sns:us-west-2:766206360703:GOOGL_price_is_low' /* required */
};
sns.getTopicAttributes(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});
