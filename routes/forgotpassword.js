const express = require('express');
const Users = require('../models/Users');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchverificationtoken = require('../middlewares/fetchverificationtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Route 1: Forgot Password using POST: /api/forgotpassword/forgotpassword. Login Not required.
router.post(
  '/forgotpassword',
  [
    body('email')
      .notEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('securityQuestion', 'Security Question cannot be empty').notEmpty(),
    body('securityAnswer', 'Security Answer cannot be empty').notEmpty(),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, securityQuestion, securityAnswer } = req.body;
      let isValid = false;

      // Check if the user exists in the database
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(404).json({ isValid, message: 'User Not Found' });
      }

      // If User found in database, check for the security Question
      if (securityQuestion !== user.securityQuestion) {
        return res
          .status(400)
          .json({ isValid, message: 'Incorrect Security Question' });
      }

      // If security question is true, check for security password
      const isMatch = await bcrypt.compare(securityAnswer, user.securityAnswer);
      if (!isMatch) {
        return res
          .status(404)
          .json({ isValid, message: 'Incorrect Security Answer' });
      }

      // Implement the JWT Token as a verification token, we will send a verification token so that user can use that to reset the password
      data = {
        userEmail: {
          email: user.email,
        },
      };
      const verificationToken = jwt.sign(data, JWT_SECRET);
      isValid = true;
      res.status(200).json({
        isValid,
        message: 'Security Answer Verified',
        verificationToken,
      });
    } catch (error) {
      return res
        .status(500)
        .send({ statusMessage: 'Internal Server Error', error: error.message });
    }
  }
);

// Route 2: Reset Password using POST: /api/forgotpassword/resetpassword. Login Not required.
router.put(
  '/resetpassword',
  fetchverificationtoken,
  [
    body('newPassword')
      .notEmpty()
      .withMessage('Password cannot be empty')
      .isLength({ min: 5 })
      .withMessage('Password must be atleast of 5 characters'),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { newPassword } = req.body;
      const userEmail = req.user.email;
      let isSuccess = false;

      // Find the user in the database
      const user = await Users.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ isSuccess, message: 'User Not Found' });
      }

      // If user found change, the old password to newPassword with hashing
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      isSuccess = true;
      res.status(200).json({ isSuccess, message: 'Password reset successful' });
    } catch (error) {
      return res
        .status(500)
        .json({ statusMessage: 'Internal Server Error', error: error.message });
    }
  }
);

module.exports = router;
