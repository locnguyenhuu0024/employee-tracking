const express = require('express');
const router = express.Router();
const { verifyTokenMiddleware } = require('../middlewares/authMiddleware.js');
const { createEmployee, readEmployee, updateEmployee, deleteEmployee, readEmployees } = require('../controllers/employeeController.js');


router.get('/', verifyTokenMiddleware, readEmployees);
router.get('/:id', verifyTokenMiddleware, readEmployee);
router.post('/', verifyTokenMiddleware, createEmployee);
router.put('/:id', verifyTokenMiddleware, updateEmployee);
router.delete('/:id', verifyTokenMiddleware, deleteEmployee);

module.exports = router;
