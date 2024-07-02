const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/inotebook';

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
