// confere se o token é valido
require('dotenv').config();
const jwt = require('jsonwebtoken');

const authConfig = {
  secret: 'd41d8cd98f00b204e9800998ecf8427e',
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

  
  jwt.verify(token, authConfig.secret, function(err ,decoded){
  try {
    req.userId = decoded.id;
    console.log(decoded.id)
    next();
  } 
  catch (err) {
    return res.status(400);
  }
  });
    
 
}
module.exports = { authConfig, auth };
