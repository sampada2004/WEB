const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const uri = 'mongodb://127.0.0.1:27017';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve main form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve search page
app.get('/findpart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'find.html'));
});

// Add internship data
app.get('/adddata', async (req, res) => {
  const { sid, name, company, dur, status } = req.query;
  if (!sid || !name || !company || !dur || !status) return res.send("invalid");

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('job');
    const collection = db.collection('student');
    await collection.insertOne({ sid, name, company, dur, status });
    res.send("success");
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Server error");
  } finally {
    if (client) await client.close();
  }
});

// Find interns by company
app.get('/findparticular', async (req, res) => {
  const { company } = req.query;
  if (!company) return res.send("invalid");

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('job');
    const collection = db.collection('student');
    const results = await collection.find({ company }).toArray();
    res.json(results);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Server error");
  } finally {
    if (client) await client.close();
  }
});

// PUT - Mark internship as completed
app.put('/interns/:id/complete', async (req, res) => {
  const id = req.params.id;

  try {
    const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('job');
    const collection = db.collection('student');

    const result = await collection.updateOne(
      { sid: id },
      { $set: { status: 'completed' } }
    );

    await client.close();

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

// View all interns
app.get('/viewall', async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('job');
    const collection = db.collection('student');
    const all = await collection.find({}).toArray();
    res.json(all);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Server error");
  } finally {
    if (client) await client.close();
  }
});

app.listen(5000, () => {
  console.log("Server is running at http://localhost:5000");
});
