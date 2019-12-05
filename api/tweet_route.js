const express = require('express');
const Tweet = require('./tweet_model');
const tweetRouter = express.Router();

// get all the interesting tweets from tweets table
// post : add a new tweet
tweetRouter.route('')
  .get((req, res) => {
    Tweet.find({}, (err, item) => {
        res.json(item)
    })
  })
  .post((req, res) => {
        let new_tweet = new Tweet(req.body);
        new_tweet.save();
        res.status(201).send(new_tweet);
        console.log("posted!");
  })

module.exports = tweetRouter;