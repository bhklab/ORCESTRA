const mongoose = require('mongoose');
const connection = connect();

function connect() {
    var options = { keepAlive: 1, useNewUrlParser: true, useUnifiedTopology: true };
    mongoose.connect(process.env.DEV, options);
    return mongoose.connection;
}

// closes mongoose connection
function gracefulExit () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection with DB is disconnected through app termination');
        process.exit(0);
    });
}

module.exports = {
    connect,
    connection,
    gracefulExit
};