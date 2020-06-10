const util = require('util');
const { hash } = require('bcryptjs');

const connection = require('../database/connection');

module.exports = {
  async create(request, response) {
    const { name, email, password } = request.body;

    const sql = util.promisify(connection.query).bind(connection);

    try {
      const checkUserExist = await sql('SELECT * FROM users WHERE email = ' +`'${email}'`);

      if (checkUserExist.length > 0) {
        return response.status(400).json({ message: 'Email address already used '});
      }

      const hashedPassword = await hash(password, 8);

      const user = {
        userName: name,
        email,
        userPassword: hashedPassword,
      }

      delete user.password;

      connection.query('INSERT INTO users SET ?',user, (error, result) => {
        if (error) throw error;
        
        console.log("Success to register a new user!");
      });

      response.json(user);
    } catch {
      throw new Error('Error to register a new user.');
    }
  }
}