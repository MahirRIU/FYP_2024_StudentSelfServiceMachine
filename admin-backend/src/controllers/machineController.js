const { MongoClient, ObjectId } = require('mongodb');
const mongoConfig = require('../config/config'); // Adjust the path as needed

const client = new MongoClient(mongoConfig.uri);

// Connect to MongoDB
const connectToDb = async () => {
    try {
        await client.connect();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

// Filter Machines (Load All or Search with Filters)
const filterMachines = async (req, res) => {
    const { machine_id, location } = req.query;

    try {
        await connectToDb();
        const collection = client.db(mongoConfig.dbName).collection('Machines');

        // Build query based on parameters
        const query = {};
        if (machine_id) query.machine_id = machine_id;
        if (location) query.location = location;

        const machines = await collection.find(query).toArray();
        console.log("machines", machines);
        res.status(200).json(machines);
    } catch (error) {
        console.error('Error filtering machines:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Add a Machine
// Add a Machine
const addMachine = async (req, res) => {
    const { location } = req.body; // Get the location from the request body

    try {
        await connectToDb();
        const collection = client.db(mongoConfig.dbName).collection('Machines');

        // Create the new machine object without machine_id
        const newMachine = { location };

        // Insert the new machine into the collection
        const result = await collection.insertOne(newMachine);
        
        // Get the ID of the newly created document
        const insertedId = result.insertedId;
        console.log("Inserted ID:", insertedId);

        // Update the newMachine object with machine_id as a string
        newMachine.machine_id = insertedId.toString(); // Convert ObjectId to string

        // Update the machine record with the machine_id
        await collection.updateOne(
            { _id: insertedId },
            { $set: { machine_id: newMachine.machine_id } }
        );

        // Respond with success and the new machine data, including the MongoDB Object ID
        res.status(201).json({ 
            message: 'Machine added successfully', 
            machine: { _id: insertedId, ...newMachine } // Include the MongoDB Object ID
        });
    } catch (error) {
        console.error('Error adding machine:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};



// Delete a Machine
const deleteMachine = async (req, res) => {
    const { id } = req.params;

    try {
        await connectToDb();
        const collection = client.db(mongoConfig.dbName).collection('Machines');

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Machine deleted successfully' });
        } else {
            res.status(404).json({ message: 'Machine not found' });
        }
    } catch (error) {
        console.error('Error deleting machine:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = {
    filterMachines,
    addMachine,
    deleteMachine,
};
