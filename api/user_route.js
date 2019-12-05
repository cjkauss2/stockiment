const express = require('express');
const User = require('./user_model');
const userRouter = express.Router();
var AWS = require('aws-sdk');
// Set credentials (only need to do it once)
AWS.config.update({
  accessKeyId: 'AKIA3EZLVHR74OXH6S62',
  secretAccessKey: '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',
  region: 'us-west-2'
});
var sns = new AWS.SNS({apiVersion: '2010-03-31'});
// get all users' json
// post : add a new user to user table
userRouter.route('')
  .get((req, res) => {
    User.find({}, (err, item) => {
        res.json(item)
    })
  })
  .post((req, res) => {
        let new_user = new User(req.body);
        new_user.save();
        res.status(201).send(new_user);
        console.log("posted!");
  })

// get the favorite list for a specified user
// put : add item to fav list. e.g: "stock": "UBER"
userRouter.route('/:userId')
  .get((req, res) => {
    User.findById(req.params.userId, (err, item) => {
        res.json(item.favorite)
    })
  })
  .put((req,res) => {
    User.findById(req.params.userId, (err, item) => {
        item.favorite.push(req.body.stock);
        item.save();
        res.json(item)
        var phonenum = item.phone.toString()
        var stock = req.body.stock
        var params = {
          Protocol: 'sms', /* required */
          TopicArn: 'arn:aws:sns:us-west-2:766206360703:' + stock, /* required */
          Endpoint: phonenum,
          ReturnSubscriptionArn: true || false
        };
        sns.subscribe(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
        });
        console.log("pass");
    })
  
  })

userRouter.route('/:userId/:deleteTicker')
  .delete((req,res) => {
    User.findById(req.params.userId, (err, item) => {
        item.favorite.pull(req.params.deleteTicker);
        item.save();
        res.json(item)
    })
  })

module.exports = userRouter;