const { Router } = require('express');

const ClubController    = require('./controllers/ClubController');
const GameController    = require('./controllers/GameController');
const TableController   = require('./controllers/TableController');
const UserController    = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');

const middlewares = require('./middlewares/ensureAuthenticated');

const routes = Router();

// routes.use();
routes.post('/users', UserController.create);

routes.post('/sessions', SessionController.create);

routes.get('/clubs', middlewares.ensureAuthenticated, ClubController.index);
routes.post('/clubs', middlewares.ensureAuthenticated, ClubController.create);

routes.get('/games', middlewares.ensureAuthenticated, GameController.index);
routes.post('/games', middlewares.ensureAuthenticated, GameController.create);

routes.get('/table', middlewares.ensureAuthenticated, TableController.index);

module.exports = routes;