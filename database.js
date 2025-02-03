require('dotenv').config();
const mongoose = require('mongoose');
// const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017/ThinkPad';
const mongoURI =
  'mongodb+srv://somjeetsrimani:Babai2000@thinkpadcluster.0dtdzf1.mongodb.net/';

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
