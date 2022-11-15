const Users = require('../model/Users');

const getUser = async (req, res) => {
    // check if request contains
    if (!req?.params?.username)
        return res.sendStatus(400).json({'message': 'Username required'});

    const username = req.params.username;
    const user = await Users.findUserByUsername(username);
    if (!user)
        return res.sendStatus(204).json({'message': `Username ${username} not found`});

    const userInfo = {
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        username: user.username
    };

    res.json(userInfo);
}

module.exports = {getUser};