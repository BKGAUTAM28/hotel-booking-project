require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Booking = require("./models/data.js");
const path = require("path");
const bodyParser = require('body-parser');


// Middleware
app.use(cors());
app.use(express.json()); // Use built-in Express JSON parser
// app.use(express.static('public')); // Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Fix Mongoose strictQuery deprecation warning
mongoose.set('strictQuery', true);

const MONGO_URI = "mongodb://127.0.0.1:27017/HairArtistry";
main()
.then((err) =>{
    console.log("connected to DB");
    })
    .catch((err) =>{
        console.log(err);        
    });
async function main (){
    await mongoose.connect(MONGO_URI);
}

app.get("/", (req, res)=>{
    res.send("hi, i am root");
});

// Route to handle bookings
app.post('/api/booking', async (req, res) => {
    const { name, phone, email, service, date, time, barber, notes } = req.body;

    // Server-side validation
    if (!name || !phone || !email || !service || !date || !time) {
        return res.status(400).json({ message: "All required fields must be filled!" });
    }

    try {
        const newBooking = new Booking({
            name,
            phone,
            email,
            service,
            date,
            time,
            barber,
            notes
        });

        await newBooking.save();

        res.status(201).json({ message: "Your booking has been confirmed!" });

    } catch (error) {
        if (error.code === 11000) {  // Duplicate key error
            res.status(409).json({ message: "You have already booked this slot!" });
        } else {
            console.error("Booking error:", error);
            res.status(500).json({ message: "Server error while booking." });
        }
    }
});


app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Contact Form API
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error("Error saving contact message:", error);
        res.status(400).json({ error: error.message || "Bad Request" });
    }
});

// Newsletter Schema
const subscriberSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Email Validation Function
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Newsletter Subscription API
app.post('/api/subscribe', async (req, res) => {
    try {
         const { email } = req.body;
        if (!email || !validateEmail(email)) {
            return res.status(400).json({ error: "Invalid email address" });
        }
        const subscriber = new Subscriber({ email });
        await subscriber.save();
        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error("Subscription error:", error);
        if (error.code === 11000) {
            res.status(400).json({ error: 'Email already subscribed' });
        } else {
            res.status(400).json({ error: error.message || "Bad Request" });
        }
    }
});

// Admin Panel Route
app.get('/admin', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ date: 1 });

        res.setHeader("Content-Type", "text/html");
        res.send(`
            <h1>Admin Panel</h1>
            <table border="1">
                <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Barber</th>
                    <th>Status</th>
                </tr>
                ${bookings.map(booking => `
                    <tr>
                        <td>${booking.name}</td>
                        <td>${booking.service}</td>
                        <td>${new Date(booking.date).toLocaleDateString()}</td>
                        <td>${booking.time}</td>
                        <td>${booking.barber || 'Any'}</td>
                        <td>${booking.status}</td>
                    </tr>
                `).join('')}
            </table>
        `);
    } catch (error) {
        console.error("Error loading admin panel:", error);
        res.status(500).send("Error loading admin panel");
    }
});

// Catch-All 404 Route
app.use((req, res) => {
    res.status(404).json({ error: "Route Not Found" });
});



// Start Server
app.listen(8080, () => {
    console.log("Server running on port 8080");
});
