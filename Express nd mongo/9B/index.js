const express=require('express');
const app=express();
const path=require('path');
const {MongoClient}=require('mongodb');
const uri="mongodb://127.0.0.1:27017";

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'9b.html'));
});

app.get('/insert',async (req,res)=>{
    const {name,branch,sem}=req.query;
    if(!name||!branch||!sem)
    {
        return res.send("invalid");
    }
    const semester=Number(sem);
    let client;

    try{
        client=MongoClient.connect(uri,{useUnifiedTopology:true});
        const db=(await client).db("students");
        const collection=db.collection("clg");

        await collection.insertOne({name,branch,sem:semester});

        res.send("success added <a href='/'>home</a>");
        
    }
    catch(err)
    {
        console.error("error");
    }
    finally{
        if(client)
        (await client).close();
    }
});

app.get("/display",async (req,res)=>
{
    let client;
    try{
    client=MongoClient.connect(uri,{useUnifiedTopology:true});
    const db=(await client).db("students");
    const collection=db.collection("clg");

    const ans=await collection.find({branch:/cse/i,sem:6}).toArray();
    
    let htans=`<p>list</p>`
    ans.forEach(s=>{
        htans+=`${s.name}`;
    });
    htans+=`<p><a href='/'>back</a></p>`;
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
});

app.listen(5000,()=>
{
    console.log("see");
});
