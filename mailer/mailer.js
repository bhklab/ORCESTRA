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
        pass: ''
    }
});


const sendMail = function(url, doi, email, download, callback){
    
    console.log("Sending email to: " + email);

    const doi_url = 'http://doi.org/' + doi;
    
    const style = '<style>h2{font-family: arial, san-serif} .content{font-family: arial, san-serif} .signature{font-family: arial, san-serif; font-size: 14px;}</style>'
    const heading = '<h2>Your PSet has been processed</h2>'
    const body = '<p class="content">' +
                    'Please view the details of your PSet here: ' + '<a href=' + url + '>' + url + '</a>.' +
                    '<br /><br />' +
                    'The DOI of your PSet is ' + doi + '. The PSet can be viewed and downloaded at: <a href=' + doi_url + '>' + doi_url + '</a>.' + 
                    '<br /><br />' +
                    'Your PSet can also be downloaded directly via: <a href=' + download + '>' + download + '</a>.' +
                 '</p>' + 
                 '<p class="content"><br />Thank you for using ORCESTRA.</p>' + 
                 '<p class="signature">' + 
                    'ORCESTRA powered by BHK Lab' + 
                    '<br />The MaRS center' +
                    '<br />101 College St. Toronto ON, CANADA' +
                    '<br /><a href="https://bhklab.ca/">https://bhklab.ca/</a>'
                 '</p>'
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