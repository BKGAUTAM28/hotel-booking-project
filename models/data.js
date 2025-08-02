const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    barber: { type: String },
    notes: { type: String }
});

// Create a compound index to prevent duplicate bookings for same email + date + time
bookingSchema.index({ email: 1, date: 1, time: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;


