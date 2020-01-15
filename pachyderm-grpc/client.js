'use strict'

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader')

const packageDefinition = protoLoader.loadSync('./proto-files/pfs.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

const client = new proto.pfs.API('0.0.0.0:30650', grpc.credentials.createInsecure())

let request = {
    'repo': {
        'name': 'some_test_repo'
    },
    'description': "Some repository description",
    'update': false
}

client.CreateRepo(request, (error, response) => {
  if(error) { return console.error(error) }
  console.log(response)
})