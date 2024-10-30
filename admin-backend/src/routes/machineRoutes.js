const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController'); // Adjust the path as needed

// Route to filter machines
router.get('/', machineController.filterMachines);

// Route to add a machine
router.post('/', machineController.addMachine);

// Route to delete a machine by ID
router.delete('/:id', machineController.deleteMachine);

module.exports = router;
