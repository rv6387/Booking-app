const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Schema
const BookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true }
});

const Booking = mongoose.model("Booking", BookingSchema);

// Booking Route
app.post('/book', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();

        res.send("Booking Saved Successfully");
    } catch (err) {
        console.log("SAVE ERROR:", err);
        res.status(500).send("Error saving booking");
    }
});


// IMPORTANT FIX — connect first, then listen
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");

        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running");
        });
    })
    .catch(err => console.log("MongoDB Error:", err));
