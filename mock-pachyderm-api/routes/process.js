const mock = require('../mockProcess/mockProcess');

const startPipeline = function(req, res){
  mock.execute(req.body.id, req.body.name);
  console.log('pipeline request received');
  res.json({status: 1, message: 'pipeline request received'});
}

const completeProcess = function(req, res){
  mock.complete((result) => {
    if(result.status){
      res.send(result);
    }else{
      res.status(500).send();
    }
  });
}

module.exports = {
  startPipeline,
  completeProcess
}
