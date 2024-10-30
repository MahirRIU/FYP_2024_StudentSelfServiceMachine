const { MongoClient, ObjectId } = require('mongodb');
const mongoConfig = require('../config/config'); // Adjust the path accordingly

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


// Add User
const addUser = async (req, res) => {
    // Destructure common fields from the request body
    const {
        name,
        email,
        password,
        role,
        ph_no,            // Phone number of the student
        program,          // Program the student is enrolled in
        dept_name,        // Department name of the student
        enrollment_status  // Enrollment status of the student
    } = req.body;

    try {
        await connectToDb();

        // Set the collection name based on the role
        const collection = getCollection(role); // Get the appropriate collection based on role

        console.log("role =", role, "collectionName =", collection.collectionName); // Log the role and collection for debugging

        // Check if a user with the same email already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create the new user object
        const newUser = { 
            name, 
            email, 
            password, 
            role,
            dept_name
        };
        newUser.name = name;
        newUser.email = email;
        newUser.password = password;
        newUser.role = role;
        newUser.dept_name = dept_name;

        // Add specific fields based on role
        if (role === 'student') {
            newUser.ph_no = ph_no;            // Add phone number
            newUser.program = program;         // Add program
            newUser.enrollment_status = enrollment_status; // Set to 'Enrolled'
        }

        console.log("User data before insertion:", newUser);

        // Insert the new user into the database
        const result = await collection.insertOne(newUser);
        
        // Get the ID of the newly created document
        const insertedId = result.insertedId;
        console.log("Inserted ID:", insertedId);

        // Update the newUser object with stud_id if the role is 'student'
        if (role === 'student') {
            await collection.updateOne(
                { _id: insertedId },
                { $set: { stud_id: insertedId.toString() } }
            );
            newUser.stud_id = insertedId.toString(); // Add stud_id to the newUser object
        }
        else{
            await collection.updateOne(
                { _id: insertedId },
                { $set: { dept_mem_id: insertedId.toString() } }
            );
            newUser.stud_id = insertedId.toString(); // Add stud_id to the newUser object

        }

        // Construct the response user object
        res.status(201).json({ message: 'User added successfully', user: newUser }); 
        console.log("User added successfully", newUser);
    } catch (error) {
        console.error('Error adding user:', error);
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

module.exports = {
    addUser,
    deleteUser,
    searchUser,
    updateUser,
};
