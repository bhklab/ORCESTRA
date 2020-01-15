'use strict'

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader')

const packageDefinition = protoLoader.loadSync('./proto-files/pfs.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

const PORT = 30650 || process.env.PORT

const server = new grpc.Server()

server.addService(proto.pfs.API.service, {
    CreateRepo(call, callback) {

    console.log(`Recieved request ${JSON.stringify(call.request, undefined, 2)}`)

    // Returns an empty response
    let res = {}
    callback(null, res)
  }
})

server.bind(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure())
server.start()
console.log(`GRPC server is running on ${PORT}`)
