const { verify } = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = {
  ensureAuthenticated(request, response, next) {
    // Validação do token jwt

    const authHeader = request.headers.authorization;

    if(!authHeader){
      throw new Error('JWT token is missing');
    }

    // Bearer token
    const [, token] = authHeader.split(' ');

    try {
      const decoded = verify(token, authConfig.jwt.secret);

      console.log(decoded);

      return next();
    } catch {
      throw new Error('Invalid JWT token');
    }
  }
}