/**
 * Module to handle user authentication
 */
const jwt = require('jsonwebtoken');

/**
 * Checks if the authentication token in a request cookie is still valid
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} next callback function 
 */
 const verifyToken = (req, res, next) => {
    let decoded = null;
    try{
        decoded = jwt.verify(req.cookies.orcestratoken, process.env.TOKEN);
    }catch(error){
        console.log('invalid token');
    }finally{
        if(decoded){
            req.decoded = decoded;
            next();
        }else{
            res.send(decoded);
        }
    }
}

/**
 * Checks if the logged in user is an admin.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const isAdmin = (req, res, next) => {
    if(req.decoded && req.decoded.admin){
        next();
    }else{
        res.send({});
    }
}

/**
 * Decodes cookie and returns user email if decoded
 * @param {*} token 
 */
const getUsername = (token) => {
    let user = null;
    try{
        let decoded = jwt.verify(token, process.env.TOKEN);
        user = decoded.username;
    }catch(err){
        console.log('invalid token');
    }finally{
        return user;
    }
}

module.exports = {
    verifyToken,
    isAdmin,
    getUsername
}