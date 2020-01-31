const nodemailer = require('nodemailer');
const pass = process.env.PASS;

// const transport = nodemailer.createTransport({
//     host: 'smtp.mailtrap.io',
//     port: 2525,
//     auth: {
//         user: '9a2ada6eb3c31b',
//         pass: 'aa2daea1eb685a'
//     }
// });

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'orcestra.bhklab@gmail.com',
        pass: pass
    }
});


const sendMail = function(url, email, callback){
    
    console.log("Sending email to: " + email);
    
    const style = '<style>h2{font-family: arial, san-serif} .content{font-family: arial, san-serif}</style>'
    const heading = '<h2>Your PSet has been processed</h2>'
    const body = '<p class="content">Please access and view your PSet here: ' + '<a href=' + url + '>' + url + '</p>'
    const html = style + heading + body;
    
    const message = {
        from: 'orcestra.bhklab@gmail.com',
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