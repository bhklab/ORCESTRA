const sgMail = require('@sendgrid/mail');

// used for test only
// const nodemailer = require('nodemailer');
// const transport = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//         user: "9a2ada6eb3c31b",
//         pass: "aa2daea1eb685a"
//     }
// });

const sendMail = async function(url, doi, email, download, callback){

    sgMail.setApiKey(process.env.SG_MAIL_KEY);
    
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
        from: {email: 'no-reply@orcestra.ca', name: 'ORCESTRA'},
        to: email,
        subject: '[ORCESTRA] Your PSet is Ready!',
        html: html
    }

    try{
        await sgMail.send(message)
        console.log('mail sent')
    }catch(error){
        console.log(error)
        throw error
    }
}

const sendPwdResetEmail = async function(email, resetLink, callback){

    sgMail.setApiKey(process.env.SG_MAIL_KEY);
    
    console.log("Sending email to: " + email);
    
    const style = '<style>h2{font-family: arial, san-serif} .content{font-family: arial, san-serif} .signature{font-family: arial, san-serif; font-size: 14px;}</style>'
    const heading = '<h2>Please reset your password</h2>'
    const body = '<p class="content">' +
                    'You have requested your password to be reset.' +
                    '<br /><br />' +
                    'Please follow the link to reset your password: <a href=' + resetLink + '>' + resetLink + '</a>.' +
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
        from: {email: 'support@orcestra.ca', name: 'ORCESTRA'},
        to: email,
        subject: '[ORCESTRA] Please reset your password',
        html: html
    }

    try{
        await sgMail.send(message)
        console.log('mail sent')
    }catch(error){
        console.log(error)
        throw error
    }
}

const sendPSetReqEmail = async function(id, name, submittedDate){

    sgMail.setApiKey(process.env.SG_MAIL_KEY);
    
    console.log("Sending email to: " + process.env.ORCESTRA_EMAIL);
    
    const style = '<style>' + 
                    'h2{font-family: arial, san-serif}' + 
                    '.content{font-family: arial, san-serif;}' + 
                    '.signature{font-family: arial, san-serif; font-size: 14px;}' + 
                    '.psetInfo{margin-left: 20px; font-size: 14px; font-family: arial, san-serif;}' +
                '</style>';
    const heading = '<h2>An offline PSet request has been submitted</h2>';
    const body = '<p class="content">A following PSet request has been submitted: </p>' + 
                '<p class="psetInfo">' +
                    `ORCESTRA ID: ${id}  <br />` + 
                    `PSet Name: ${name} <br />` + 
                    `Submitted Date: ${submittedDate.toString()}` +
                '</p>' +
                '<p class="content">Please manually push the request to Pachyderm by starting Pachyderm, and signing in to ORCESTRA as an administrator.</p>' + 
                 '<p class="signature">' + 
                    'ORCESTRA powered by BHK Lab' + 
                    '<br />The MaRS center' +
                    '<br />101 College St. Toronto ON, CANADA' +
                    '<br /><a href="https://bhklab.ca/">https://bhklab.ca/</a>'
                 '</p>';
    const html = style + heading + body;
    
    const message = {
        from: {email: 'no-reply@orcestra.ca', name: 'ORCESTRA'},
        to: process.env.ORCESTRA_EMAIL,
        subject: '[ORCESTRA] A PSet request has been submitted.',
        html: html
    };

    try{
        await sgMail.send(message);
        // await transport.sendMail(message);
        console.log('request notification email sent');
    }catch(error){
        console.log(error);
        throw error;
    }
}

const sendDataSubmissionEmail = async (submissionInfo) => {
    sgMail.setApiKey(process.env.SG_MAIL_KEY);
    
    console.log("Sending email to: " + process.env.ORCESTRA_EMAIL);
    
    const style = '<style>' + 
                    'h2{font-family: arial, san-serif}' + 
                    '.content{font-family: arial, san-serif;}' + 
                    '.signature{font-family: arial, san-serif; font-size: 14px;}' + 
                    '.psetInfo{margin-left: 20px; font-size: 14px; font-family: arial, san-serif;}' +
                '</style>';
    const heading = '<h2>A raw data has been submitted</h2>';
    const body = '<p class="content">A following raw data has been submitted for curation: </p>' + 
                '<p class="psetInfo">' +
                    `Submission ID: ${submissionInfo._id}  <br />` + 
                    `Dataset Name: ${submissionInfo.name} <br />` + 
                    `Email: ${submissionInfo.email} <br />` + 
                '</p>' +
                '<p class="content">' + 
                    'You can view the details of the submitted data here: ' +
                    `<a href=${process.env.BASE_URL}app/data_submission/submitted/${submissionInfo._id}>${process.env.BASE_URL}app/data_submission/submitted/${submissionInfo._id}</a>` +
                '</p>' + 
                 '<p class="signature">' + 
                    'ORCESTRA powered by BHK Lab' + 
                    '<br />The MaRS center' +
                    '<br />101 College St. Toronto ON, CANADA' +
                    '<br /><a href="https://bhklab.ca/">https://bhklab.ca/</a>'
                 '</p>';
    const html = style + heading + body;
    
    const message = {
        from: {email: 'no-reply@orcestra.ca', name: 'ORCESTRA'},
        to: process.env.ORCESTRA_EMAIL,
        subject: '[ORCESTRA] A Dataset has been submitted.',
        html: html
    };
    
    try{
        await sgMail.send(message);
        // await transport.sendMail(message);
        console.log('data submission notification email sent');
    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports = {
    sendMail,
    sendPwdResetEmail,
    sendPSetReqEmail,
    sendDataSubmissionEmail
}