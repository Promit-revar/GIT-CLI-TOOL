
var fs = require('fs'); 
const parse = require('csv-parse');
const jsonToCSV=require('./writecsv');
const request=require('./requests');
exports.VersionCheck=function(FileName,dname,dversion){
// this file reads the csv and dependency version then gets the version by 'GET' request to github api and compares the version
// if is lower then version_satisfied is made false and displayed to the user. and stores the results into src/Gitrepos.csv for future reference.
var parser = parse.parse({columns: true}, function (err, records) {
    var data=new Array();
	for(var i=0;i<records.length;i++){
        var name=records[i]['repo'].substring(records[i]['repo'].indexOf('.com/')+5).split('/');
        
        if(name[1].indexOf(".git")!=-1){
            name[1]=name[1].substring(0,name[1].indexOf(".git"));
        }
       
        var url=`https://api.github.com/repos/${name[0]}/${name[1]}/contents/package.json`;
        data.push(request.getVersion(url));
        
    }
    
    Promise.all(data).then(datas=>{
        for(var i=0;i<datas.length;i++){
            var ver=datas[i].dependencies[dname].substring(1);
            
            if(ver<dversion){
                records[i].version=ver;
                records[i].version_satisfied=true;
            }
            else{
                records[i].version=ver;
                records[i].version_satisfied=false;
                datas[i].dependencies[dname]=datas[i].dependencies[dname].substring(0,1)+dversion;
                
                fs.writeFile(`./Files/${datas[i].name}.txt`,JSON.stringify(datas[i]),err=>{
                    console.log(err);
                });
            }
        }
        
        jsonToCSV.WriteCSV(records);
        console.table(records);
    })
    
});
fs.createReadStream(__dirname+"/"+FileName).pipe(parser);
}