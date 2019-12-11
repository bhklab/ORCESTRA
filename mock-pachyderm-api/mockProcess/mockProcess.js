const request = require('request');

const execute = function(id){
    setTimeout(function(){
        request('http://localhost:2000/pset/complete', {
            body: {
                message: 'sent after 5 seconds', 
                id: id
            }, json: true}, 
            function (error, response, body) {
                if(error){
                    console.log(error);
                }
                console.log('mock api statusCode:', response && response.statusCode); 
            }
        );
    }, 10000);  
}

module.exports = {
    execute
}