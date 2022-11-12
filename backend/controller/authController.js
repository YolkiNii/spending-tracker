const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password)
        return res.sendStatus(400).json({'message': 'Username and password are required.'});

    const foundUser = usersDB.users.find(existingUser => existingUser.username === username);

    // check if user exists
    if (!foundUser)
        // Unauthorized
        return res.sendStatus(401); 

    // check passowrd
    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (passwordMatch) {
        const roles = Object.values(foundUser.roles);
        // create JWT
        const accessToken = jwt.sign(
            {
                'UserInfo': {
                    'username': foundUser.username,
                    'roles': roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '1m'}
        );
        const refreshToken = jwt.sign(
            {'username': foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );

        // save the refresh token with the current user
        const otherUsers = usersDB.users.filter(existingUser => existingUser.username !== foundUser.username);
        const currentUser = {...foundUser, refreshToken};
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
        res.json({accessToken});
    }
    else
        res.sendStatus(401);
}

module.exports = {handleLogin};