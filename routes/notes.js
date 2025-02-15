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
    // Validation for Title and Description cannot be empty and Description should be min 5 characters.
    body('title').notEmpty().withMessage('Title cannot be empty'),
    body('description')
      .notEmpty()
      .withMessage('Description cannot be empty')
      .isLength({ min: 5 })
      .withMessage('Description should be atleast 5 characters'),
    body('tag')
      .customSanitizer((value) => (value === '' ? 'Default' : value))
      .trim(),
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

// ROUTE 3: Update the existing note using PUT: "api/notes/updatenote/:id". Login required.
router.put(
  '/updatenote/:id',
  fetchuser,
  [
    // Validation for Title and Description cannot be empty and Description should be min 5 characters.
    body('title').notEmpty().withMessage('Title cannot be empty'),
    body('description')
      .notEmpty()
      .withMessage('Description cannot be empty')
      .isLength({ min: 5 })
      .withMessage('Description should be atleast 5 characters'),
    body('tag')
      .customSanitizer((value) => (value === '' ? 'Default' : value))
      .trim(),
  ],
  async (request, response) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      // Destructuring and get the title, description and tag from request body
      let { title, description, tag } = request.body;
      let updateNote = {};

      // If title, description, tag is available in the body insert it to updateNote object
      if (title) {
        updateNote.title = title;
      }
      if (description) {
        updateNote.description = description;
      }
      if (tag) {
        updateNote.tag = tag;
      } else {
        updateNote.tag = 'Default';
      }

      // Find if the note is available in the database
      let note = await Notes.findById(request.params.id);
      if (!note) {
        return response.status(404).send('Not Found in Database');
      }
      // Verify if the note is for the same particular user who is requesting to update
      if (note.user.toString() !== request.user.id) {
        return response.status(401).send('Not Authorized');
      }
      // Once verification done, it will update the note with the updateNote object details.
      note = await Notes.findByIdAndUpdate(
        request.params.id,
        { $set: updateNote },
        { new: true }
      );
      response.json(note);
    } catch (error) {
      return response.status(400).send({ error: error.message });
    }
  }
);

// ROUTE 4: Delete the existing note using DELETE: "api/notes/deletenote/:id". Login required.
router.delete('/deletenode/:id', fetchuser, async (request, response) => {
  try {
    //Find if the note is available in Database
    let note = await Notes.findById(request.params.id);
    if (!note) {
      return response.status(401).send('Not Found');
    }

    // Verify if the note is for the same particular user who is requesting to delete
    if (note.user.toString() !== request.user.id) {
      return response.status(401).send('Not Authorized');
    }
    // If everything is ok, delete the note
    note = await Notes.findByIdAndDelete(request.params.id);
    response.json({ Success: 'Your note has been deleted.', note: note });
  } catch (error) {
    return response.status(401).send({ error: error.message });
  }
});

// ROUTE 5: Create API route for search notes by tag using GET: 'api/notes/search'. Login Required.
router.get('/search', fetchuser, async (request, response) => {
  try {
    const { tag } = request.query;
    if (!tag) {
      return response.status(400).json({ error: 'Tag is required' });
    }

    // Use Indexed serach (Case-insensitive)
    const notes = await Notes.find({
      user: request.user.id,
      tag: { $regex: tag, $options: 'i' },
    });

    response.json(notes.length > 0 ? notes : { message: 'No notes found' });
  } catch (error) {
    return response
      .status(500)
      .send({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
