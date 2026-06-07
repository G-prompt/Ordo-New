const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Test API Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: "Server is healthy" });
});

// AI Endpoint placeholder
app.post('/api/ai', (req, res) => {
    res.json({ message: "AI endpoint working" });
});

module.exports = app;
