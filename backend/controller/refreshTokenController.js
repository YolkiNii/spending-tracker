const jwt = require('jsonwebtoken');
require('dotenv').config();
const Users = require('../model/Users');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = await Users.findUserByRefreshToken(refreshToken);

  // check if user exists
  if (!foundUser)
    // Forbidden
    return res.sendStatus(403);

  // check jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30m' }
    );

    res.json({ username: decoded.username, accessToken });
  });
};

module.exports = { handleRefreshToken };
