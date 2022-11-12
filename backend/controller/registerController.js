const bcrypt = require('bcrypt');
const Users = require('../model/Users');

/*
New User:
{
    email: string,
    firstName: string,
    lastName: string,
    username: string,
    password: string
}
*/
const handleNewUser = async (req, res) => {
    const {email, firstName, lastName, username, password} = req.body;
    // check if no fields are empty
    if (!email || !firstName || !lastName || !username || !password)
        return res.sendStatus(400).json({'message': 'All fields need to be filled.'});

    
    try {
        // check if user already exists
        const foundUser =  await Users.findUserByUsername(username);

        if (Object.keys(foundUser).length !== 0)
            return res.sendStatus(409);

        // hash password and record user
        const hashPassword = await bcrypt.hash(password, 10);
        await Users.addUser(firstName, lastName, email, username, hashPassword);
        res.status(201).json({'success': `User: ${username} added`});

    } catch (err) {
        res.status(500).json({'message': err.message});
    }
}

module.exports = {handleNewUser};