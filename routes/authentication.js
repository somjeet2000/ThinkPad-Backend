const express = require('express');
const Users = require('../models/Users');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middlewares/fetchuser');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// ROUTE 1: Create a User using POST: /api/auth/createuser. No Login Required
router.post(
  '/createuser',
  [
    // name must not be empty
    body('name', 'Name cannot be empty').notEmpty(),
    // email must be an email and not empty
    body('email')
      .notEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Please enter a valid email'),
    // password must be at least 5 chars long and not empty
    body('password')
      .notEmpty()
      .withMessage('Password cannot be empty')
      .isLength({ min: 8 })
      .withMessage('Password must be atleast of 8 characters'),
    // Implement for the functionality of security question and password
    body('securityQuestion', 'Security Question cannot be empty').notEmpty(),
    body('securityAnswer', 'Security Answer cannot be empty').notEmpty(),
  ],
  async (request, response) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      let success = false;
      // Check if the email exists in the database
      let user = await Users.findOne({ email: request.body.email });
      if (user) {
        return response.status(400).json({
          success,
          error:
            'User with this email already exists. Please enter an unique email.',
        });
      }

      // Implement bcrypt package to generate the salt and hashing for the password to store it in DB
      /* Both the bcrypt.genSalt and bcrypt.hash returns a promise, we need to use await as a must*/
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(request.body.password, salt);
      const secureSecurityAnswer = await bcrypt.hash(
        request.body.securityAnswer,
        salt
      );

      // If email doesn't exists or unique, then the below code will run
      user = await Users.create({
        name: request.body.name,
        email: request.body.email,
        password: securePassword,
        securityQuestion: request.body.securityQuestion,
        securityAnswer: secureSecurityAnswer,
      });

      /* Implement the JWT Token functionality after user has been created, we will send the authToken as a response to the user. */
      data = {
        userID: { id: user.id },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      // Instead of sharing the user information, we will send the authToken as an response
      response.json({ success, authToken });
      //   response.json(user);
    } catch (error) {
      return response.status(400).send({ error: error.message });
    }
  }
);

// ROUTE 2: Login a user with Post: /api/auth/login. No Login Required
router.post(
  '/login',
  [
    // email must be an email and not empty
    body('email')
      .notEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Please enter a valid email'),
    // password must be at least 5 chars long and not empty
    body('password')
      .notEmpty()
      .withMessage('Password cannot be empty')
      .isLength({ min: 8 })
      .withMessage('Password must be atleast of 8 characters'),
  ],
  async (request, response) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const { email, password } = request.body;
    try {
      let success = false;
      let user = await Users.findOne({ email });
      if (!user) {
        return response.status(400).json({
          success,
          error: 'Please try to login with the correct credentials',
        });
      }

      // Use of await is mandatory below, otherwise it will allow the user with any password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return response.status(400).json({
          success,
          error: 'Please try to login with the correct credentials',
        });
      }

      data = {
        userID: { id: user.id },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      response.json({ success, authToken });
    } catch (error) {
      return response.status(400).send({ error: error.message });
    }
  }
);

// ROUTE 3: Get user data using POST: /api/auth/getuser. Login required.
router.post('/getuser', fetchuser, async (request, response) => {
  try {
    const userID = request.user.id;
    const user = await Users.findById(userID).select('-password');
    response.json(user);
  } catch (error) {
    return response.status(400).send({ error: error.message });
  }
});

// ROUTE 4: Delete user data using DELETE: /api/auth/deleteuser. Login required.
router.delete('/deleteuser', fetchuser, async (request, response) => {
  try {
    // Check if the user is available in the database
    let user = await Users.findById(request.user.id);
    if (!user) {
      return response.status(402).send('User Not Found in Database');
    }

    // If everything is ok, delete the user
  } catch (error) {
    return response.status(400).send({ error: error.message });
  }
});

module.exports = router;
