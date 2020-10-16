
//confere se o token é valido

const jsonwebtoken = require('jsonwebtoken');

const authConfig = {
    "secret": "d41d8cd98f00b204e9800998ecf8427e" 
    
};
module.exports = (req, res, next) => {
    const sessiontoken = req.headers.authtoken;

    if(!sessiontoken){
        return res.status(401).send({Error: 'Token not provided'});
    }
   
    const parts = sessiontoken.split(' ');

    if (!parts.length === 2){
        return res.status(401).send({Error: 'Token error'});
    }
    
    const [scheme, token] = parts;
     
    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({Error: 'Token malformated'});
    }

    jsonwebtoken.verify(token, authConfig.secret, (err, decoded) => {
        if(err){
            return res.status(401).send({Error: 'Token invalid'});
        }
    req.userId = decoded.id;
    return next()
        
    });
}
