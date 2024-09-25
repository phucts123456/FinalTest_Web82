const jwt = require('jsonwebtoken');

const jwtCheckMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(authHeader) {
        const token = authHeader.split(' ')[1];
        const secretKey = process.env.ACCESSS_TOKEN_SECERT_KEY;
        jwt.verify(token, secretKey, (err, decoded) => {
          console.log(req.session.isLogin) 
          if (err || req.session.isLogin !== true) {
            if(req.session.isLogin !== true) return res.status(401).json({ message: 'Out of session. Please login again' });
            return res.status(401).json({ success: false, message: err.message});
          } else {
            req.user = decoded; 
            next();
          }
        });
    } else {
      res.status(401).json({ message: 'Access token is missing. Please run login api then paste access token that you get from api to /api/axiosIntance.js file.' });
    }

}

module.exports = {
  jwtCheckMiddleware
}