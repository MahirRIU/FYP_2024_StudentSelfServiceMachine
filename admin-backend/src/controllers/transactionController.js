const { MongoClient, ObjectId } = require('mongodb');
const mongoConfig = require('../config/config'); // Adjust the path accordingly

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

// Filter Transactions (Load All or Search with Filters)
const filterTransactions = async (req, res) => {
    const { trans_id, stud_id, date, amount } = req.query;

    try {
        await connectToDb();
        const collection = client.db(mongoConfig.dbName).collection('Transactions');

        // Build query based on parameters
        const query = {};
        if (trans_id) query.trans_id = trans_id;
        if (stud_id) query.stud_id = parseInt(stud_id, 10); // Convert to integer
        if (date) query.date = date;
        if (amount) query.amount = amount;

        const transactions = await collection.find(query).toArray();
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error filtering transactions:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Add a Transaction
const addTransaction = async (req, res) => {
    const { trans_id, date, time, stud_id, amount } = req.body;

    try {
        await connectToDb();
        const collection = client.db(mongoConfig.dbName).collection('Transactions');

        // Check if transaction with the same trans_id already exists
        const existingTransaction = await collection.findOne({ trans_id });
        if (existingTransaction) {
            return res.status(400).json({ message: 'Transaction ID already exists' });
        }

        const newTransaction = { trans_id, date, time, stud_id, amount };

        const result = await collection.insertOne(newTransaction);
        res.status(201).json({ message: 'Transaction added successfully', transaction: result.ops[0] });
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Delete a Transaction
const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    console.log('Deleting transaction ', id);
    try {
        await connectToDb();
        const collection = client.db(mongoConfig.dbName).collection('Transactions');

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Transaction deleted successfully' });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = {
    filterTransactions,
    addTransaction,
    deleteTransaction,
};
