const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, //Donot call the function here
  },
  // Added for the functionality of Forgot password --START--
  securityQuestion: {
    type: String,
    required: true,
  },
  securityAnswer: {
    type: String,
    required: true,
  },
  // Added for the functionality of Forgot password --END--
});

// No need this pre-save hook, since we are using the salt and bcrypt method at the time of creating routes
// Pre-save hook to hash password and security answer
// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   if (this.isModified('securityAnswer')) {
//     const salt = await bcrypt.genSalt(10);
//     this.securityAnswer = await bcrypt.hash(this.securityAnswer, salt);
//   }
//   next();
// });

module.exports = mongoose.model('user', userSchema);
