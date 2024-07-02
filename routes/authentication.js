const express = require('express');
const Users = require('../models/Users');
const router = express.Router();
const { validationResult, body } = require('express-validator');

router.post(
  '/',
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
      .isLength({ min: 5 })
      .withMessage('Password must be atleast of 5 characters'),
  ],
  (request, response) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    Users.create({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
    })
      .then((user) => response.json(user))
      .catch((error) =>
        response.json({
          error: 'Please enter an unique value for email',
          message: error.message,
        })
      );
  }
);

module.exports = router;
