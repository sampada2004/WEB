const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname)); // Serve static files from current directory

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'p8.html')); // Serve your HTML
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
