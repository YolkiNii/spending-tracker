const Spendings = require('../model/Spendings');

const getUserSpendings = async (req, res) => {
    // check if username is given
    if (!req?.params?.username)
        return res.sendStatus(400).json({'message': 'Username required'});

    const username = req.params.username;
    const spendings = await Spendings.getAllUserSpending(username);
    
    res.json(spendings);
}

const addUserSpending = async (req, res) => {
    const spendingInfo = req.body;

    // check if username is given
    if (!req?.params?.username)
        return res.sendStatus(400).json({'message': 'Username required'});

    // check if necessary info are there
    if (!spendingInfo.name || !spendingInfo.amount || !spendingInfo.spendingDate)
        return res.sendStatus(400).json({'message': 'Necessary fields are not filled.'});

    const username = req.params.username;
    await Spendings.addUserSpending(username, spendingInfo);

    res.status(201).json({'message': 'Added new spending info'});
}

const editUserSpending = async (req, res) => {
    const spendingInfo = req.body;

    // check if ID is given
    if (!req?.params?.id)
        return res.sendStatus(400).json({'message': 'No ID given'});
    
    // check if necessary info are there
    if (!spendingInfo.name || !spendingInfo.amount || !spendingInfo.spendingDate)
        return res.sendStatus(400).json({'message': 'Necessary fields are not filled.'});

    const spendingID = req.params.id;
    await Spendings.editUserSpending(spendingID, spendingInfo);

    res.status(200).json({'message': 'Successfully edited spending info'});
}

const deleteUserSpending = async (req, res) => {
    // check if ID is given
    if (!req?.params?.id)
        return res.sendStatus(400).json({'message': 'No ID given'});

    const spendingID = req.params.id;
    await Spendings.deleteUserSpending(spendingID);

    res.status(204).json({'message': 'Successfully removed spending info'});
}

module.exports = {getUserSpendings, addUserSpending, editUserSpending, deleteUserSpending}