const request = require('request');

const execute = function(id, name){
    let doi = name.replace(/\W/g, '') + '/' + id;
    setTimeout(function(){
        request('http://localhost:2000/pset/complete', {
            body: {
                message: 'pipeline complete after 5 seconds', 
                update: {id: id, doi: doi}
            }, json: true}, 
            function (error, response, body) {
                if(error){
                    console.log(error);
                }
                console.log('process comlete');
            }
        );
    }, 10000);  
}

const complete = function(callback){
    
    request.post('https://orcestra.azurewebsites.net/pset/complete', {
            body: {
                doi: 'doi',
                downloadLink: 'downloadlink',
                commitID: 'commitID'
            },
            json: true
        },
        function(error, response, body){
            if(error){
                callback({status: 0, data: error});
            }else{
                callback({status: 1, data: response.body});
            }
        }
    );
}

module.exports = {
    execute,
    complete
}