const jwt = require('jsonwebtoken');

module.exports = {
    checkToken: function(req, res, next){
        const token = req.cookies.token;
        if(!token){
            res.send({authenticated: false, isAdmin: false, username: '', message: 'Unauthorized: Token not provided'});
        }else{
            jwt.verify(token, process.env.KEY, function(err, decoded){
                if(err){
                    res.send({authenticated: false, isAdmin: false, username: '', message: 'Unauthorized: Token not provided'});
                }else{
                    req.username = decoded.username;
                    req.isAdmin = decoded.isAdmin;
                    next();
                }
            });
        }
    },
}