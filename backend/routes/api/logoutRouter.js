const express = require('express');
const logoutRouter = express.Router();
const LogoutController = require('../../controller/logoutController');

logoutRouter.get('/', LogoutController.handleLogout);

module.exports = logoutRouter;
