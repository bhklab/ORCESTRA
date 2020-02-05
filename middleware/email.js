const mailer = require('../mailer/mailer');

module.exports = {
    sendPSetEmail: function(req, res){
        console.log('sendPSetEmail');
        
        const url = 'http://www.orcestra.ca/' + req.doi;
    
        mailer.sendMail(url, req.doi, req.email, req.download, (err, info) => {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }
            console.log('email sent');
            res.send({status: 1, message: 'ok'});
        });
    }
}