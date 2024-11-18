const { MongoClient, ObjectId } = require('mongodb');
const mongoConfig = require('../config/config'); // Adjust the path accordingly
const { PDFDocument, StandardFonts } = require('pdf-lib');
const fs = require('fs');

const client = new MongoClient(mongoConfig.uri);

// Connect to MongoDB
const connectToDb = async () => {
    try {
        await client.connect();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
};
function getRandomInt(min, max) {
    // Ensure min and max are inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  

// Add User
const addUser = async (req, res) => {
    const {
        name,
        email,
        password,
        role,
        ph_no,
        program,
        dept_name,
        enrollment_status,
        faculty,
    } = req.body;

    try {
        await connectToDb();

        const collection = getCollection(role);

        console.log("role =", role, "collectionName =", collection.collectionName);

        // Check if a user with the same email already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Initialize the new user object
        const newUser = {
            name,
            email,
            password,
            role,
            dept_name,
            faculty,
        };

        // Add default values only for students
        if (role === 'student') {
            const defaultValues = {
                fee_dept_status: false,
                semester_completion: "In Progress",
                earned_credits: 0,
                sap_id: getRandomInt(1000, 10000),
                required_credits: 120,
                cgpa: 0.0,
                course_completion_status: "Not started",
                transcript_applied: false,
                coordination_dept_status: false,
                graduation_status: "Not eligible",
                result_status: "Pending",
                exam_clearance_status: "Not Cleared",
                exam_dept_status: false,
                books_borrowed: 0,
                fine_amount: 0,
                library_dept_status: false,
                enrollment_status: enrollment_status || "Not Enrolled",
                ssd_dept_status: false,
                comments: [],
                balance: 10000,
                clearanceApplied: false,
                books_returned: 0,
                library_dept_comment: "",
                remaining_fee: 0,
                total_fee: 0,
                exam_dept_comment: "",
                fee_dept_comment: "",
                ssd_dept_comment: "",
                coordination_dept_comment: "",
                faculty: faculty || "Unknown",
            };

            newUser.ph_no = ph_no || ""; // Set default phone number if not provided
            newUser.program = program || "Undeclared"; // Set default program if not provided
            Object.assign(newUser, defaultValues); // Add default values for students
        }

        console.log("User data before insertion:", newUser);

        // Insert the new user into the database
        const result = await collection.insertOne(newUser);

        const insertedId = result.insertedId;
        console.log("Inserted ID:", insertedId);

        // Update the newUser object with `stud_id` or `dept_mem_id`
        if (role === 'student') {
            await collection.updateOne(
                { _id: insertedId },
                { $set: { stud_id: insertedId.toString() } }
            );
            newUser.stud_id = insertedId.toString();
        } else {
            await collection.updateOne(
                { _id: insertedId },
                { $set: { dept_mem_id: insertedId.toString() } }
            );
            newUser.dept_mem_id = insertedId.toString();
        }

        res.status(201).json({ message: 'User added successfully', user: newUser });
        console.log("User added successfully", newUser);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};



const applyTranscript = async (req, res) => {
    const { id } = req.params;

    try {
        await connectToDb();
        const collection = client.db(mongoConfig.dbName).collection('Students');
        console.log("id: ",id);
        // Fetch the student
        const student = await collection.findOne({ _id: new ObjectId(id) });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (student.transcript_applied) {
            return res.status(400).json({ message: 'You have already applied for the transcript.' });
        }

        // Update the transcript_applied field
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: { transcript_applied: true } });

        // Generate a PDF
        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();
        const fontSize = 12;

        page.drawText(`Student Transcript`, {
            x: 50,
            y: height - 50,
            size: 18,
            font: timesRomanFont,
        });

        page.drawText(`Name: ${student.name}`, { x: 50, y: height - 100, size: fontSize });
        page.drawText(`Email: ${student.email}`, { x: 50, y: height - 120, size: fontSize });
        page.drawText(`Program: ${student.program}`, { x: 50, y: height - 140, size: fontSize });
        page.drawText(`SAP ID: ${student.sap_id}`, { x: 50, y: height - 160, size: fontSize });

        // Serialize the PDF to bytes
        const pdfBytes = await pdfDoc.save();

        // Send the PDF to the client
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=transcript.pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('Error applying for transcript:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};





// Delete User
const deleteUser = async (req, res) => {
    const { id, role } = req.params; // Get id and role from request parameters
    const collection = getCollection(role); // Get the appropriate collection based on role

    try {
        await connectToDb();
        // Ensure you're using the role-specific collection
        const result = await collection.deleteOne({ _id: new ObjectId(id) }); // Use 'new ObjectId(id)'

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};



// Search User
const searchUser = async (req, res) => {
    console.log('In search user');
    const { name, role } = req.query; // Assuming search by name and role

    try {
        await connectToDb();
        const collection = getCollection(role); // Get the appropriate collection based on role


        // Create a query object
        const query = {};
        
        // If a role is provided, filter by role
        if (role) {
            query.role = role; // Search by role
            console.log("role is ",role);
        }

        // If a name is provided, add to the query
        if (name) {
            query.name = { $regex: new RegExp(name, 'i') }; // Search by name using regex
        }

        // Fetch users based on the constructed query
        const users = await collection.find(query).toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error searching user:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
const fetchClearanceStudents = async (req, res) => {
    try {
      await client.connect();
      const db = client.db(mongoConfig.dbName);
      const collection = db.collection('Students'); // Assuming collection name is 'Students'
  
      // Query for students with clearanceApplied = true
      const students = await collection.find({ clearanceApplied: true }).toArray();
  
      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching clearance students:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };
  
// Update User
const updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    console.log("id:", id);
    console.log("user to update:", updates);

    // Remove _id from updates if it exists
    delete updates._id;

    try {
        await connectToDb();
        const collection = getCollection(updates.role); // Get the appropriate collection based on role
        

        // Check if the user exists before updating
        const existingUser = await collection.findOne({ _id: new ObjectId(id) });
        console.log("Existing user:", existingUser); // Log existing user

        if (!existingUser) {
            res.status(404).json({ message: 'User not found' });
            console.log("User not found with the given ID");
            return;
        }

        // Perform the update
        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
        console.log("Update result:", result);

        if (result.matchedCount === 1) {
            res.status(200).json({ message: 'User updated successfully' });
            console.log("User updated successfully");
        } else {
            res.status(404).json({ message: 'User not found during update' });
            console.log("User not found during update");
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


// Helper function to get the appropriate collection
const getCollection = (role) => {
    if (role === 'deptMember') {
        return client.db(mongoConfig.dbName).collection('DeptMembers');
    } else if (role === 'student') {
        return client.db(mongoConfig.dbName).collection('Students');
    }
    throw new Error('Invalid role');
};
const modifyStudentBalance = async (req, res) => {
    const { id } = req.params; // Student ID
    const { action, amount } = req.body; // Action can be 'get', 'add', or 'subtract'
    console.log("inside modify student");
    try {
        await connectToDb();
        const collection = getCollection('student'); // Get the Students collection

        // Fetch the student's current balance
        const student = await collection.findOne({ _id: new ObjectId(id) });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        let updatedBalance = student.balance || 0; // Default balance to 0 if not found

        // Perform the requested operation
        if (action === 'get') {
            // Simply return the current balance
            return res.status(200).json({ balance: updatedBalance });
        } else if (action === 'add') {
            updatedBalance += amount;
        } else if (action === 'subtract') {
            updatedBalance -= amount;
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        // Update the student's balance in the database
        await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { balance: updatedBalance } }
        );

        // Return the updated balance
        res.status(200).json({ balance: updatedBalance });
    } catch (error) {
        console.error('Error modifying student balance:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
const applyClearance = async (req, res) => {
    const { id, registrationNo, amount } = req.body; // Use `id` for MongoDB _id

    try {
        await connectToDb();
        const collection = getCollection('student');

        // Find the user by MongoDB _id
        const user = await collection.findOne({ _id: new ObjectId(id) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has sufficient balance
        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance to apply for clearance' });
        }

        // Deduct the amount and update the clearance status
        const updatedBalance = user.balance - amount;
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: {
                    balance: updatedBalance,
                    clearanceApplied: true,
                    registrationNo: registrationNo 
                }
            }
        );

        if (updateResult.modifiedCount === 1) {
            res.status(200).json({ message: 'Clearance form applied successfully', newBalance: updatedBalance });
        } else {
            res.status(500).json({ message: 'Failed to apply clearance form. Please try again later.' });
        }
    } catch (error) {
        console.error('Error applying for clearance:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Update Student Status Function
const updateStudentStatus = async (req, res) => {
    const { studentId } = req.params; // Get the student ID from the URL
    const { statusField, commentField, newStatus, comment } = req.body; // Data from the request body

    // Allowed status and comment fields for departments
    const allowedFields = [
        'library_dept_status',
        'library_dept_comment',
        'coordination_dept_status',
        'coordination_dept_comment',
        'exam_dept_status',
        'exam_dept_comment',
        'fee_dept_status',
        'fee_dept_comment',
        'ssd_dept_status',
        'ssd_dept_comment',
    ];

    try {
        console.log('Received parameters:', { studentId, statusField, commentField, newStatus, comment });

        // Get the Students collection using the shared logic
        const collection = getCollection('student');
        console.log('Connected to the collection: student');

        // Validate student ID
        if (!ObjectId.isValid(studentId)) {
            console.error('Invalid student ID:', studentId);
            return res.status(400).json({ message: 'Invalid student ID' });
        }
        console.log('Validated student ID:', studentId);

        // Validate the statusField and commentField
        if (!allowedFields.includes(statusField) || !allowedFields.includes(commentField)) {
            console.error('Invalid status or comment field:', { statusField, commentField });
            return res.status(400).json({ message: 'Invalid status or comment field' });
        }
        console.log('Validated fields:', { statusField, commentField });

        // Update the student's status and comment
        console.log('Attempting to update student record:', {
            studentId,
            updates: { [statusField]: newStatus, [commentField]: comment },
        });
        const result = await collection.updateOne(
            { _id: new ObjectId(studentId) },
            { $set: { [statusField]: newStatus, [commentField]: comment } }
        );

        console.log('Update result:', result);

        if (result.modifiedCount === 1) {
            console.log('Student status updated successfully');
            res.status(200).json({ message: 'Student status updated successfully' });
        } else {
            console.warn('Student not found or no changes made:', studentId);
            res.status(404).json({ message: 'Student not found or no changes made' });
        }
    } catch (error) {
        console.error('Error updating student status:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

  
  
module.exports = {
    addUser,
    deleteUser,
    searchUser,
    updateUser,
    modifyStudentBalance,
    applyClearance,
    fetchClearanceStudents,
    updateStudentStatus,
    applyTranscript
};
