const getHome = function(req, res){
  res.json([{id: 1, username: "test1"}, {id: 2, username: "test2"}]);
}

module.exports = {
  getHome
}







