const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (user) => {
  try {
    if (!user) {
      return null;
    }
    const token = jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
  } catch (error) {
    return null;
  }
}

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

const refreshToken = (token) => {
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }
    const newToken = generateToken({ ...decoded });
    return newToken;
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken, refreshToken };
