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

const isAdmin = (req, res, next) => {
    if(req.decoded && req.decoded.isAdmin){
        next();
    }else{
        res.send({});
    }
}

module.exports = {
    verifyToken,
    isAdmin
}