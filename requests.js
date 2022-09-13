const { Octokit } = require("@octokit/core");
const fs=require('fs');
const axios=require('axios');
require('dotenv').config();

// This file contains functions to send request and get reponse to different endpoints of github api
exports.getVersion=async function(url){
    return await axios.get(url, {headers:{
        Authorization: 'Bearer ' + process.env.PERSONAL_ACCESS_TOKEN
      }})
        .then(res => {
            
            let buff = new Buffer(res.data.content, 'base64');
            let text = buff.toString('ascii');
            
            var content=JSON.parse(text);
            content['sha']=res.data.sha;
            
            
            
            return content;
        })
        
        .catch(error => {
    console.log(error.data);
    
  });         
}
exports.CreatePullRequest=async function(url,data){
    //console.log(data);
    fs.readFile(`./Files/${data.repo}.txt`, async (err, contain) => {
        //console.log(contain);
        var sha=JSON.parse(contain)['sha'];
        const octokit = new Octokit({
            auth:process.env.PERSONAL_ACCESS_TOKEN
          })
    const response=await octokit.request(
        'PUT /repos/{owner}/{repo}/contents/{path}',
        {
        owner: data.owner,
        repo: data.repo,
        path: 'README.md',
        message: "changed the package.json",
        content: Buffer.from(contain, "ascii").toString("base64"),
        sha:sha
         },
        )
         .catch(err=>console.log(err));
         console.log(response);
      })
      
    

const response2 = await octokit.request(
    `POST /repos/{owner}/{repo}/pulls`, {  
        owner: data.owner,
        repo: data.repo,
        title: data.title,
        body: data.body,
        head: master, 
        base: master }
).then(res=>console.log(res))
.catch(error=>console.log(error.response.data));
return response2;
}
