const express = require('express');
const app = express();
const path = require('path');
const PORT = 5000;

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'views', 'home.html'));});

app.get('/reg', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'reg.html'));});

app.get('/ann', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'ann.html'));});

app.get('/contact', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'contact.html'));});

app.listen(PORT, () => {console.log(`Server running at http://localhost:${PORT}`);});