const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '9a2ada6eb3c31b',
        pass: 'aa2daea1eb685a'
    }
});

const sendMail = function(url, email, callback){
    
    const heading = '<h1>Your PSet has been processed and ready</h1>'
    const body = '<p>Please access and view your PSet via the following URL: ' + '<a href=' + url + '>' + url + '</p>'
    const html = heading + body;
    
    const message = {
        from: 'minoru.nakano@uhnresearch.ca',
        to: email,
        subject: 'Your PSet is Ready!',
        html: html
    }

    transport.sendMail(message, function(err, info){
        callback(err, info);
    });
}

module.exports = {
    sendMail
}