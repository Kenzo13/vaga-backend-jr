const util = require('util');

const GameController = require('./GameController');
const connection = require('../database/connection');

module.exports = {
  async index(request, response) {
    const sql = util.promisify(connection.query).bind(connection);

    try {
      const list = await sql(
        "SELECT ga.nameOfTeamA,"+
          "sum(gp.qtdPointsForTeamA) as points,"+
          "sum(CASE WHEN gp.qtdPointsForTeamA = 3 THEN 1 ELSE 0 END) as totalVictories,"+
          "sum(ga.golsFromTeamA) - sum(ga.golsFromTeamB) as totalGols,"+
          "sum(ga.golsFromTeamA) as totalGoalsPro \n"+
        "FROM gamesPoints as gp \n"+ 
        "INNER JOIN games as ga on ga.id = gp.idOfGame \n"+
        "GROUP BY nameOfTeamA \n"+ 
        "ORDER BY points desc,totalVictories desc,totalGols desc,totalGoalsPro desc, ga.nameOfTeamA"
      );

      response.json(list);
    } catch {
      throw new Error('Does not exist games register');
    }
  }
}