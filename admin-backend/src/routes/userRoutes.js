const express = require('express');
const {
    addUser,
    deleteUser,
    searchUser,
    updateUser,
    modifyStudentBalance,
    applyClearance,
    fetchClearanceStudents,
    updateStudentStatus
} = require('../controllers/userController'); // Adjust the path accordingly

const router = express.Router();

// Route to add a user
router.post('/users', addUser);
router.post('/users/students/:id/balance',modifyStudentBalance)
// Route to delete a user by role and ID
router.delete('/users/:role/:id', deleteUser);
router.post('/users/students/apply-clearance', applyClearance);

// Route to search for users by name and optionally by role
router.get('/users', searchUser); // Query parameter for name and role

// Route to update a user by role and ID
router.put('/users/:role/:id', updateUser);
router.get('/users/clearance-students', fetchClearanceStudents);
router.patch('/users/update-student-status/:studentId', updateStudentStatus);

module.exports = router;
