// Mock DB
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // On client, delete accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt)
        // No content
        return res.sendStatus(204);
    const refreshToken = cookies.jwt
    
    // check if refreshToken in DB
    const foundUser = usersDB.users.find(existingUser => existingUser.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
        return res.sendStatus(204); 
    }

    // Delete refreshToken in DB
    const otherUsers = usersDB.users.filter(existingUser => existingUser.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    );
    
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    res.sendStatus(204);
}

module.exports = {handleLogout};