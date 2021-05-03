/**
 * Contains functions that handles user-related use cases such as 
 * user registration, 
 * authentications and 
 * password reset
 */
const userdata = require('../../db/helper/userdata');
const userPSet = require('../../db/helper/user-pset');
const User = require('../../db/models/user');
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
                    const token = jwt.sign(data, process.env.TOKEN, {expiresIn: '1h'});
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

async function resetPwd(req, res){
    const user = req.body.user
    try{
        const hashed = await bcrypt.hash(user.password, saltRounds)
        const updated = await userdata.resetPassword({username: user.username, password: hashed})
        const token = jwt.sign({username: user.username}, process.env.KEY, {expiresIn: '1h'})
        res.cookie('token', token, {httpOnly: true}).send({authenticated: true, username: user.username, isAdmin: updated.admin}) 
    }catch(error){
        console.log(error)
        res.status(500).send({authenticated: false})
    }
}

async function sendResetPwdEmail(req, res){
    const email = req.body.email
    try{
        // check if the user is registered
        const user = await userdata.selectUser(email)
        if(!user || !user.registered){
            res.status(500).send({message: 'User is not registered'});
        }
        // generate temp reset token and expire date/time
        const token = uidgen.generateSync();
        // insert the reset token and expiry date to the user entry
        await userdata.setResetToken({username: email, token: token})
        
        //generate a link with the hashed token
        const link = process.env.BASE_URL + 'Reset/' + token

        // send reset password email
        await mailer.sendPwdResetEmail(email, link)
        res.send({status: 1, message: 'ok'});
    }catch(error){
        res.status(500).send({message: 'Password cannot be reset this time. Please try again.'});
    }
    
}

async function resetPwdWithToken(req, res){
    const token = req.body.user.token
    try{
        const user = await userdata.selectUser(req.body.user.username)
        if(!user || !user.registered){
            console.log('user does not exist')
            res.send({status: 0, message: 'User does not exist.'})
        }else if(Date.now() > user.expire){
            console.log('token expired')
            res.send({status: 0, message: 'Token is expired.'})
        }else if(token.localeCompare(user.resetToken) != 0){
            console.log(token.localeCompare(user.resetToken))
            console.log('token invalid')
            res.send({status: 0, message: 'Token is invalid.'})
        }else{
            console.log('token still valid')
            const hashed = await bcrypt.hash(req.body.user.password, saltRounds)
            await userdata.resetPassword({username: user.username, password: hashed})
            const token = jwt.sign({username: user.username}, process.env.KEY, {expiresIn: '1h'})
            res.cookie('token', token, {httpOnly: true}).send({status: 1}) 
        }
    }catch(error){
        console.log(error)
        res.status(500).send({status: 0, message: 'An error occurred.'})
    }
}

async function getUserPSet(req, res){
    try{
        const result = await userPSet.selectUserPSets(req.query.username);
        res.send(result);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

async function addToUserPset(req, res){
    const pset = req.body.reqData;
    try{
        await userPSet.addToUserPset(pset);
        res.send({summary: 'PSets Saved', message: 'The selected PSets have been saved.'});
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

async function removeUserPSet(req, res){
    try{
        await userPSet.removeUserPSets(req.body.username, req.body.psetID);
        res.send({summary: 'Updated Saved PSets', message: 'The selected PSet(s) have been removed from the saved list.'});
    }catch(error){
        console.log(error);
        res.status(500).send(error);
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
    resetPwdWithToken,
    getUserPSet,
    addToUserPset,
    removeUserPSet
}