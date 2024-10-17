const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/sssm', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Define the Admin schema
const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
});

// Explicitly specify collection name as 'admin_login'
const Admin = mongoose.model('Admin', adminSchema, 'admin_login');
const trimmedUsername = username.trim();
const trimmedPassword = password.trim();


// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Log the received credentials
        console.log('Received login attempt:', { username, password });

        // Find the admin by username (case-insensitive)
        const admin = await Admin.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        console.log('Admin found in database:', admin);  // Log admin found or null

        if (admin) {
            console.log(`Password in DB: ${admin.password}, Password provided: ${password}`);
            // Check if the password matches
            if (admin.password === password) {
                console.log('Login successful');
                res.status(200).json({ message: 'Login Successful!' });
            } else {
                console.log('Invalid password');
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } else {
            console.log('Invalid username');
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Error occurred during login:', err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});
