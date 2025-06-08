const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const uri = "mongodb://127.0.0.1:27017";
const dbName = "exam";

app.use(express.urlencoded({ extended: true }));

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Add student marks
app.post('/add-student', async (req, res) => {
    const { name, usn, subject, marks } = req.body;

    if (!name || !usn || !subject || !marks) {
        return res.send("All fields are required.");
    }

    const score = Number(marks);
    let client;

    try {
        client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const db = client.db(dbName);
        const collection = db.collection("students");

        await collection.insertOne({ name, usn, subject, marks: score });

        res.send(`<h3>Record Added</h3><a href="/">Add Another</a> | <a href="/not-eligible">Not Eligible List</a>`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding student");
    } finally {
        if (client) await client.close();
    }
});

// Display students with marks < 20
app.get('/not-eligible', async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const db = client.db(dbName);
        const collection = db.collection("students");

        const students = await collection.find({ marks: { $lt: 20 } }).toArray();

        let html = `<h2>Not Eligible Students (Marks < 20)</h2><ul>`;
        students.forEach(s => {
            html += `<li>${s.name} (${s.usn}) - ${s.subject}: ${s.marks}</li>`;
        });
        html += `</ul><br><a href="/">Go Back</a>`;

        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching list");
    } finally {
        if (client) await client.close();
    }
});

app.listen(5000, () => {
    console.log("Server started on http://localhost:5000");
});
