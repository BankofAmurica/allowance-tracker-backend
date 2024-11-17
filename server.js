const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define a schema for children data
const childSchema = new mongoose.Schema({
    name: String,
    allowance: Number,
    savings: Number,
    recurring: {
        allowance: { day: String, amount: Number },
        savings: { day: String, amount: Number },
    },
    history: [String],
});

// Create a model
const Child = mongoose.model('Child', childSchema);

// API routes
app.get('/children', async (req, res) => {
    const children = await Child.find();
    res.json(children);
});

app.post('/children', async (req, res) => {
    const child = new Child(req.body);
    await child.save();
    res.status(201).json(child);
});

app.put('/children/:id', async (req, res) => {
    const { id } = req.params;
    const updatedChild = await Child.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedChild);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

