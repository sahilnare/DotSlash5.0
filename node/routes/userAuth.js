const router = require('express').Router();
// Importing Models
let User = require('../models/users.model');


// REGISTER ROUTE
router.post('/signup', async (req, res) => {
  try {

    const { username, password, name, mobile } = req.body;

    // Check if username already exists
    const query = await User.find({ username: username }).exec();

    if(query.length !== 0) {
      return res.status(401).json("User already exists");
    }

    // Creating the user
    const user = new User({username, name, mobile, password});

    const newUser = await user.save();

    // Send back the user and token as response
    res.json({
      cred: {
        user: newUser
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {

    const { username, password } = req.body;
    let user;

    user = await User.find({username: username}).exec();

    // If user is not found give back response
    if(user.length === 0) {
      return res.status(401).json("Username or Password is incorrect");
    }
    // console.log(user);

    // If password is not valid then give back response
    if(password != user[0].password) {
      return res.status(401).json("Username or Password is incorrect");
    }

    // Send back the user and token as response
    res.json({
      cred: {
        user: user[0]
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;