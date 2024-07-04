const express = require('express');
const fetchuser = require('../middlewares/fetchuser');
const Notes = require('../models/Notes');
const router = express.Router();
const { validationResult, body } = require('express-validator');

// ROUTE 1: Fetch all the notes using GET: /api/notes/fetchallnotes. Login required.
router.get('/fetchallnotes', fetchuser, async (request, response) => {
  try {
    // Fetch the notes of the logged in user
    /* Inside the find function, we have to use the same string which we have given as ref for user in the Notes Model */
    const notes = await Notes.find({ user: request.user.id });
    response.json(notes);
  } catch (error) {
    return response.status(401).send({ error: error.message });
  }
});

// ROUTE 2: Add a new note using POST: "api/notes/addnote". Login required.
router.post(
  '/addnote',
  fetchuser,
  [
    // Validation for Title and Description cannot be empty
    body('title').notEmpty().withMessage('Title cannot be empty'),
    body('description').notEmpty().withMessage('Description cannot be empty'),
  ],
  async (request, response) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      // Destructuring the request body and get the details
      const { title, description, tag } = request.body;
      const note = new Notes({
        title,
        description,
        tag,
        user: request.user.id,
      });
      // Save the note into the Database and send as a response
      const savedNote = await note.save();
      response.json(savedNote);
    } catch (error) {
      return response.status(400).send({ error: error.message });
    }
  }
);

module.exports = router;
