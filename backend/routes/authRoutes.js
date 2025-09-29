const express = require('express');
const router = express.Router();
const { createNewAccessCode, validateAccessCode, setupEmployee, employeeSignIn } = require('../controllers/authController.js');
const { verifyEmployeeTokenMiddleware } = require('../middlewares/authMiddleware.js');

//owner
router.post('/owner/sendcode', createNewAccessCode);
router.post('/owner/verifycode', validateAccessCode);


//employee
router.post('/employee/setup', verifyEmployeeTokenMiddleware, setupEmployee);
router.post('/employee/signin', employeeSignIn);

module.exports = router;
