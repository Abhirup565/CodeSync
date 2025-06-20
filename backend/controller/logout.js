function logout(req, res){
    res.clearCookie('uid');
    res.json({message: "Logged out successfully"});
}
module.exports = {logout};