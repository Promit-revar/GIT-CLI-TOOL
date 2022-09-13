var fs = require('fs'); 
const parse = require('csv-parse');
const request = require('./requests');
//This file checks for the version mismatch and changes the content of the files using 'PUT' request after that uses 'POST' request for creating a pull-request
exports.CreatePullRequest=async function(FileName,dname,dversion){
    var parser = parse.parse({columns: true}, function (err, records) {
        var data=new Array();
        for(var i=0;i<records.length;i++){
            var name=records[i]['repo'].substring(records[i]['repo'].indexOf('.com/')+5).split('/');
            if(name[1].indexOf(".git")!=-1){
                name[1]=name[1].substring(0,name[1].indexOf(".git"));
            }
            
            if(records[i]['version_statisfied']=='false'){
                var data2={"owner":name[0],"repo":name[1],"body":`written update of ${dname} to ${dversion}`,"title":"Version Update"}
                var url=`https://api.github.com/repos/${name[0]}/${name[1]}/pulls`
                data.push(request.CreatePullRequest(url,data2));
                
            }
            
            
        }
        
        var y=0;
        Promise.all(data).then(datas=>{
            for(var i=0;i<records.length;i++){
               
                if(records[i]['version_statisfied']=='false'){
                    
                    records[i].pull_rq=data[y].url;
                    y++;
                }
            }
            
            console.table(records);
        })
        
    });
    fs.createReadStream(__dirname+"/"+FileName).pipe(parser);
}