const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();

const url = 'mongodb://127.0.0.1:27017';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'manage.html'));
});

// POST - Add new complaint
app.post('/complaints', async (req, res) => {
  const { complaintId, userName, issue, status } = req.body;
  if (!complaintId || !userName || !issue || !status) {
    return res.send("invalid");
  }

  let client;
  try {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('complaints');
    const collection = db.collection('records');
    await collection.insertOne({ complaintId, userName, issue, status });
    res.send("success");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Submission failed' });
  } finally {
    if (client) await client.close();
  }
});

// PUT - Update complaint status
app.put('/complaints/:id', async (req, res) => {
  const complaintId = req.params.id;
  const { status } = req.body;

  let client;
  try {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('complaints');
    const collection = db.collection('records');

    const result = await collection.updateOne(
      { complaintId },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return res.send('Complaint not found');
    }
    res.json({ message: 'Status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  } finally {
    if (client) await client.close();
  }
});

// GET - View pending complaints
app.get('/complaints/pending', async (req, res) => {
  const { status } = req.query;
  if (!status) return res.send("invalid");

  let client;
  try {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('complaints');
    const collection = db.collection('records');
    const complaints = await collection.find({ status: 'Pending' }).toArray();
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  } finally {
    if (client) await client.close();
  }
});

// GET - View all complaints
app.get('/complaints/all', async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('complaints');
    const collection = db.collection('records');
    const complaints = await collection.find({}).toArray();
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  } finally {
    if (client) await client.close();
  }
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
