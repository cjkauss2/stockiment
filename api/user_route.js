const express = require('express');
const User = require('./user_model');
const userRouter = express.Router();

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
    })
  })

// remove a specified ticker from this user's fav list
// params: userId-> user name, deleteTicker-> ticker
userRouter.route('/:userId/:deleteTicker')
  .delete((req,res) => {
    User.findById(req.params.userId, (err, item) => {
        item.favorite.pull(req.params.deleteTicker);
        item.save();
        res.json(item)
    })
  })

module.exports = userRouter;