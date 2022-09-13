const figlet=require("figlet");
const gradient=require("gradient-string");
const Parse=require("./readcsv");
const { program } = require('commander')
const Fs = require('fs')  
const Path = require('path')
const pull=require('./CreatePull');
const greet = async () => {
  
    // Displaying CLI Banner
    figlet('Git Version CLI', function (err, data) {
        console.log(gradient.pastel.multiline(data))                               
    });
  
    // Wait for 2secs
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // command args defined of type node index -i <path of csv> <dependency name@version>
    program
  .option('-i, --input [type...]', 'checking dependences')
  .option('-u, --update [type ...]', 'updating dependences');
  program.parse(process.argv);

const options = program.opts();
if (options.update){
    var dependency=GetData(options.input);
    const path = Path.join(__dirname, "src/Gitrepos.csv");
    
    if(!Fs.existsSync(path)){
        
    Parse.VersionCheck(dependency.address,dependency.name,dependency.version);
    }

    pull.CreatePullRequest("src/Gitrepos.csv",dependency.name,dependency.version);
   
}
else if (options.input){
    
    var dependency=GetData(options.input);
    Parse.VersionCheck(dependency.address,dependency.name,dependency.version);              
    
}

    
}

//function to get data from arguments
function GetData(args){
    if(args.length!=2){
        console.log("please provide valid command for viewing enter 'node index --help'");
        process.exit(9);
    }
    else{
        
        if(args[1].indexOf('@')==-1){
            console.log("The argument specifying the dependency and version should be of type <name of dependency>@<version>.")
         process.exit(1);
        }
        var d=args[1].split('@');
    }
    
    var dependency={};
    dependency.name=d[0];
    dependency.version=d[1];
    dependency.address=args[0];
    
    return dependency;
    
    
}

greet();