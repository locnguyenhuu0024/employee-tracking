const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyTokenMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
}

const verifyEmployeeTokenMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.params.id = decoded.employeeId;
    req.user = {id: decoded.ownerId}
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
}


module.exports = { verifyTokenMiddleware, verifyEmployeeTokenMiddleware };
