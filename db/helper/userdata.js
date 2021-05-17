const mongo = require('../mongo');

const selectUser = async (username) => {
    const db = await mongo.getDB();
    try{
        const collection = db.collection('user');
        const data = await collection.findOne({'username': username});
        return data;
    }catch(err){
        console.log(err);
        throw err;
    }
}

const addUser = async (user) => {
    const db = await mongo.getDB();
    try{
        const collection = db.collection('user')
        const data = await collection.insertOne(
            {'username': user.username, 'password': user.password, 'userDatasets': [], 'registered': true}
        )
        return data
    }catch(err){
        console.log(err)
        throw err
    }
}

const registerUser = async (user) => {
    const db = await mongo.getDB();
    try{
        const collection = db.collection('user');
        const data = await collection.findOneAndUpdate(
            {'username': user.username},
            {'$set': {'password': user.password, 'registered': true}},
            {'upsert': true}
        );
        return data.value;
    }catch(err){
        console.log(err)
        throw err
    }
}

const resetPassword = async (user) => {
    const db = await mongo.getDB();
    try{
        const collection = db.collection('user')
        const data = await collection.findOneAndUpdate(
            {'username': user.username},
            {'$set': {'password': user.password}}
        )
        return data.value
    }catch(err){
        console.log(err)
        throw err
    }
}

const setResetToken = async (user) => {
    const db = await mongo.getDB();
    try{
        const collection = db.collection('user')
        // 30 minutes = 1800000 millisec
        // 30sec = 30000 millisec
        const data = await collection.findOneAndUpdate(
            {'username': user.username},
            {'$set': {'resetToken': user.token, 'expire': Date.now() + 1800000}}
        )
        return data.value
    }catch(err){
        console.log(err)
        throw err
    }
}

module.exports = {
    selectUser,
    addUser,
    registerUser,
    resetPassword,
    setResetToken
}