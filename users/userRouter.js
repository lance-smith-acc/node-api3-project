const express = require('express');
const Users = require('./userDb');
const Posts = require('../posts/postDb');
const router = express.Router();

// post new user
router.post('/', validateUser, (req, res) => {
  const userInfo = req.body;
  Users.insert(userInfo)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({errMessage:'There was an error while saving the post to the database' })
        });
});

// post new post
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const postInfo = {...req.body, user_id:req.params.id};
  Posts.insert(postInfo)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({errMessage:'There was an error while saving the comment to the database' })
        });
});

// get users
router.get('/', (req, res) => {
  Users.get(req.query)
        .then(user => {
            res.status(200).json(user);
        })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message:"The information could not be retrieved."
        })
    }
    )
});

// get user by id
router.get('/:id',validateUserId, (req, res) => {
  const {id} = req.params;
  Users.getById(id)
        .then(user => {
            res.status(200).json(user);
        })
});

// get user posts by id
router.get('/:id/posts', validateUserId, (req, res) => {
  const {id} = req.params;
  Users.getUserPosts(id)
        .then(user => {
            res.status(200).json(user);
        })
    .catch(err => {
        console.log(err);
        rse.status(500).json({
            message:"The posts information could not be retrieved."
        })
    }
    )
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(() => {
        res.status(200).json({ message: "The user has been removed" });
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error removing the user",
      });
    });
});

router.put('/:id', validateUserId, (req, res) => {
  Users.update(req.params.id, req.user)
    .then(user => {
        res.status(200).json(user);     
    })
});

//custom middleware

function validateUserId(req, res, next) {
  const {id} = req.params;
  Users.getById(id)
    .then(user => {
        if(!user){
          res.status(400).json({message:"invalid user id"})
        }
        else {
          req.user = user;
          next();
        }
    })
    .catch(err =>{
      res.status(500).json({errorMessage:"Could not retrieve user"})
    })
 
}

function validateUser(req, res, next) {
  if(!req.body){
    res.status(400).json({errorMessage:"missing user data"})
  }
  else if(!req.body.name){
    res.status(400).json({errorMessage:"missing required name field"})
  }
  else{
    next();
  }
}

function validatePost(req, res, next) {
  if(!req.body){
    res.status(400).json({errorMessage:"missing user data"})
  }
  else if(!req.body.text){
    res.status(400).json({errorMessage:"missing required text field"})
  }
  else{
    next();
  }
}

module.exports = router;
