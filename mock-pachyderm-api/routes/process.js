const mock = require('../mockProcess/mockProcess');

const startPipeline = function(req, res){
  mock.execute(req.body.id);
  console.log('pipeline request received');
  res.json({status: 1, message: 'pipeline request received'});
}

module.exports = {
  startPipeline,
}
