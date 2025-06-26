const express = require('express');
const app = express();
const path = require('path');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/add', async (req, res) => {
    const { hid, name, loc, tb, ob } = req.query;
    if (!hid || !name || !loc || !tb || !ob) {
        return res.send("invalid");
    }

    let client;
    try {
        client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const db = client.db("hospital");
        const collection = db.collection("details");

        await collection.insertOne({
            hid,
            name,
            loc,
            tb: parseInt(tb),
            ob: parseInt(ob)
        });

        res.send("success");
    } catch (err) {
        console.log("error", err);
        res.status(500).send("Internal error");
    } finally {
        if (client) await client.close();
    }
});

app.get('/display', async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const db = client.db("hospital");
        const collection = db.collection("details");

        const hospitals = await collection.find({
            $expr: { $lt: [{ $subtract: ["$tb", "$ob"] }, 10] }
        }).toArray();

        res.json(hospitals);
    } catch (err) {
        console.log("error", err);
        res.status(500).send("Internal error");
    } finally {
        if (client) await client.close();
    }
});

app.post('/admit', async (req, res) => {
    const { hid } = req.body;
    if (!hid) return res.send("Hospital ID is required");

    let client;
    try {
        client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const db = client.db("hospital");
        const collection = db.collection("details");

        const result = await collection.updateOne({ hid }, { $inc: { ob: 1 } });

        if (result.modifiedCount === 0) {
            res.status(404).send("Hospital not found");
        } else {
            res.send("Patient admitted");
        }
    } catch (err) {
        console.log("error", err);
        res.status(500).send("Internal error");
    } finally {
        if (client) await client.close();
    }
});

app.get('/viewall', async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const db = client.db("hospital");
        const collection = db.collection("details");

        const hospitals = await collection.find({}).toArray();
        res.json(hospitals); // You can replace this with an HTML table if needed
    } catch (err) {
        console.error("error", err);
        res.status(500).send("Internal error");
    } finally {
        if (client) await client.close();
    }
});

app.listen(5001,()=>{
    console.log("5001");
})