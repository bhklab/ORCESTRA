const path = require('path');

const downloadExampleFile = async (req, res) => {
    let filePath = path.join(__dirname, '../../../static-files/documentation-examples', req.params.file);
    res.download(filePath, (err) => {if(err)console.log(err)});
}

module.exports = {
    downloadExampleFile
}