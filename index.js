const connectToMongo = require('./database');
const express = require('express');
var cors = require('cors');

connectToMongo();

const app = express();
const port = 5000;

// Middleware to use request.send
// This will allow to send the file in the JSON format
app.use(cors());
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/authentication'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNotebook Backend app listening on port ${port}`);
});
