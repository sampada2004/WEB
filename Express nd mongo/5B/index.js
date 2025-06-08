const express=require('express')
const app=express();
const bodyParser = require('body-parser');

const {MongoClient}=require('mongodb');
const path=require('path');

const uri='mongodb://127.0.0.1:27017';

const dbname='studentdb';
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'));
});

app.get('/update-grade',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','update.html'));
});

app.post('/add-student',async(req,res)=>{
    const{name,usn,dept,grade}=req.body;
    if(!name||!usn||!dept||!grade){
        return res.send("invalid");
    }

    let client;
    try
    {
        client=await MongoClient.connect(uri,{useUnifiedTopology:true});
        const db=client.db(dbname);
        const collection=db.collection('students');

        await collection.insertOne({name,usn,dept,grade});

        const students=await collection.find().toArray();

        let responseHTML=`<h2>Student List</h2>`;
        students.forEach(s=>{
            responseHTML+=`<li>${s.name}|${s.usn}|${s.dept}|${s.grade}</li>`
        });

        responseHTML+=`<ul><a href="/">Add</a>|<a href="/update-grade">Update grade</a></ul>`
        res.send(responseHTML);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).send("error");
    }
    finally{
        if(client)await client.close();
    }
});

app.post('/update-grade', async (req, res) => {
  const { name, grade } = req.body;
  if (!name || !grade) {
    return res.send('Name and grade are required.');
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db(dbname);
    const collection = db.collection('students');

    const updateResult = await collection.updateOne({ name }, { $set: { grade } });

    let message = '';
    if (updateResult.matchedCount === 0) {
      message = `No student found with name "${name}"`;
    } else {
      message = `Grade updated for student "${name}".`;
    }

    const students = await collection.find().toArray();

    let responseHTML = `<h2>${message}</h2><h3>Students List</h3><ul>`;
    students.forEach(s => {
      responseHTML += `<li>${s.name} | USN: ${s.usn} | Dept: ${s.dept} | Grade: ${s.grade}</li>`;
    });
    responseHTML += `</ul><br><a href="/">Add New Student</a> | <a href="/update-grade">Update Another Grade</a>`;

    res.send(responseHTML);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    if (client) await client.close();
  }
});

app.listen(5000,()=>{
    console.log("5000 listen");
})

