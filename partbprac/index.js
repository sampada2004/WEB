const express=require('express');
const app=express();
const path=require('path')
const uri="mongodb://127.0.0.1:27017";

const {MongoClient}=require('mongodb');
app.use(express.urlencoded({ extended: true }));


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'));
})
app.get('/update', (req, res) => res.sendFile(path.join(__dirname, 'views', 'update.html')));
app.get('/delete', (req, res) => res.sendFile(path.join(__dirname, 'views', 'delete.html')));

app.post("/insert",async (req,res)=>{
    const {name,usn}=req.body;
    if(!name||!usn)
    {
        return res.send("invalid");
    }

    let client;
    try
    {
        client=await MongoClient.connect(uri,{useUnifiedTopology:true});
        const db= client.db("student");
        const collection=db.collection("details");

        await collection.insertOne({name,usn});
        res.send("Success <a href='/'>Go back</a>|| <a href='/update'>update</a>||<a href='/delete'>delete</a>");


    }
    catch(err)
    {
        console.error("error");
    }
    finally{
        if(client)
        {
            (await client).close();
        }
    }

});


app.post('/update',async(req,res)=>{
     const {name,usn}=req.body;
    if(!name||!usn)
    {
        return res.send("invalid");
    }

    let client;
    try
    {
        client=await MongoClient.connect(uri,{useUnifiedTopology:true});
        const db= client.db("student");
        const collection=db.collection("details");

        await collection.updateOne({name},{$set:{usn}});
        res.send("Success <a href='/'>Go back</a>|| <a href='/insert'>add</a>||<a href='/delete'>delete</a>");


    }
    catch(err)
    {
        console.error("error");
    }
    finally{
        if(client)
        {
            (await client).close();
        }
    }
});

app.post('/delete',async (req,res)=>{
    const {name}=req.body;
    if(!name)
    {
        return res.send("invalid");
    }

    let client;
    try
    {
        client=await MongoClient.connect(uri,{useUnifiedTopology:true});
        const db= client.db("student");
        const collection=db.collection("details");

        await collection.deleteOne({name});
        res.send("Success <a href='/'>Go back</a>|| <a href='/insert'>add</a>||<a href='/delete'>delete</a>");


    }
    catch(err)
    {
        console.error("error");
    }
    finally{
        if(client)
        {
            (await client).close();
        }
    }
});

app.get('/view', async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const db = client.db("student");
        const collection = db.collection("details");

        const students = await collection.find().toArray();

        res.json(students); // ✅ Sends JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching students" });
    } finally {
        if (client) client.close();
    }
});


app.listen(5000,()=>{
    console.log("seeeee");
})