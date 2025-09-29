const express = require('express');
const router = express.Router();
const { verifyTokenMiddleware } = require('../middlewares/authMiddleware.js');
const { createTask, readTask, updateTask, deleteTask, readTasks } = require('../controllers/taskController.js');


router.get('/', verifyTokenMiddleware, readTasks);
router.get('/:id', verifyTokenMiddleware, readTask);
router.post('/', verifyTokenMiddleware, createTask);
router.put('/:id', verifyTokenMiddleware, updateTask);
router.delete('/:id', verifyTokenMiddleware, deleteTask);

module.exports = router;
