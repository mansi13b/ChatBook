const express = require("express"); //to use router
const { createMessage, getMessages } = require("../Controllers/messageController");
const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId",getMessages);

module.exports = router;