const mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    index: true, // Add an index for faster search
  },
  date: {
    type: Date,
    default: Date.now, //Don't call the now function here
  },
});

module.exports = mongoose.model('notes', notesSchema);
