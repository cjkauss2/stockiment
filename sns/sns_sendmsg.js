// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set credentials (only need to do it once)
AWS.config.update({
    region: 'us-west-2'
});

var sns = new AWS.SNS({apiVersion: '2010-03-31'});


/* Checking If a Phone Number Has Opted Out from receiving SMS messages */
var phonenumPromise = sns.checkIfPhoneNumberIsOptedOut({phoneNumber: '2133334444'}).promise();
// Handle promise's fulfilled/rejected states
phonenumPromise.then(
    function(data) {
      console.log("Phone Opt Out is " + data.isOptedOut);
    }).catch(
      function(err) {
      console.error(err, err.stack);
});


/* Publishing an SMS Message to a phone number (directly, without going thrugh subscribed topics) */
var msg ='stock xx price is low';
var phoneNum = '12171112222'; /* phone number Use E.164 format. without '+' */
// var params = {
//     Message: 'testing cs411 SNS...2nd time', /* required */
//     PhoneNumber: '12178196235',
//   };
sns.publish({Message: msg, PhoneNumber: phoneNum}, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});
