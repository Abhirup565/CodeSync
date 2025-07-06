const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const { setUser } = require('./auth');

async function register(req, res){
    const {firstName, lastName, username, password} = req.body;
    try{
        //check if any user with the same username already exist
        const existingUser = await userModel.findOne({username});
        if(existingUser){
            return res.status(400).json({message: "User already exist"})
        }
        //else entry a new user in the database
        const hashPass = await bcrypt.hash(password, 10);

        await userModel.create({
            firstname: firstName, 
            lastname: lastName, 
            username: username,
            password: hashPass
        });
        const user = await userModel.findOne({username});
        const token = setUser(user);
        return res.cookie("uid", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 14*24*60*60*1000, // cookie expires in 14 days in millisecond
            path: '/'
        }).status(201).json({message: "Registered successufully"});
    }
    catch(err){
        console.log("Error registering user", err);
        res.status(500).json({message: "Server error: Error registering user"});
    }
}
module.exports = {register};