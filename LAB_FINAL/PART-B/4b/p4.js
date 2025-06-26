const express=require('express');
const app=express();
const path=require('path');
const uri='mongodb://127.0.0.1:27017';

const bodyParser=require('body-parser');

const {MongoClient}=require('mongodb');
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'));
});

app.get('/findpart',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','find.html'));
});

app.get('/adddata',async(req,res)=>{
    const {sid,name,company,dur,status}=req.query;
    if(!sid||!name||!company||!dur||!status)
    {
        res.send("invalid");
    }

    let client;
    try
    {
        client=await MongoClient.connect(uri,{useUnifiedTopology:true});
        const db= client.db('job');
        const collection=db.collection("student");
        await collection.insertOne({sid,name,company,dur,status});
        res.send("success");
    }
    catch(err)
    {
        console.log("error");
    }
    finally{
        if(client)
        {
            await client.close();
        }
    }
});

app.get('/findparticular',async(req,res)=>{
    const {company}=req.query;
    if(!company)
    {
        res.send("invalid");
    }

    let client;
    try
    {
        client=await MongoClient.connect(uri,{useUnifiedTopology:true});
        const db= client.db('job');
        const collection=db.collection("student");
        const ans=await collection.find({company}).toArray();
        res.json(ans);
    }
    catch(err)
    {
        console.log("error");
    }
    finally{
        if(client)
        {
            await client.close();
        }
    }
});

app.put('/interns/:id/complete',async(req,res)=>{
    const id=req.params.id;
    try
    {
        const client=await MongoClient.connect(uri,{useUnifiedTopology:true});
        const db= client.db('job');
        const collection=db.collection("student");
        await collection.updateOne(
            {_id:new ObjectId(id)},
            {$set:{status:'completed'}}
        );
        client.close();
if (result.modifiedCount === 1) {
            res.send("Internship marked as Completed.");
        } else {
            res.status(404).send("Intern not found.");
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }

    
});


app.get('/viewall',async(req,res)=>{
    
    let client;
    try
    {
        client=await MongoClient.connect(uri,{useUnifiedTopology:true});
        const db= client.db('job');
        const collection=db.collection("student");
        const ans=await collection.find({}).toArray();
        res.json(ans);
    }
    catch(err)
    {
        console.log("error");
    }
    finally{
        if(client)
        {
            await client.close();
        }
    }
});

app.listen(5000, () => {
    console.log("Server is running at http://localhost:5000");
});

