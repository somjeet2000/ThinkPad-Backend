require('dotenv').config();
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017/ThinkPad';

const connectToMongo = () => {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('Success: Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:' + error);
    });
};

module.exports = connectToMongo;
