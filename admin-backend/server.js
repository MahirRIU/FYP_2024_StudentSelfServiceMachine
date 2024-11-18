const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
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

// Combined Login route for Admins, Students, and DeptMembers
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Trim the input values
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
        console.log("Login attempt received");
        await client.connect();
        const database = client.db(mongoConfig.dbName);

        console.log(`Login attempt: ${trimmedUsername}`);

        // Check collections for Admins, Students, and DeptMembers
        const collectionsToCheck = [
            { name: 'Admins', key: 'name', role: 'admin' },
            { name: 'Students', key: 'email', role: 'student' },
            { name: 'DeptMembers', key: 'email', role: 'deptMember' },
        ];

        for (const { name, key, role } of collectionsToCheck) {
            const collection = database.collection(name);
            const query = { [key]: { $regex: new RegExp(`^${trimmedUsername}$`, 'i') } };

            const user = await collection.findOne(query);

            if (user && user.password === trimmedPassword) {
                console.log(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful`);

                const response = {
                    message: `${role.charAt(0).toUpperCase() + role.slice(1)} Login Successful!`,
                    user: { ...user, role }, // Include the user's role in the response
                };

                return res.status(200).json(response);
            }
        }

        // If no match found in any collection
        console.log('Invalid username or password');
        res.status(401).json({ message: 'Invalid username or password' });
    } catch (err) {
        console.error('Error occurred during login:', err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    } finally {
        await client.close();
    }
});

// Use user routes
app.use('/api', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/machines', machineRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
