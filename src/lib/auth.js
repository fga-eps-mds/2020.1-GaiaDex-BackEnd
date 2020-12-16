require('dotenv').config();
const jwt = require('jsonwebtoken');

const authConfig = {
  // secret: process.env.SECRET,
  secret: 'd41d8cd98f00b204e9800998ecf8427e',
};

function auth(req, res, next) {
  const sessionToken = req.headers.authtoken;

  if (!sessionToken) {
    return res.status(401).send({ Error: 'Token not provided' });
  }

  const [scheme, token] = sessionToken.split(' ');

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ Error: 'Token malformed' });
  }

  try {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      req.userId = decoded.id;
    });
    return next();
  } catch (err) {
    return res.status(400);
  }
}
module.exports = { authConfig, auth };
