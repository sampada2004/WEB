const express=require('express');
const app=express();
const {MongoClient}=require('mongodb');
const path=require('path');

const uri="mongodb://127.0.0.1:27017";

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'10b.html'));
});

app.get('/insert',async (req,res)=>{

    const {id,title,name,branch}=req.query;
    if(!id||!title||!name||!branch){
        return res.send("invalid");
    }

    let client;
    try{
        client=MongoClient.connect(uri,{useUnifiedTopology:true});
        const db=(await client).db("faculty");
        const collection=await db.collection("clg");

        await collection.insertOne({id,title,name,branch});
        res.send("success <a href='/'>home</a>");
    }
    catch(err)
    {
        console.error("error");
    }
    finally
    {
        if(client)
            (await client).close();
    }
});

app.get("/display", async (req,res)=>{
    let client;
    try{
        client=MongoClient.connect(uri,{useUnifiedTopology:true});
        const db=(await client).db("faculty");
        const collection=await db.collection("clg");

        const ans=await collection.find({branch:'CSE',title:'professor'}).toArray();
        let htans=`<h1>hello</h1>`
        ans.forEach(s=>{
            htans+=`${s.name}`;
        })

        htans+=`<a href='/'>back</a>`;
        res.send(htans);


    }
    catch(err)
    {
        console.error("error");
    }
    finally
    {
        if(client)
            (await client).close();
    }
})

app.listen(5000,()=>{
    console.log("seeess");
})