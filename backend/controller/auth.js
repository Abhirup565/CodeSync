const jwt = require('jsonwebtoken');
const key = "theEarthIsSpherical";

function setUser(user){
    return(
        jwt.sign({
            _id: user._id,
            username: user.username,
            firstname: user.firstname
        }, key)
    );
}
function getUser(token){
    if(!token) return null;
    return jwt.verify(token, key);
}

module.exports = {setUser, getUser};