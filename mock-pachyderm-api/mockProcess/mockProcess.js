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
    }, 5000);  
}

module.exports = {
    execute
}