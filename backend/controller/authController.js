// Mock DB
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password)
        return res.status(400).json({'message': 'Username and password are required.'});

    const foundUser = usersDB.users.find(existingUser => existingUser.username === username);

    // check if user exists
    if (!foundUser)
        // Unauthorized
        return res.sendStatus(401); 

    // check passowrd
    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (passwordMatch) {
        res.json({'success': `User ${username} is logged in!`});
    }
    else
        res.sendStatus(401);
}

module.exports = {handleLogin};