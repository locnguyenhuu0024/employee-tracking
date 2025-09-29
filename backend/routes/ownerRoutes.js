const express = require('express');
const router = express.Router();
const { updateOwner, getOwnerById } = require('../controllers/ownerController.js');
const { verifyTokenMiddleware } = require('../middlewares/authMiddleware.js');

router.put('/:id', verifyTokenMiddleware, updateOwner);
router.get('/:id', verifyTokenMiddleware, getOwnerById);

module.exports = router;
