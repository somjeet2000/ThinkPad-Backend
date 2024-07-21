const connectToMongo = require('./database');
const express = require('express');
var cors = require('cors');
require('dotenv').config();

connectToMongo();
const app = express();
const port = process.env.PORT || 5000;

// Middleware to use request.send
// This will allow to send the file in the JSON format
app.use(cors());
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/authentication'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/feedback', require('./routes/feedback'));

//Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Everything is good here 👀' });
});

app.listen(port, () => {
  console.log(`ThinkPad Backend app listening on port ${port}`);
});
