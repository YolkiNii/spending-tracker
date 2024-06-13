const express = require('express');
const usersRouter = express.Router();
const usersController = require('../../controller/usersController');

usersRouter.route('/:username').get(usersController.getUser);

module.exports = usersRouter;
