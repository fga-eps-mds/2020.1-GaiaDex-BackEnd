// confere se o token é valido
require('dotenv').config();
const jwt = require('jsonwebtoken');

const authConfig = {
    "secret": process.env.SECRET
    
};
function auth(req, res, next) {
  const sessiontoken = req.headers.authtoken;

  if (!sessiontoken) {
    return res.status(401).send({ Error: 'Token not provided' });
  }

  const parts = sessiontoken.split(' ');

  if (!parts.length === 2) {
    return res.status(401).send({ Error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ Error: 'Token malformated' });
  }

  try {
    const { userId } = jwt.verify(token, authConfig.secret);
    req.userId = userId;
    return next();
  } catch (err) {
    req.redirect('/login_page');
    return res.status(400);
  }
}
module.exports = { authConfig, auth };
