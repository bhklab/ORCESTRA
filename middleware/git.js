module.exports = {
    pushPachydermConfigJson: async function(id, configDir){
        console.log("pushPachydermReqJson");
        const simpleGit = require('simple-git/promise')(configDir);
        try{
            await simpleGit.add('./*');
            await simpleGit.commit('PSet Request: ' + id);
            await simpleGit.push('origin', 'master');
        }catch(err){
            console.log(err);
            throw(err);
        }
    }
}