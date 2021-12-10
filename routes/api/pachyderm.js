const grpc = require('../../grpc/grpc-client');

/**
 * Module that includes wrappers that calls GRPC interface functions
 */
module.exports = {
    /**
     * Calls GRPC createPipeline function and handles error.
     * @param {*} request 
     */
    createPipeline: async function(request){
        console.log("createPipeline");
        grpc.createPipeline(request, process.env.PACHYDERM_IP, (result) => {
            if(result.status){
                console.log("pipeline created");
            }else{
                throw new Error('An error occurred at pipeline creation.')
            }
        });
    },
     /**
      * Checks if Pachyderm is online by calling GRPC getVersion.
      */
    checkOnline: async function(){
        let online = false;
        try{
            const result = await grpc.getVersion({}, process.env.PACHYDERM_IP);
            console.log(result);
            online = result.response.major ? true : false;
        }catch(error){
            console.log(error);
            console.log('pachyderm is offline')
        }finally{
            return(online);
        }
        //return true
    },

    /**
     * Returns if Pachyderm is online by calling the checkOnline function.
     * @param {*} req 
     * @param {*} res 
     */
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