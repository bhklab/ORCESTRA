const jwt = require('jsonwebtoken');
const code = process.env.CODE;

function flattenArray(arrayData){
    var str ='';
    for(let i = 0; i < arrayData.length; i++){
        str += arrayData[i];
        str += '\n';
    }
    return(str);
}

module.exports = {
    restructureData: function(dataset){
        tools = '';
        if(dataset){
            for(i = 0; i < dataset.length; i++){
                dataset[i].rnaTool = flattenArray(dataset[i].rnaTool);
                dataset[i].rnaRef = flattenArray(dataset[i].rnaRef);
                dataset[i].exomeTool = flattenArray(dataset[i].exomeTool);
                dataset[i].exomeRef = flattenArray(dataset[i].exomeRef);
            }
        }
        return dataset;
    }, 
    
    checkToken: function(req, res, next){
        const token = req.cookies.token;
        if(!token){
            console.log('Unauthorized: No token provided');
            res.status(401).send('Unauthorized: No token provided');
        }else{
            jwt.verify(token, 'orcestraauthenticationtokenstring', function(err, decoded){
                if(err){
                    console.log('Unauthorized: Invalid token');
                    res.status(401).send('Unauthorized: Invalid token');
                }else{
                    req.username = decoded.username;
                    console.log('token valid');
                    next();
                }
            });
        }
    }
}