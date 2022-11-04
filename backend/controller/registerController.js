const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

// Mock DB
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

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
        return res.sendStatus(400);

    // check if user already exists
    if (usersDB.users.find(existingUser => existingUser.username === username))
        return res.sendStatus(409);

    try {
        // hash password and record user
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = {
            email,
            firstName,
            lastName,
            username,
            'roles': {'User': 2},
            'password': hashPassword
        }

        usersDB.setUsers([...usersDB.users, newUser]);

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        res.sendStatus(201).json({'success': `User: ${username} added`});
    } catch (err) {
        res.sendStatus(500).json({'message': err.message});
    }


}

module.exports = {handleNewUser};