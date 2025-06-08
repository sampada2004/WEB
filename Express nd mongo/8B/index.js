const express=require('express')
const app=express();
const path=require('path')

const {MongoClient}=require('mongodb')
const uri="mongodb://127.0.0.1:27017";

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'8b.html'));
});

app.get('/insert',async (req,res)=>{
    const {usn,name,company}=req.query;
    if(!usn||!name||!company)
    {
        return res.send("invalid");
    }

    let client;
    try{
        client=MongoClient.connect(uri,{useUnifiedTopology:true});
        const db=(await client).db("mydb");
        const collection=await db.collection("companies");

        await collection.insertOne({usn,name,company});
        res.send(`<p>record assed</p><a href="/">go back</a>`);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).send("error");
    }
    finally{
        if(client)
            (await client).close();
    }
});

app.get("/infosys",async(req,res)=>{
    let client;
    try{
        client=MongoClient.connect(uri,{useUnifiedTopology:true});

        const db=(await client).db("mydb");
        const collection=await db.collection("companies");

        const infostu=await collection.find({company:/infosys/i}).toArray();

        let output=`selected`;
        infostu.forEach(s=>{
            output+=`<li>${s.name} ${s.usn}</li>`;
        });

        output+='</ul><a href="/">Go back</a>';
        res.send(output);
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

app.listen(5000,()=>{
    console.log("see 5000");
})

