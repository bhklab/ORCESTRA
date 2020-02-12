const grpc = require('../grpc/grpc-client');

module.exports = {
    createPipeline: async function(request){
        console.log("createPipeline");
        grpc.createPipeline(request, (result) => {
            if(result.status){
                console.log("pipeline created");
            }else{
                throw new Error('An error occurred at pipeline creation.')
            }
        });
    },

    checkOnline: async function(){
        let online = false;
        try{
            const result = await grpc.getVersion({});
            console.log(result);
            online = result.response.major ? true : false;
            return(online);
        }catch(error){
            console.error(error);
            throw error;
        }
    },

    returnStatus: async function(req, res){
        const online = await module.exports.checkOnline();
        res.send({isOnline: online});
    }
}