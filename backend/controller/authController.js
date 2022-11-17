const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Users = require('../model/Users');

const handleLogin = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password)
        return res.sendStatus(400).json({'message': 'Username and password are required.'});

    const foundUser = await Users.findUserByUsername(username);
    // check if user exists
    if (!foundUser)
        // Unauthorized
        return res.sendStatus(401);

    // check passowrd
    const passwordMatch = await bcrypt.compare(password, foundUser.hash_password);
    if (passwordMatch) {
        // create JWT
        const accessToken = jwt.sign(
            {'username': foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30m'}
        );
        const refreshToken = jwt.sign(
            {'username': foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );

        // save the refresh token with the current user
        await Users.setUserRefreshToken(foundUser.username, refreshToken);
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
        res.json({accessToken});
    }
    else
        res.sendStatus(401);
}

module.exports = {handleLogin};