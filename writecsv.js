const tocsv=require('csv-writer');
// This file stores the output of first command in form of csv so that we need not to make API calls again and again
exports.WriteCSV=async function(records){
var createCsvWriter = tocsv.createObjectCsvWriter
        const csvWriter = createCsvWriter({
  
            
            path: './src/Gitrepos.csv',
            header: [
            
              
              {id: 'name', title: 'name'},
              {id: 'repo', title: 'repo'},
              {id: 'version', title: 'version'},
              {id: 'version_satisfied', title: 'version_statisfied'},
            ]
          });
          csvWriter.writeRecords(records).then(()=> console.log('Data uploaded into csv successfully'));
        }