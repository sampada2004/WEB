const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const uri = 'mongodb://127.0.0.1:27017';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve form to add student
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve form to delete student
app.get('/deleteform', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'delete.html'));
});

// Add student logic
app.get('/addstudent', async (req, res) => {
  const { sname, usn, sem, fee } = req.query;
  if (!sname || !usn || !sem || !fee) {
    return res.send("Invalid input");
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('students');
    await db.collection('details').insertOne({ sname, usn, sem, fee });
    res.send("Student added successfully");
  } catch (err) {
    console.log("Error", err);
    res.send("Error inserting student");
  } finally {
    if (client) await client.close();
  }
});

// Delete student logic
app.get('/deletestudent', async (req, res) => {
  const { fee } = req.query;
  if (!fee) {
    return res.send("Fee is required");
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('students');
    const result = await db.collection('details').deleteOne({ fee });

    if (result.deletedCount === 0) {
      res.send("No student found with that fee");
    } else {
      res.send("Student deleted successfully");
    }
  } catch (err) {
    console.log("Error", err);
    res.send("Error deleting student");
  } finally {
    if (client) await client.close();
  }
});

app.get('/viewall', async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('students');
    const students = await db.collection('details').find({}).toArray();

    res.json(students); // Return all student records as JSON
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching student records');
  } finally {
    if (client) await client.close();
  }
});


app.listen(5001, () => {
  console.log("Server running on port 5001");
});
