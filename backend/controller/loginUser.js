const userModel = require('../models/users');
const {setUser} = require('./auth');
const bcrypt = require('bcrypt');

async function loginUser(req, res){
    const {username, password} = req.body;
    try{
        const user = await userModel.findOne({username});
        if(!user)
            return res.status(400).json({message: "Incorrect Username or Password"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect)
            return res.status(400).json({message: "Incorrect Username or Password"})
        
        //login successful
        const token = setUser(user);
        return res.cookie("uid", token, {
            httpOnly: true,
            secure: false,
            maxAge: 14*24*60*60*1000 // cookie expires in 14 days in millisecond 
        }).status(200).json({message: `Welcome back, ${username}`});
    }
    catch(err){
        console.log("Error logging in", err);
        res.status(500).json({message: "Server error: Error logging in"});
    }
}

module.exports = {loginUser};