const request = require('request');

const execute = function(id){
    setTimeout(function(){
        request('http://localhost:2000/pset/complete', {
            body: {
                message: 'pipeline complete after 5 seconds', 
                id: id
            }, json: true}, 
            function (error, response, body) {
                if(error){
                    console.log(error);
                }
                console.log('process comlete');
            }
        );
    }, 30000);  
}

module.exports = {
    execute
}