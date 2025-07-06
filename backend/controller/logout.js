function logout(req, res){
    res.clearCookie('uid', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
    });
    res.json({message: "Logged out successfully"});
}
module.exports = {logout};