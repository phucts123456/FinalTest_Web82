const jwt = require('jsonwebtoken');

const jwtCheckMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(authHeader) {
        const token = authHeader.split(' ')[1];
        const secretKey = process.env.ACCESSS_TOKEN_SECERT_KEY;
        jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
            return res.status(401).json({ success: false, msg: err.message});
          } else {
            req.user = decoded; 
            next();
          }
        });
    } else {
      res.status(401).json({ message: 'Access token is missing' });
    }
}

module.exports = {
  jwtCheckMiddleware
}