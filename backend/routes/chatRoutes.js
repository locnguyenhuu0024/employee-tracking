const express = require("express");
const { verifyTokenMiddleware } = require("../middlewares/authMiddleware");
const { getListChats, getMessages } = require("../controllers/chatController");
const router = express.Router();

router.get("/", verifyTokenMiddleware, getListChats);
router.get("/:chatId", verifyTokenMiddleware, getMessages);

module.exports = router;
