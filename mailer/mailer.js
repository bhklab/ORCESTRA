const sgMail = require('@sendgrid/mail');

const sendMail = async function(url, doi, email, download, callback){

    sgMail.setApiKey(process.env.SG_MAIL_KEY)
    
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

    sgMail.setApiKey(process.env.SG_MAIL_KEY)
    
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

module.exports = {
    sendMail,
    sendPwdResetEmail
}