/**
 * Contains functions that handles user-related use cases such as 
 * user registration, 
 * authentications and 
 * password reset
 */
const userdata = require('../../db/helper/userdata');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailer = require('../../mailer/mailer');
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(512, UIDGenerator.BASE62);
const saltRounds = 10;

async function getUser(req, res){
    try{
        const user = await userdata.selectUser(req.query.username)
        res.send(user)
    }catch(error){
        res.status(500).send({});
    }
}

/**
 * Checks if a user exists, and whether the user is registered.
 * @param {*} req 
 * @param {*} res 
 */
const find = async (req, res) => {
    try{
        const user = await userdata.selectUser(req.query.username);
        if(user){
            if(user.registered){
                res.send({action: 'login'});
            }else{
                res.send({action: 'register'});
            }   
        }else{
            res.send({action: 'register'});
        }
    }catch(error){
        res.status(500).send({});
    }
}
 // submit user
const submit = async (req, res) => {
    const user = req.body;
    let data = null;
    try{
        const found = await userdata.selectUser(user.username);
        switch(user.action){
            case 'login':
                const match = bcrypt.compareSync(user.password1, found.password);
                if(match){
                    data = { username: found.username, isAdmin: found.isAdmin };
                    const token = jwt.sign(data, process.env.TOKEN, {expiresIn: '8h'});
                    res.cookie('orcestratoken', token, {httpOnly: true});
                }
                break;

            case 'register':
                const hash = bcrypt.hashSync(user.password1, saltRounds);
                if(!found){
                    await userdata.addUser({ username: user.username, password: hash });
                }else if(!found.registered){
                    await userdata.registerUser({ username: user.username, password: hash });
                }
                if(!found || !found.registered){
                    data = { username: user.username, isAdmin: false };
                    const token = jwt.sign(data, process.env.TOKEN, {expiresIn: '1h'});
                    res.cookie('orcestratoken', token, {httpOnly: true});
                }
                break;

            default:
                break;
        }
    }catch(err){
        console.log(err);
        res.status(500);
    }finally{
        res.send(data);
    } 
}

const logout = async (req, res) => {
    const token = jwt.sign({}, 'tempauthenticationstring', {expiresIn: '0'});
    res.cookie('orcestratoken', token, {httpOnly: true}).status(200).send();
}

const getSession = async (req, res) => {
    let data = null;
    if(req.decoded){
        data = { 
            username: req.decoded.username, 
            isAdmin: req.decoded.isAdmin 
        };
    }
    res.send(data);
}

const resetPwd = async (req, res) => {
    const user = req.body.user;
    try{
        const hashed = await bcrypt.hash(user.password, saltRounds);
        await userdata.resetPassword({username: user.username, password: hashed});
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
        const user = await userdata.selectUser(email)
        if(!user || !user.registered){
            res.status(500).send({message: 'User is not registered'});
        }
        // generate temp reset token and expire date/time
        const token = uidgen.generateSync();
        // insert the reset token and expiry date to the user entry
        await userdata.setResetToken({username: email, token: token});
        
        //generate a link with the hashed token
        const link = process.env.BASE_URL_DEV + 'reset/' + token;

        // send reset password email
        await mailer.sendPwdResetEmail(email, link);
        result  = {status: 1, message: 'ok'};
    }catch(error){
        result = {message: 'Password cannot be reset this time. Please try again.'};
        res.status(500);
    }finally{
        res.send({});
    }
    
}

const resetPwdWithToken = async (req, res) => {
    const token = req.body.user.token;
    console.log(req.body.user);
    let result = {};
    try{
        const user = await userdata.selectUser(req.body.user.username);
        if(!user || !user.registered){
            console.log('user does not exist');
            result = {status: 0, message: 'User does not exist.'};
        }else if(Date.now() > user.expire){
            console.log('token expired');
            result = {status: 0, message: 'Token is expired.'};
        }else if(token.localeCompare(user.resetToken) !== 0){
            console.log(token.localeCompare(user.resetToken));
            console.log('token invalid');
            result = {status: 0, message: 'Token is invalid.'};
        }else{
            console.log('token still valid');
            const hashed = await bcrypt.hash(req.body.user.password, saltRounds);
            await userdata.resetPassword({username: user.username, password: hashed});
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
    getUser,
    find,
    submit,
    logout,
    getSession,
    resetPwd,
    sendResetPwdEmail,
    resetPwdWithToken
}