const express = require("express") //to use router
const { createChat, findUserChats, findChat } = require("../Controllers/chatController")
const router = express.Router();

router.post("/", createChat);
router.get("/:userId",findUserChats);
router.get("/find/:firstId/:secondId",findChat);

module.exports = router;