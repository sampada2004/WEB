const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const uri = "mongodb://127.0.0.1:27017";
const dbName = "attendanceDB";

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/add-student', async (req, res) => {
    const { name, usn, dept, total, attended } = req.body;

    if (!name || !usn || !dept || !total || !attended) {
        return res.send("All fields are required.");
    }

    const totalClasses = Number(total);
    const attendedClasses = Number(attended);
    const attendancePercent = (attendedClasses / totalClasses) * 100;

    let client;
    try {
        client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const db = client.db(dbName);
        const collection = db.collection('students');

        await collection.insertOne({ name, usn, dept, totalClasses, attendedClasses, attendancePercent });

        res.send(`<h3>Student added</h3><a href="/">Add Another</a> | <a href="/low-attendance">View Low Attendance</a>`);
    } catch (err) {
        console.error("Insert error:", err);
        res.status(500).send("Server error");
    } finally {
        if (client) client.close();
    }
});

app.get('/low-attendance', async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const db = client.db(dbName);
        const collection = db.collection('students');

        const lowAttendance = await collection.find({ attendancePercent: { $lt: 75 } }).toArray();

        let html = `<h2>Students with Attendance below 75%</h2><ul>`;
        lowAttendance.forEach(s => {
            html += `<li>${s.name} (${s.usn}) - ${s.attendancePercent.toFixed(2)}%</li>`;
        });
        html += `</ul><a href="/">Back to Home</a>`;
        res.send(html);
    } catch (err) {
        console.error("Fetch error:", err);
        res.status(500).send("Server error");
    } finally {
        if (client) client.close();
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
