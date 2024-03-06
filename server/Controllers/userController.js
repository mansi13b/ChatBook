const userModel = require("../Models/userModel")
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" })
}

//POST REGISTER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        let user = await userModel.findOne({ email });
        //user already exist 
        if (user) return res.status(400).json("User with given email already exist");

        //if fields is empty
        if (!name || !email || !password) return res.status(400).json("Fields cannot be empty");

        //if valid email or not
        if (!validator.isEmail(email)) return res.status(400).json("enter valid email");

        //if strong password or not
        if (!validator.isStrongPassword(password)) return res.status(400).json("use strong password");


        //create user
        user = new userModel({ name, email, password })

        //hashpassword before saving using bcrypt
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt);

        //save user in db
        await user.save();

        const token = createToken(user._id) //When a new user is successfully saved to the database using user.save(), 
        //Mongoose automatically generates a unique identifier for that user and assigns it to the _id property of the user object.

        res.status(200).json({ _id: user._id, name, email, token })

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

};

//POST LOGIN
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    //find this user in db 
    try {

        let user = await userModel.findOne({ email })
        if (!user) return res.status(400).json("invalid email or password")

        //user exist now check password from db
        const isValidPass = await bcrypt.compare(password, user.password)
        if (!isValidPass) return res.status(400).json("invalid password")

        const token = createToken(user._id)
        res.status(200).json({ _id: user._id, name: user.name, email, token })

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


//GET USERS
const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId)
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

}

//GET ALL USERS
const findall = async (req, res) => {
    const users = req.params;
    try {
        const allusers = await userModel.find();
        res.status(200).json(allusers);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = { registerUser, loginUser, findUser, findall };