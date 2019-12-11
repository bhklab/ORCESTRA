const mock = require('../mockProcess/mockProcess');

const startPipeline = function(req, res){
  mock.execute(req.params.id);
  res.json({status: 1, message: 'sent upon receiving request'});
}

// const sendRequest = function(req, res){
//   mock.execute();
//   res.send({message: 'done'});
// }

module.exports = {
  startPipeline,
  //sendRequest
}
