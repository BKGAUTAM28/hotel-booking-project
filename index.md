
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static('public')); // Serve static files

// // MongoDB Connection
// mongoose.connect('mongodb+srv://bkgbrijesh2006:bkgbrijesh2006@cluster.mongodb.net/wanderlust?retryWrites=true&w=majority&tls=true');
 
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true

// // mongoose.set('strictQuery', true); // or false, depending on your preference
// const db = mongoose.connection;
// db.on('error', (err) => console.error('MongoDB connection error:', err));
// db.once('open', () => console.log('Connected to MongoDB'));

// // Booking Schema
// const bookingSchema = new mongoose.Schema({
//     name: String,
//     phone: String,
//     email: String,
//     service: String,
//     date: Date,
//     time: String,
//     barber: String,
//     notes: String,
//     status: { type: String, default: 'pending' },
//     createdAt: { type: Date, default: Date.now }
// });

// const Booking = mongoose.model('Booking', bookingSchema);

// // Booking API Routes 
// app.post('/api/bookings', async (req, res) => {
//     try {
//         const booking = new Booking(req.body);
//         await booking.save();
//         res.status(201).json({ message: 'Booking created successfully', booking });
//     } catch (error) {
//         console.error("Error creating booking:", error);
//         res.status(400).json({ error: error.message || "Bad Request" });
//     }
// });

// app.get('/api/bookings', async (req, res) => {
//     try {
//         const bookings = await Booking.find().sort({ createdAt: -1 });
//         res.json(bookings);
//     } catch (error) {
//         console.error("Error fetching bookings:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // Contact Schema
// const contactSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     subject: String,
//     message: String,
//     createdAt: { type: Date, default: Date.now }
// });

// const Contact = mongoose.model('Contact', contactSchema);

// // Contact Form API
// app.post('/api/contact', async (req, res) => {
//     try {
//         if (!req.body.name || !req.body.email || !req.body.message) {
//             return res.status(400).json({ error: "Missing required fields" });
//         }
//         const contact = new Contact(req.body);
//         await contact.save();
//         res.status(201).json({ message: 'Message sent successfully' });
//     } catch (error) {
//         console.error("Error saving contact message:", error);
//         res.status(400).json({ error: error.message || "Bad Request" });
//     }
// });

// // Newsletter Schema
// const subscriberSchema = new mongoose.Schema({
//     email: { type: String, unique: true },
//     createdAt: { type: Date, default: Date.now }
// });

// const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// //  Newsletter Subscription API
// app.post('/api/subscribe', async (req, res) => {
//     try {
//         if (!req.body.email) {
//             return res.status(400).json({ error: "Email is required" });
//         }
//         const subscriber = new Subscriber(req.body);
//         await subscriber.save();
//         res.status(201).json({ message: 'Subscribed successfully' });
//     } catch (error) {
//         console.error("Subscription error:", error);
//         if (error.code === 11000) {
//             res.status(400).json({ error: 'Email already subscribed' });
//         } else {
//             res.status(400).json({ error: error.message || "Bad Request" });
//         }
//     }
// });

// //  Admin Panel Route (Prevents JSON Parse Errors)
// app.get('/admin', async (req, res) => {
//     try {
//         const bookings = await Booking.find().sort({ date: 1 });

//         // Send HTML response (NOT JSON)
//         res.setHeader("Content-Type", "text/html");
//         res.send(`
//             <h1>Admin Panel</h1>
//             <table border="1">
//                 <tr>
//                     <th>Name</th>
//                     <th>Service</th>
//                     <th>Date</th>
//                     <th>Time</th>
//                     <th>Barber</th>
//                     <th>Status</th>
//                 </tr>
//                 ${bookings.map(booking => `
//                     <tr>
//                         <td>${booking.name}</td>
//                         <td>${booking.service}</td>
//                         <td>${new Date(booking.date).toLocaleDateString()}</td>
//                         <td>${booking.time}</td>
//                         <td>${booking.barber || 'Any'}</td>
//                         <td>${booking.status}</td>
//                     </tr>
//                 `).join('')}
//             </table>
//         `);
//     } catch (error) {
//         console.error("Error loading admin panel:", error);
//         res.status(500).send("Error loading admin panel");
//     }
// });

// // Catch-All 404 Route (Prevents Empty Responses)
// app.use((req, res) => {
//     res.status(404).json({ error: "Route Not Found" });
// });

// // Start server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });



// server 2

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Use built-in Express JSON parser
app.use(express.static('public')); // Serve static files

// Fix Mongoose strictQuery deprecation warning
mongoose.set('strictQuery', true);

// MongoDB Connection with Error Handling
(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wanderlust', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
})();

// Booking Schema
const bookingSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    service: String,
    date: Date,
    time: String,
    barber: String,
    notes: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

bookingSchema.index({ email: 1, date: 1, time: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

// Booking API Routes 
// app.post('/api/bookings', async (req, res) => {
//     try {
//         const booking = new Booking(req.body);
//         await booking.save();
//         res.status(201).json({ message: 'Booking created successfully', booking });
//     } catch (error) {
//         console.error("Error creating booking:", error);
//         res.status(400).json({ error: error.message || "Bad Request" });
//     }
// });
app.post('/api/bookings', async (req, res) => {
    try {
        console.log("Incoming booking request:", req.body); // Log incoming data

        const { name, phone, email, service, date, time, barber, notes } = req.body;
        
        if (!name || !phone || !email || !service || !date || !time) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const booking = new Booking({ name, phone, email, service, date: new Date(date), time, barber, notes });
        await booking.save();
        
        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(400).json({ error: error.message || "Bad Request" });
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

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

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

// Admin Panel Route (Prevents JSON Parse Errors)
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
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
