# 💇‍♂️ Hairstyle Salon Booking System

A full-stack web application designed for managing appointments in a hairstyle salon. It includes features for users to book appointments, and for admins to manage them. The system also integrates face shape recognition using the webcam to suggest suitable hairstyles.

---

## 🛠️ Features

### 🧑‍💼 For Customers:
- 📅 Book haircut appointments online
- 📷 Face detection using camera (WebRTC)
- 📱 Responsive design for mobile & desktop

### 🛠️ For Admin:
- 🔐 Secure admin login
- 📝 View and manage all bookings
- 🧾 Booking history and customer details
- 🗑️ Cancel or delete bookings

---

## 📦 Tech Stack

### Frontend:
- HTML5, CSS3, JavaScript
- Bootstrap (optional)
- WebRTC API for camera access

### Backend:
- Node.js
- Express.js

### Database:
- File-based JSON storage *(or MongoDB if used)*

---

## 📸 Face Shape Recognition (Optional Feature)

This feature uses the device camera to detect the user's face and determine their **face shape** using basic geometry or AI (if implemented), then provides hairstyle suggestions accordingly.

---

## 🚀 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/hairstyle-salon-system.git
   cd hairstyle-salon-system
