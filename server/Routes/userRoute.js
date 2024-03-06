const express = require("express")
const { registerUser, loginUser, findUser, findall } = require("../Controllers/userController");
const router = express.Router();


// router.get("/register", (req, res)=>{
//     res.send("Register ")
// })

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/find", findall);

module.exports = router;