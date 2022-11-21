const express = require('express');
const spendingsRouter = express.Router();
const spendingsController = require('../../controller/spendingsController');

spendingsRouter.route('/:username')
    .get(spendingsController.getUserSpendings)
    .post(spendingsController.addUserSpending);

spendingsRouter.route('/:id')
    .put(spendingsController.editUserSpending)
    .delete(spendingsController.deleteUserSpending);

module.exports = spendingsRouter;