const formdata = require('./formdata');
const psetSelect = require('./pset-select');

module.exports = {
    getCanonicalPSets: async function(query={}, projection=null){
        try{
            let canonical = []
            const form = await formdata.getFormData();
            const datasets = form.dataset.filter(ds => {return !ds.unavailable});
    
            let datasetVersion = [];
            for(let i = 0; i < datasets.length; i++){
                let versions = datasets[i].versions.map(version => {
                    return(parseInt(version.version.substring(0, 4)))
                })
                versions.sort((a, b) => {return b - a})
                let unique = [...new Set(versions)]
                datasetVersion.push({name: datasets[i].name, versions: unique})
            }
    
            const result = await psetSelect.selectPSets({}, projection)
    
            const bhkPSets = result.filter(data => data.createdBy === 'BHK Lab')
    
            for(let i = 0; i < datasetVersion.length; i++){
                
                let datasets = bhkPSets.filter(data => data.dataset.name === datasetVersion[i].name)
                let canonicalSet = []
                let nonCanonicalSet = []
                
                for(let j = 0; j < datasets.length; j++){
                    if(datasets[j].canonical){ 
                        canonicalSet.push(datasets[j])
                    }else{
                        nonCanonicalSet.push(datasets[j])
                    }
                }

                canonical.push({
                    dataset: datasetVersion[i].name, 
                    canonicals: canonicalSet, 
                    nonCanonicals: nonCanonicalSet
                })
            }
    
            return canonical
        }catch(error){
            console.log(error)
            throw error
        }
    },

    getCanonicalDownloadRanking: async function(){
        try{
            const canDataset = await this.getCanonicalPSets()
            let psets = []
            for(let i = 0; i < canDataset.length; i++){
                if(canDataset[i].dataset === 'GDSC'){
                    for(let j = 0; j < canDataset[i].canonicals.length; j++){
                        let canDownload = canDataset[i].canonicals[j].download
                        let version = canDataset[i].canonicals[j].dataset.versionInfo.match(/\((.*?)\)/)
                        let v = version[1].split('-')[0] 
                        for(let k = 0; k < canDataset[i].nonCanonicals.length; k++){
                            let nonCanVersion = canDataset[i].nonCanonicals[k].dataset.versionInfo.match(/\((.*?)\)/)
                            if(nonCanVersion[1].split('-')[0] === v){
                                canDownload += canDataset[i].nonCanonicals[k].download
                            }
                        }
                        canDataset[i].canonicals[j].download = canDownload
                        psets.push({
                            download: canDataset[i].canonicals[j].download,
                            name: canDataset[i].canonicals[j].name,
                            doi: canDataset[i].canonicals[j].doi,
                            dataset: canDataset[i].canonicals[j].dataset.name,
                            version: canDataset[i].canonicals[j].dataset.versionInfo
                        })
                    }
                }else{
                    if(canDataset[i].canonicals.length){
                        let canDownload = canDataset[i].canonicals[0].download

                        for(let j = 0; j < canDataset[i].nonCanonicals.length; j++){
                            canDownload += canDataset[i].nonCanonicals[j].download
                        }
                        canDataset[i].canonicals[0].download = canDownload
                        psets.push({
                            download: canDataset[i].canonicals[0].download,
                            name: canDataset[i].canonicals[0].name,
                            doi: canDataset[i].canonicals[0].doi,
                            dataset: canDataset[i].canonicals[0].dataset.name,
                            version: canDataset[i].canonicals[0].dataset.versionInfo
                        })
                    }
                }
            }
            psets.sort((a, b) => (a.download < b.download) ? 1 : -1)
            return psets
        }catch(error){
            console.log(error)
            throw error
        }
    },
}