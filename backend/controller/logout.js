function logout(req, res){
    res.clearCookie('uid', {path: '/'});
    res.json({message: "Logged out successfully"});
}
module.exports = {logout};