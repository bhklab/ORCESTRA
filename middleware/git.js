module.exports = {
    pushPachydermConfigJson: function(req, res, next){
        if(req.isOnline){
            console.log("pushPachydermReqJson");
            const simpleGit = require('simple-git')(req.configDir);
            simpleGit 
                .add('./*')    
                .commit('PSet Request: ' + req.pset._id, (err, data) => {
                    if(err){
                        console.log(err);
                        res.status(500).send(err);
                    }
                })
                .push('origin', 'master', (err, data) => {
                    if(err){
                        console.log(err);
                        res.status(500).send(err);
                    }else{
                        console.log('pushPachydermReqJson: pushed');
                    }
                })
                .exec(next);
        }else{
            next();
        } 
    }
}