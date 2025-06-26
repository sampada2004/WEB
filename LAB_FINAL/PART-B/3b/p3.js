const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const uri = 'mongodb://127.0.0.1:27017';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve add employee form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve delete employee form
app.get('/delempform', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'delete.html'));
});

// Add employee
app.get('/addemp', async (req, res) => {
    const { name, email, phone, date, title, salary } = req.query;
    if (!name || !email || !phone || !date || !title || !salary) {
        return res.send("Invalid input");
    }

    let client;
    try {
        client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const db = client.db("HR");
        const collection = db.collection("employees");

        await collection.insertOne({ name, email, phone, date, title, salary: Number(salary) });
        res.send("Employee added successfully");
    } catch (err) {
        console.error("Error inserting employee:", err);
        res.status(500).send("Internal server error");
    } finally {
        if (client) await client.close();
    }
});

// Delete employees with salary greater than value
app.get('/delemp', async (req, res) => {
    const { salary } = req.query;
    if (!salary) return res.send("Salary is required");

    let client;
    try {
        client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const db = client.db("HR");
        const collection = db.collection("employees");

        const result = await collection.deleteMany({ salary: { $gt: Number(salary) } });
        res.send(`Deleted ${result.deletedCount} employee(s) with salary > ${salary}`);
    } catch (err) {
        console.error("Error deleting employees:", err);
        res.status(500).send("Internal server error");
    } finally {
        if (client) await client.close();
    }
});

// View all employees
app.get('/viewall', async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const db = client.db("HR");
        const collection = db.collection("employees");

        const employees = await collection.find({}).toArray();
        res.json(employees);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).send("Internal server error");
    } finally {
        if (client) await client.close();
    }
});

app.listen(5001, () => {
    console.log("Server running on http://localhost:5001");
});
