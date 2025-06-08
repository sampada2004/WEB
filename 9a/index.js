// index.js
const express = require('express');
const app = express();
const port = 3001;

// Middleware to serve static files (optional for CSS/images later)
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.send(`
    <h1>🏠 Home</h1>
    <p>Welcome to our Online Training Platform.</p>
    <nav>
      <a href="/register">Register</a> |
      <a href="/announcements">Announcements</a> |
      <a href="/contact">Contact</a>
    </nav>
  `);
});

app.get('/register', (req, res) => {
  res.send(`
    <h1>📝 Registration</h1>
    <p>Please fill in your details to register for the training.</p>
    <nav>
      <a href="/">Home</a> |
      <a href="/announcements">Announcements</a> |
      <a href="/contact">Contact</a>
    </nav>
  `);
});

app.get('/announcements', (req, res) => {
  res.send(`
    <h1>📢 Announcements</h1>
    <p>Stay up to date with the latest training news.</p>
    <nav>
      <a href="/">Home</a> |
      <a href="/register">Register</a> |
      <a href="/contact">Contact</a>
    </nav>
  `);
});

app.get('/contact', (req, res) => {
  res.send(`
    <h1>📬 Contact</h1>
    <p>Email us at training@example.com</p>
    <nav>
      <a href="/">Home</a> |
      <a href="/register">Register</a> |
      <a href="/announcements">Announcements</a>
    </nav>
  `);
});

app.listen(port, () => {
  console.log(`🚀 Training site running at http://localhost:${port}`);
});
