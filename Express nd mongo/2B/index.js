const express=require('express')
const app=express();
const {MongoClient}=require('mongodb')
const path=require('path')

const uri='mongodb://127.0.0.1:27017';
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'2b.html'));
});

app.get('/insert',async(req,res)=>{
    const {name,usn,semester,fee}=req.query;
    if(!name||!usn||!semester||!fee){
        return res.send("invalid details");
    }
    const feeNumber = Number(fee);
    if (isNaN(feeNumber)) {
        return res.send("Fee must be a valid number");
    }
    let client

    try
    {
        client=await MongoClient.connect(uri,{useUnifiedTopology:true});
        const db=client.db('mydb');
        const collection=db.collection('student_details');

        await collection.insertOne({name,usn,semester,fee:feeNumber});

        const notpaid=await collection.find({fee:{$lte:0}}).toArray();

        const deleteResult = await collection.deleteMany({ fee: { $lte: 0 } });

        
        await collection.deleteMany({fee: { $lte: 0 }});
        const remainingStudents = await collection.find().toArray();

    res.send({
      message: `Deleted ${deleteResult.deletedCount} students who did not pay the exam fee.`,
      remaining: remainingStudents
    });

    }
    catch(err)
    {
        res.status(500).send("error");
    }
    finally
    {
        if(client)
        {
            await client.close();
        }
    }
});

app.listen(5000,()=>{
    console.log('listening on 5000');
});