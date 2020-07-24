const mongo = require('../mongo');

module.exports = {
    selectUser: async function(username){
        const db = await mongo.getDB();
        try{
            const collection = db.collection('user')
            const data = await collection.findOne({'username': username})
            return data
        }catch(err){
            console.log(err)
            throw err
        }
    },

    addUser: async function(user){
        const db = await mongo.getDB();
        try{
            const collection = db.collection('user')
            const data = await collection.insertOne(
                {'username': user.username, 'password': user.password, 'userPSets': [], 'registered': true}
            )
            return data
        }catch(err){
            console.log(err)
            throw err
        }
    },

    registerUser: async function(user){
        const db = await mongo.getDB();
        try{
            const collection = db.collection('user')
            const data = await collection.findOneAndUpdate(
                {'username': user.username},
                {'$set': {'password': user.password, 'registered': true}},
                {'upsert': true}
            )
            return data.value
        }catch(err){
            console.log(err)
            throw err
        }
    },

    resetPassword: async function(user){
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
    },

    setResetToken: async function(user){
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
}