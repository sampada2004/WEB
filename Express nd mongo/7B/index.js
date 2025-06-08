const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const uri = 'mongodb://127.0.0.1:27017';

app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'form.html'));});

app.get('/add', async (req, res) => {const { name, usn, branch, sem, grade } = req.query;
  if (!name || !usn || !branch || !sem || !grade) {
    return res.send('All fields are required!');
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('examdb');
    const collection = db.collection('students');

    await collection.insertOne({name,usn,branch,sem: parseInt(sem),grade});

    res.send(`<p>Student record added successfully.</p><a href="/">Go Back</a>`);
  } catch (err) {} 
  finally {if (client) await client.close();}
});

app.get('/sgrade', async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('examdb');
    const collection = db.collection('students');

    const students = await collection.find({ grade: 'S' }).toArray();

    let output = `<h2>Students with 'S' Grade</h2><ul>`;
    students.forEach(s => {
      output += `<li>${s.name} - ${s.usn} - ${s.branch} - Semester ${s.sem}</li>`;
    });
    output += '</ul><a href="/">Go Back</a>';

    res.send(output);
  } catch (err) {} 
  finally {if (client) await client.close();}
});

app.listen(5000);