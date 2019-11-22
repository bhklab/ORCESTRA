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
        for(i = 0; i < dataset.length; i++){
            dataset[i].rnaTool = flattenArray(dataset[i].rnaTool);
            dataset[i].rnaRef = flattenArray(dataset[i].rnaRef);
            dataset[i].exomeTool = flattenArray(dataset[i].exomeTool);
            dataset[i].exomeRef = flattenArray(dataset[i].exomeRef);
        }
        return dataset;
    }   
}