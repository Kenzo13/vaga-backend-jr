const util = require('util');

const connection = require('../database/connection');

module.exports = {
  async index(request, response) {
    const sql = util.promisify(connection.query).bind(connection);

    try {
      const list = await sql("SELECT * FROM games");

      response.json(list);
    } catch {
      throw new Error('Does not exist games register');
    }
  },

  async create(request,response) {
    const {
      teamA,
      teamB,
      golsFromTeamA,
      golsFromTeamB
    } = request.body;

    const sql = util.promisify(connection.query).bind(connection);
    
    const checkIfTeamAExist = await sql("SELECT * FROM clubs WHERE nameOfTeam = "+ `'${teamA}'`);
    const checkIfTeamBExist = await sql("SELECT * FROM clubs WHERE nameOfTeam = "+ `'${teamB}'`);

    if(!checkIfTeamAExist.length > 0){
      return response.status(400).json({ error: 'The name of the chosen team A does not exist'});
    };

    if(!checkIfTeamBExist.length > 0){
      return response.status(400).json({ error: 'The name of the chosen team B does not exist'});
    };

    try {
      const checkTeamsAlreadyPlayed = await sql(
        "SELECT * FROM games WHERE nameOFTeamA = "+ `'${teamA}'` + 
        " AND nameOFTeamB = " + `'${teamB}'`
      );

      const game = {
        nameOfTeamA: teamA,
        nameOfTeamB: teamB,
        golsFromTeamA,
        golsFromTeamB,
      };

      const gameScore = {
        idOfTeamA: checkIfTeamAExist[0].id,
        idOfTeamB: checkIfTeamBExist[0].id,
      };
  
      if(checkTeamsAlreadyPlayed.length == 1){
        return response.status(400).json({ error: 'Those teams have already played'});
      };
  
      game.scoreboard = `${game.golsFromTeamA} x ${game.golsFromTeamB}`;

      connection.query('INSERT INTO games SET ?',game, async (error, result) => {
        if (error) throw error;
        
        console.log("Success to create a game!");

        game.id = result.insertId;

        await consolidationOfData(game, gameScore);
      });

      response.json(game);
    } catch {
      throw new Error('Error to create a game');
    }
  },
};

async function consolidationOfData(game, gameScore) {
  // Verificar o vencedor e atribuir os pontos.
  // adiciona o nome do vencedor a variável victory.

  try {
    if (game.golsFromTeamA > game.golsFromTeamB) {
      gameScore.qtdPointsForTeamA = 3;
      gameScore.qtdPointsForTeamB = 0;
    }
    else if (game.golsFromTeamA == game.golsFromTeamB) {
      gameScore.qtdPointsForTeamA = 1;
      gameScore.qtdPointsForTeamB = 1;
    }
    else {
      gameScore.qtdPointsForTeamA = 0;
      gameScore.qtdPointsForTeamB = 3;
    }

    gameScore.idOfGame = game.id;
  
    connection.query('INSERT INTO gamesPoints SET ?',gameScore, (error, result) => {
      if (error) throw error;
      
      console.log("Success to save the points!");
    });
  } catch {
    throw new Error('Error to save the points');
  }
}