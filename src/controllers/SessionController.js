const util = require('util');
const { compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');

const authConfig = require('../config/auth');

const connection = require('../database/connection');

module.exports = {
  async create(request, response) {
    const { email, password } = request.body;

    const sql = util.promisify(connection.query).bind(connection);

    try {
      const user = await sql('SELECT * FROM users WHERE email = ' +`'${email}'`);

      if (user.length == 0) {
        throw new Error('Incorrect email/password combination');
      }

      const passwordMatched = await compare(password, user[0].userPassword);

      if(!passwordMatched){
        throw new Error('Incorrect email/password combination');
      }

      delete user[0].userPassword;

      const { secret, expiresIn } = authConfig.jwt;

      const token = sign({}, secret, {
        subject: `'${user[0].id}'`,
        expiresIn: expiresIn,
      });

      return response.json({user, token});  

    } catch (error) {
      return response.status(400).json({ error: 'Error in authenticate user' });
    }
  }
}