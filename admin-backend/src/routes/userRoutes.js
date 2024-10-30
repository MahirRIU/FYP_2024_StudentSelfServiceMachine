const express = require('express');
const {
    addUser,
    deleteUser,
    searchUser,
    updateUser,
} = require('../controllers/userController'); // Adjust the path accordingly

const router = express.Router();

// Route to add a user
router.post('/users', addUser);

// Route to delete a user by role and ID
router.delete('/users/:role/:id', deleteUser);

// Route to search for users by name and optionally by role
router.get('/users', searchUser); // Query parameter for name and role

// Route to update a user by role and ID
router.put('/users/:role/:id', updateUser);

module.exports = router;
