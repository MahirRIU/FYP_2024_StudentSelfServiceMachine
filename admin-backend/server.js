const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const mongoConfig = require('./src/config/config'); // Adjust the path to the config file
const userRoutes = require('./src/routes/userRoutes'); // Import the user routes
const transactionRoutes = require('./src/routes/transactionRoutes');
const machineRoutes = require('./src/routes/machineRoutes'); // Adjust path as necessary

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    console.log('Request Body:', req.body);
    next();
});

// MongoDB configuration
const client = new MongoClient(mongoConfig.uri);

// Login route
app.get('/admins', async (req, res) => {
    try {
        // Connect to the MongoDB database
        await client.connect();
        const database = client.db(mongoConfig.dbName);
        const collection = database.collection('Admins'); // 'Admins' collection

        // Find all documents in the 'Admins' collection
        const admins = await collection.find().toArray();

        // Log the admins fetched
        console.log('Fetched Admins:', admins);

        // Send the result as a response
        res.status(200).json(admins);
    } catch (err) {
        console.error('Error occurred while fetching admins:', err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    } finally {
        await client.close(); // Close the MongoDB connection
    }
});

app.post('/login', async (req, res) => {
    let { username, password } = req.body;

    // Trim the input values
    username = username.trim();
    password = password.trim();

    try {
        // Connect to the MongoDB database
        console.log("Packet received");
        await client.connect();
        const database = client.db(mongoConfig.dbName);
        const collection = database.collection('Admins'); // Use the 'Admins' collection

        // Log the received credentials
        console.log('Received login attempt:', { username, password });

        // Find the admin from the database (case-insensitive search by 'name', not 'username')
        const admin = await collection.findOne({ name: { $regex: new RegExp(`^${username}$`, 'i') } });

        console.log('Admin found in database:', admin); // Log admin details or null

        if (admin) {
            console.log(`Password in database: ${admin.password}, Password provided: ${password}`);
            // Check if the password matches
            if (admin.password === password) {
                console.log('Login successful');
                const response = { 
                    message: 'Login Successful!', 
                    admin: { name: admin.name }  // Return admin's name in the response
                };
                console.log('Response:', response); // Log response before sending
                res.status(200).json(response);
            } else {
                console.log('Invalid password');
                const response = { message: 'Invalid username or password' };
                console.log('Response:', response); // Log response before sending
                res.status(401).json(response);
            }
        } else {
            console.log('Invalid username');
            const response = { message: 'Invalid username or password' };
            console.log('Response:', response); // Log response before sending
            res.status(401).json(response);
        }
    } catch (err) {
        console.error('Error occurred during login:', err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    } finally {
        await client.close(); // Close the MongoDB connection
    }
});

// Use user routes
app.use('/api', userRoutes); // All user-related routes will be prefixed with /api
// Use transaction routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/machines', machineRoutes);


// Start the server
const PORT = 5000; // Fixed port number
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
