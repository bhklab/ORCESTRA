const userdata = require('../../db/helper/userdata');
const userPSet = require('../../db/helper/user-pset');
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

async function checkUser(req, res){
    try{
        const user = await userdata.selectUser(req.query.username)
        if(user){
            if(user.registered){
                res.send({exists: true, registered: true});
            }else{
                res.send({exists: true, registered: false});
            }   
        }else{
            res.send({exists: false, registered: false});
        }
    }catch(error){
        res.status(500).send({});
    }
}

async function registerUser(req, res){
    const reqUser = req.body.user
    // double check if the user is registered (if yes, return, if not proceed)
    try{
        const user = await userdata.selectUser(reqUser.username)
        if(user && user.registered){
            res.send({status: 0, authenticated: false, username: user.username, message: 'The email is already used.'})
        }else if(user && !user.registered){ 
            user.password = bcrypt.hashSync(reqUser.password, saltRounds)
            await userdata.registerUser(user)
            const token = jwt.sign({username: user.username}, process.env.KEY, {expiresIn: '1h'})
            res.cookie('token', token, {httpOnly: true}).send({status: 1, authenticated: true, username: user.username})
        }else{
            reqUser.password = bcrypt.hashSync(reqUser.password, saltRounds)
            await userdata.addUser(reqUser)
            const token = jwt.sign({username: reqUser.username}, process.env.KEY, {expiresIn: '1h'})
            res.cookie('token', token, {httpOnly: true}).send({status: 1, authenticated: true, username: reqUser.username})
        }
    }catch(error){
        console.log(error)
        res.status(500).send({status: 0, authenticated: false, username: reqUser.username, message: 'Please try again.'});
    }
}

async function loginUser(req, res){
    try{
        const user = await userdata.selectUser(req.body.user.username)
        if(user){
            const match =  await bcrypt.compare(req.body.user.password, user.password)
            if(match){
                const token = jwt.sign({username: user.username, isAdmin: user.isAdmin}, process.env.KEY, {expiresIn: '1h'});
                res.cookie('token', token, {httpOnly: true}).send({authenticated: true, username: req.body.user.username, isAdmin: user.isAdmin});
            }else{
                res.send({authenticated: false});
            }
        }else{
            res.send({authenticated: false});
        }   
    }catch(error){
        console.log(error)
        res.status(500).send({authenticated: false});
    }
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

function checkToken(req, res){
    res.status(200).send({authenticated: true, username: req.username, isAdmin: req.isAdmin});
}

function logoutUser(req, res){
    const token = jwt.sign({username: req.params.username}, 'orcestraauthenticationtokenstring', {expiresIn: '0'});
    res.cookie('token', token, {httpOnly: true}).status(200).send();
}

module.exports = {
    getUser,
    checkUser,
    registerUser,
    loginUser,
    resetPwd,
    sendResetPwdEmail,
    resetPwdWithToken,
    getUserPSet,
    addToUserPset,
    removeUserPSet,
    checkToken,
    logoutUser
}