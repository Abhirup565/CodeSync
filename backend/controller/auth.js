require('dotenv').config();
const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET;

function setUser(user){
    return(
        jwt.sign({
            _id: user._id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname
        }, key)
    );
}
function getUser(token){
    if(!token) return null;
    return jwt.verify(token, key);
}

module.exports = {setUser, getUser};