const jwt = require('jsonwebtoken');

/**
 * Module to handle user authentication
 */
module.exports = {
    /**
     * Checks if the authentication token in a request cookie is still valid
     * @param {*} req request object
     * @param {*} res response object
     * @param {*} next callback function 
     */
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