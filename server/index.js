const express = require('express');
let app = express();
const bodyParser = require('body-parser');
const db = require('../database-posgtres/index.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client/dist'));

let port = 3000;

//gets post of all friends
app.get('/:username/posts/friends', function(req, res) {
  // console.log("GETTING ALL FRIENDS POSTS");
  db.findPostsByFriends(req.params.username, (err, data) => {
    // console.log("Error", err, "data", data);
    if (err) {
      console.log('This is my error', err);
      res.sendStatus(404);
    } else {
      // console.log('This is my data', data);
      res.status(200).json(data);
    }
  })
});

//gets post of non friends
app.get('/:username/posts/nonFriends', function(req, res) {
  // console.log("GETTING ALL NON FRIENDS POSTS");
  // console.log('NON FRIENDS USERNAME', req.params.username)
  db.findPostsByNonFriends(req.params.username, (err, data) => {
    // console.log("Error", err, "data", data);
    if (err) {
      console.log('This is my error', err);
      res.sendStatus(404);
    } else {
      // console.log('This is my data', data);
      res.status(200).json(data);
    }
  })
});


app.get('/:username/posts', function(req, res) {
  // console.log("getting all posts");
  db.getAllPosts((err, data) => {
    // console.log("Error", err, "data", data);
    if (err) {
      console.log('This is my error', err);
      res.sendStatus(404);
    } else {
      // console.log('This is my data', data);
      res.status(200).json(data);
    }
  })
});

// Get posts by a certain user
app.get('/:username/posts/:otherusername', function(req, res) {
  // console.log('username...', req.params.otherusername);
  db.getUserPosts(req.params.otherusername, (error, data) => {
    if (error) {
      console.log(`error retrieving ${req.params.otherusername}'s posts`, error);
    } else {
      console.log('data....', data);
      res.status(200).json(data);
    }
  });
});

// Add new post to database
app.post('/:username/posts', function(req, res) {
  // console.log(req.params.username);
  // console.log(req.body.text);   
  db.createPost(req.params.username, req.body.text, (err, data) => {
    if (err) {
      console.log(res);
      console.log('This is my error', err);
      res.sendStatus(404);		
    } else {		
      res.status(200).json(data);		
    }		
  })		
});

app.post('/likes/:author', function(req, res) {
  console.log('Are you liking');
  // console.log(req.params.author);
  // console.log(req.body.text);
  // console.log(req.body.username)
  db.likePost(req.params.author, req.body.text, req.body.username, (err, data) => {
    if (err) {
      console.log(res);
      console.log('This is my error', err);
      res.sendStatus(404);		
    } else {
      console.log('This is my data', data);
      res.status(200).json(data);	
    }		
  })
})

app.delete('/likes/:author', function(req, res) {
  console.log('Are you unliking');
  // console.log(req.params.author);
  // console.log(req.query.text);
  // console.log(req.query.username);
  db.unlikePost(req.params.author, req.query.text, req.query.username, (err, data) => {
    if (err) {
      console.log(res);
      console.log('This is my error', err);
      res.sendStatus(404);		
    } else {
      console.log('This is my data', data);
      res.status(200).json(data);	
    }		
  })
})

app.get('/likes', function(req, res) {
  console.log('Getting number of likes!');
  // console.log('Getting likes for post with this text', req.query.text);
  db.getLikeAmount(req.query.text, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log('Successfully got like count', data);
      res.status(200).json(data);
    }
  })
})

app.get('/:username/profile/:user', function(req, res) {
  db.searchSomeone(req.params.user, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log('success: ', data);
      res.status(200).json(data);
    }
  });
});

// Get info about single user to load their profile
app.get('/:username', (req, res) => {
  // console.log('inside get username');
  var username = req.params.username;
  if (username !== 'favicon.ico') {
    db.getUser(username, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        // console.log('data from /username route', data);
        res.status(200).json(data);
      }
    })  
  }
});

app.get('/:firstname/:lastname', (req, res) => {
  // console.log('Querying by first and last name');
  db.getUsername(req.params.firstname, req.params.lastname, (err, data) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).json(data);
    }
  })
})
// Get author of post
app.get('/:username/post/author', (req, res) => {
  db.getPostAuthor(req.query.text, (err, data) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).json(data);
    }
  })
})
// Add new user to db
app.post('/:username', (req, res) => {
  var username = req.params.username;
  if (username !== 'favicon.ico') {
    var newUserData = {
      username: req.body.username,
      pictureUrl: req.body.pictureUrl,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }
    db.addUser(newUserData, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(data);
      }
    })
  }  
});

// Get info about single user to load their profile
app.get('/:username', (req, res) => {
  var username = req.params.username;
  if (username !== 'favicon.ico') {
    db.getUser(username, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(data);
      }
    })  
  }
});

// Add new user to db
app.post('/:username', (req, res) => {
  var username = req.params.username;
  if (username !== 'favicon.ico') {
    var newUserData = {
      username: req.body.username,
      pictureUrl: req.body.pictureUrl,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }
    db.addUser(newUserData, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(data);
      }
    })
  }  
});

// route to add friend
app.post('/:username/:friendToAdd', (req, res) => {
  var username = req.params.username;
  var friendToAdd = req.params.friendToAdd;
  db.addFriend(username, friendToAdd, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(data);
    }
  });
});

// route to get a friends list
app.get('/:username/friendsList/:otherUsername', (req, res) => {
  var username = req.params.username;
  var otherUsername = req.params.otherUsername;
  db.getFriendsList(otherUsername, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(data);
    }    
  });
});


app.listen(process.env.PORT || port, function() {
  console.log(`listening on port ${port}`);
});




