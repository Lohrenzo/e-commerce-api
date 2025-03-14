const express = require("express");
const User = require("../models/user");
const Auth = require("../middleware/auth");

const router = new express.Router();

//signup
router.post("/user", async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Create a new user'
  // #swagger.summary = "User registration endpoint. Creates a new user with the details provided, returns the user's details and a JSON Web Token for authentication"
  const { username, firstName, lastName, email, password, password2 } =
    req.body;

  if (password !== password2) {
    console.log(`Passwords do not match!!`);
    return res.status(400).json({
      message: "Passwords do not match!!",
    });
  }

  const user = new User({ username, firstName, lastName, email, password });

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//login
router.post("/user/login", async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Login a user'
  // #swagger.summary = "User login endpoint. Takes in credentials and returns the user's details as well as a JSON Web Token for authentication"
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//logout
router.post("/user/logout", Auth, async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Logout a user'
  // #swagger.summary = 'This endpoint logs out only the current auth token. i.e renders the token useless and deletes it from the user's active tokens.'
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//Logout All
router.post("/user/logoutAll", Auth, async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Logout all tokens'
  // #swagger.summary = 'This endpoint logs out all the user's auth tokens. i.e renders all the user's tokens useless and deletes them from the user's active tokens.'
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ message: "All users logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
