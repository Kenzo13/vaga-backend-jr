const util = require('util');

const connection = require('../database/connection');

module.exports = {
  async index(request, response) {
    const sql = util.promisify(connection.query).bind(connection);

    try {
      const list = await sql("SELECT * FROM clubs");

      response.json(list);
    } catch {
      throw new Error('Does not exist a club register');
    }
  },

  async create(request, response) {
    const { name, yearOfFoundation, stateOfClub } = request.body;

    const sql = util.promisify(connection.query).bind(connection);

    try {
      const checkTeamExist = await sql("SELECT * FROM clubs WHERE nameOfTeam = "+ `'${name}'`);
      const checkIfHaveFourRegister = await sql("SELECT * FROM clubs");

      if(checkTeamExist.length > 0){
        return response.status(400).json({ error: 'That club already exists!' });
      }

      if(checkIfHaveFourRegister.length == 4){
        return response.status(400).json({ error: 'You can register only four teams!' });
      }

      const team = {
        nameOfTeam: name,
        yearOfFoundation,
        stateOfClub,
      }
  
      connection.query('INSERT INTO clubs SET ?',team, (error, result) => {
        if (error) throw error;
        
        console.log("Success to create a team!");
      });

      return response.json(team);
    } catch {
      throw new Error('Error to create a new club');
    };
  },
};
