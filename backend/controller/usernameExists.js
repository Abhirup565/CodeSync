const usermodel = require('../models/users');

async function UsernameAvailability(req, res){
    const username = req.body.userName;
    try{
        const user = await usermodel.findOne({username});
        if(user)
            return res.status(200).json({isTaken: true});
        return res.status(200).json({isTaken: false});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Server error"});
    }
}
module.exports = {UsernameAvailability};