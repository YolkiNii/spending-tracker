const Users = require('../model/Users');

const handleLogout = async (req, res) => {
    // On client, delete accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt)
        // No content
        return res.sendStatus(204);
    const refreshToken = cookies.jwt
    
    // check if refreshToken in DB
    const foundUser = await Users.findUserByRefreshToken(refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None'});
        return res.sendStatus(204); 
    }

    // Delete refreshToken in DB
    await Users.removeUserRefreshToken(refreshToken);
    
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    res.sendStatus(204);
}

module.exports = {handleLogout};