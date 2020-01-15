const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

module.exports = {
    getClient: function(protocol){
        const packageDefinition = protoLoader.loadSync('./proto-files/pfs.proto');
        const proto = grpc.loadPackageDefinition(packageDefinition);
    }
}