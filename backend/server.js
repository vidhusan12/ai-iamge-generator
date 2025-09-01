const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Test route
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});