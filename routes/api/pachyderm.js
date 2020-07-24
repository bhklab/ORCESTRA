const grpc = require('../../grpc/grpc-client');

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
        }catch(error){
            //console.log(error);
            console.log('pachyderm is offline')
        }finally{
            return(online);
        }
        //return true
    },

    returnStatus: async function(req, res){
        let online = false;
        try{
            online = await module.exports.checkOnline();
        }catch(error){
            
        }finally{
            res.send({isOnline: online});
        }
    }
}