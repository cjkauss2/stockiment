// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set credentials (only need to do it once)
AWS.config.update({
    accessKeyId: 'keyid',
    secretAccessKey: 'accesskey',
    region: 'us-west-2'
});

var sns = new AWS.SNS({apiVersion: '2010-03-31'});


/* Listing Subscriptions to a Topic */
var listParams = {
    TopicArn: 'arn:aws:sns:us-west-2:766206360703:GOOGL_price_is_low', /* required */
};

sns.listSubscriptionsByTopic(listParams, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});


// create a topic in order to test the subscribe function
/* create a topic  */
var params = {
    Name: 'Apple_price_is_low', /* required */
};
sns.createTopic(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});
/* list topics */
sns.listTopics({}, function(err, data) {
    if (err) console.log("list topics err"); // an error occurred
    else     console.log(data.Topics);           // successful response
});



/* subscribe to the topic. 
subscribe a user to a topic (when user adds a stock to their favorite list), 
so that the user can receive message */
var phonenum = '12223331111';
var params = {
    Protocol: 'sms', /* required */
    TopicArn: 'arn:aws:sns:us-west-2:766206360703:Apple_price_is_low', /* required */
    Endpoint: phonenum,
    ReturnSubscriptionArn: true || false
};

sns.subscribe(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});


/* pulish message to a topic (send SMS messages to multiple phone numbers) */
var pubParams = {
    Message: 'Apple stock price is Low..', /* required */
    TopicArn: 'arn:aws:sns:us-west-2:766206360703:Apple_price_is_low'
};
sns.publish(pubParams, function(err, data) {
    if (err) console.log("publish err"); // an error occurred
    else     console.log("publish sucess");           // successful response
});


/* unsubscribe a user from a topic */
var unsubParams = {
    SubscriptionArn: 'arn:aws:sns:us-west-2:766206360703:Apple_price_is_low:c0cdb129-680d-4e72-a6c4-fa811d62d2a0' /* required */
};
sns.unsubscribe(unsubParams, function(err, data) {
    if (err) console.log("unsub err"); // an error occurred
    else     console.log(data);           // successful response
});