const express = require('express');
const router = express.Router();
const {
    filterTransactions,
    addTransaction,
    deleteTransaction,
} = require('../controllers/transactionController'); // Adjust the path accordingly

// Route to load all or filter transactions (query parameters: trans_id, stud_id, date, amount)
router.get('/', filterTransactions);

// Route to add a new transaction
router.post('/', addTransaction);

// Route to delete a transaction by ID
router.delete('/:id', deleteTransaction);

module.exports = router;
