const express=require('express')
const app=express();
const {MongoClient}=require('mongodb')
const path=require('path')

const uri='mongodb://127.0.0.1:27017';

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'3b.html'));
});

app.get('/insert',async(req,res)=>{
    const {name,email,phone,hdate,job,sal}=req.query;
    if(!name||!email||!phone||!hdate||!job||!sal)
    {
        return res.send("invalid");
    }
    const salary=Number(sal);
    if(isNaN(salary))
    {
        return res.send("must be number");
    }

    let client;

    try
    {
        client=await MongoClient.connect(uri,{useUnifiedTopology:true});
        const db=client.db('mydb');
        const collection=db.collection('employee')

        await collection.insertOne({name,email,phone,hdate,job,sal:salary});

        const gr8t=await collection.find({sal:{$gt:50000}}).toArray();

       let result = `<h2>Employees with Salary > 50000</h2><ul>`;
        gr8t.forEach(emp => {
            result += `<li>${emp.name} - ${emp.job} - ₹${emp.sal}</li>`;
        });
        result += '</ul><br><a href="/">Add more</a>';

        res.send(result);

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