const {getUser} = require('./auth');
function checkUser(req, res){
    token = req.cookies.uid;
    if(!token)
        return res.status(401).json({message: "not authenticated"});
    try{
        const user = getUser(token);
        return res.json({user});
    }
    catch(e){
        res.status(401).json({message: "Invalid token"});
    }
}
module.exports = {checkUser};