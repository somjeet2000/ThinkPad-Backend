const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const fetchverificationtoken = (req, res, next) => {
  // Get the email from the JWT Verification Token and Add ID to the request object
  // Get the token
  const verificationToken = req.header('verification-token');
  if (!verificationToken) {
    res
      .status(401)
      .send({ error: 'Please authenticate with a valid verification token' });
  }

  try {
    // Verify if the token is correct and store the response into userData
    const data = jwt.verify(verificationToken, JWT_SECRET);
    // Add it to request object
    /* Always remember the object details when we send the data as JWT Token */
    req.user = data.userEmail;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized User' });
  }
};

module.exports = fetchverificationtoken;
