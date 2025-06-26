const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');

const uri = 'mongodb://127.0.0.1:27017';

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve add complaint form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '1b.html'));
});

// Serve manage complaints page
app.get('/manage', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'manage.html'));
});

// Add a complaint
app.post('/addcomplaint', async (req, res) => {
  const { cid, username, issue, status } = req.body;

  if (!cid || !username || !issue || !status) {
    return res.status(400).json({ message: "Invalid input" });
  }

  let client;

  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('complaint');
    const collection = db.collection('compl');

    await collection.insertOne({ cid, username, issue, status });
    res.json({ message: "Complaint added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding complaint" });
  } finally {
    if (client) await client.close();
  }
});
// PUT API endpoint (requirement from question)
app.put('/updateStatusForm', async (req, res) => {
  const { cid, status } = req.body;

  if (!cid || !status) {
    return res.status(400).json({ message: 'Missing complaint ID or status' });
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('complaint');
    const result = await db.collection('compl').updateOne(
      { cid },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Complaint not found' });
    } else {
      res.json({ message: 'Status updated successfully' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating complaint' });
  } finally {
    if (client) await client.close();
  }
});

// Get pending complaints as JSON
app.get('/pendingComplaints', async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('complaint');
    const pending = await db.collection('compl').find({ status: 'Pending' }).toArray();
    res.json({ complaints: pending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching complaints' });
  } finally {
    if (client) await client.close();
  }
});

// Get all complaints as JSON
app.get('/allComplaints', async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('complaint');
    const allComplaints = await db.collection('compl').find({}).toArray();
    res.json({ complaints: allComplaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching all complaints' });
  } finally {
    if (client) await client.close();
  }
});

app.listen(5001, () => {
  console.log('Complaint Management API running on port 5001');
});
