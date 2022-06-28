/**
 * Contains functions that handles user-related use cases such as 
 * user registration, 
 * authentications and 
 * password reset
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailer = require('../../mailer/mailer');
const { v4: uuidv4 } = require('uuid');
const saltRounds = 10;
const User = require('../../db/models/user');

const getUser = async (email) => {
    try{
        let user = await User.findOne({email: email}).select(['-userDataObjects']);
        return user;
    }catch(error){
        throw error;
    }
}

const get = async (req, res) => {
    let user = {};
    try{
        user = await User.findOne({email: email}).select({email: 1, userDataObject: 1});
    }catch(error){
        res.status(500);
    }finally{
        res.send(user);
    }
}

/**
 * Checks if a user exists, and whether the user is registered.
 * @param {*} req 
 * @param {*} res 
 */
const find = async (req, res) => {
    let result = {};
    try{
        const user = await getUser(req.query.username);
        if(user){
            if(user.registered){
                result = {action: 'login'};
            }else{
                result = {action: 'register'};
            }   
        }else{
            result = {action: 'register'};
        }
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(result);
    }
}
 // submit user
const submit = async (req, res) => {
    const incomingUser = req.body;
    try{
        const found = await getUser(incomingUser.username);
        switch(incomingUser.action){
            case 'login':
                const match = bcrypt.compareSync(incomingUser.password1, found.password);
                if(match){
                    const token = jwt.sign(
                        { username: found.email, admin: found.admin }, 
                        process.env.TOKEN, 
                        {expiresIn: '8h'}
                    );
                    res.cookie('orcestratoken', token, {httpOnly: true});
                }
                break;
            case 'register':
                const setToken = () => {
                    const token = jwt.sign(
                        { username: incomingUser.username, admin: false }, 
                        process.env.TOKEN, 
                        {expiresIn: '8h'}
                    );
                    res.cookie('orcestratoken', token, {httpOnly: true});
                }
                const hash = bcrypt.hashSync(incomingUser.password1, saltRounds);
                if(!found){
                    let newUser = new User({
                        email: incomingUser.username, 
                        password: hash, 
                        userDataObjects: [], 
                        registered: true
                    });
                    await newUser.save();
                    setToken();
                }else if(!found.registered){
                    await User.updateOne(
                        {email: incomingUser.username}, 
                        {$set: {password: hash, registered: true}}
                    );
                    setToken();
                }
                break;
            default:
                break;
        }
    }catch(err){
        console.log(err);
        res.status(500);
    }finally{
        res.send();
    } 
}

const logout = async (req, res) => {
    const token = jwt.sign({}, 'tempauthenticationstring', {expiresIn: '0'});
    res.cookie('orcestratoken', token, {httpOnly: true}).send();
}

const session = async (req, res) => {
    let data = null;
    if(req.decoded){
        data = { 
            username: req.decoded.username, 
            admin: req.decoded.admin 
        };
    }
    res.send(data);
}

const resetPwd = async (req, res) => {
    try{
        const user = await getUser(req.body.user.username);
        if(!user || !user.registered){
            res.status(500);
            result = {message: 'User is not registered'};
        }else{
            const hashed = await bcrypt.hash(user.password, saltRounds);
            await User.updateOne(
                {email: user.email}, 
                {$set: {password: hashed}}
            );
        }  
    }catch(error){
        console.log(error)
        res.status(500);
    }finally{
        res.send();
    }
}

const sendResetPwdEmail = async (req, res) => {
    const email = req.body.email;
    let result = {};
    try{
        // check if the user is registered
        const user = await getUser(email);
        if(!user || !user.registered){
            res.status(500);
            result = {message: 'User is not registered'};
        }else{
            // generate temp reset token and expire date/time
            const token = uuidv4();
            // insert the reset token and expiry date to the user entry
            await User.updateOne(
                {email: email}, 
                {$set: {pwdReset: {token: token, expire: Date.now() + 1800000}}}
            );
            //generate a link with the hashed token
            const link = `${process.env.BASE_URL}user/reset/${token}`;

            // send reset password email
            await mailer.sendPwdResetEmail(email, link);
            result  = {status: 1, message: 'ok'};
        }      
    }catch(error){
        console.log(error)
        result = {message: 'Password cannot be reset this time. Please try again.'};
        res.status(500);
    }finally{
        res.send(result);
    }
}

const resetPwdWithToken = async (req, res) => {
    const token = req.body.user.token;
    let result = {};
    try{
        const user = await getUser(req.body.user.username);
        if(!user || !user.registered){
            console.log('user does not exist');
            result = {status: 0, message: 'User does not exist.'};
        }else if(Date.now() > user.pwdReset.expire){
            console.log('token expired');
            result = {status: 0, message: 'Token is expired.'};
        }else if(token.localeCompare(user.pwdReset.token) !== 0){
            console.log(token.localeCompare(user.pwdReset.token));
            console.log('token invalid');
            result = {status: 0, message: 'Token is invalid.'};
        }else{
            console.log('token still valid');
            const hashed = await bcrypt.hash(req.body.user.password, saltRounds);
            await User.updateOne(
                {email: user.email}, 
                {$set: {password: hashed}}
            );
            result = {status: 1};
        }
    }catch(error){
        console.log(error);
        result = {status: 0, message: 'An error occurred.'};
        res.status(500);
    }finally{
        res.send(result);
    }
}

module.exports = {
    get,
    find,
    submit,
    logout,
    session,
    resetPwd,
    sendResetPwdEmail,
    resetPwdWithToken
}