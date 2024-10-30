import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Navbar, Dropdown } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaFilter } from "react-icons/fa";

import "./StudentsPage.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import FontAwesome for icons
import "bootstrap/dist/css/bootstrap.min.css";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("student"); // Default role
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ph_no, setPhNo] = useState(""); // Phone number state
  const [program, setProgram] = useState(""); // Program state
  const [dept_name, setDeptName] = useState(""); // Department name state
  const [enrollment_status, setEnrollmentStatus] = useState(""); // Enrollment status state
  const [studentId, setStudentId] = useState(""); // Student ID state

  // Function to fetch students from the backend
  const fetchStudents = async () => {
    try {
      console.log(`Fetching students with role: ${roleFilter}`); // Debug log
      const response = await fetch(
        `http://localhost:5000/api/users?role=${roleFilter}`
      );
      if (!response.ok) {
        console.error("Failed to fetch students:", response.statusText); // Debug log
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      console.log("Fetched students:", data); // Debug log
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  const [filterType, setFilterType] = useState("Select Filter");

  useEffect(() => {
    fetchStudents(); // Fetch students when the component mounts
  }, [roleFilter]); // Re-fetch when roleFilter changes

  const handleFilterChange = (eventKey) => {
    setFilterType(eventKey);
  };
  const handleShowModal = (index = null) => {
    setEditIndex(index);
    if (index !== null) {
      // Editing mode: populate fields with existing student data
      const student = students[index];
      console.log("Selected Student Details:", student);
      setName(student.name);
      setEmail(student.email);
      setPassword(""); // Leave password empty for security
      setPhNo(student.ph_no);
      setProgram(student.program);
      setDeptName(student.dept_name);
      setEnrollmentStatus(student.enrollment_status);
      setStudentId(student.stud_id); // Set the student ID for editing
    } else {
      // Adding mode: clear the fields
      setName("");
      setEmail("");
      setPassword("");
      setPhNo("");
      setProgram("");
      setDeptName("");
      setEnrollmentStatus("");
      setStudentId(""); // Clear student ID
    }
    setShowModal(true);
  };

  const handleAddOrUpdate = async () => {
    // If in add mode, validate all required fields
    if (editIndex === null) { // Only validate for adding a student
        if (name === "" || email === "" || password === "" || ph_no === "" || program === "" || dept_name === "" || enrollment_status === "") {
            alert("Please fill out all fields");
            return;
        }
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
        alert("Please enter a valid email address");
        return;
    }

    // Validate phone number (optional: customize as per your requirement)
    const phonePattern = /^\d{10}$/; // Assuming 10-digit phone numbers
    if (ph_no && !phonePattern.test(ph_no)) {
        alert("Please enter a valid phone number (10 digits)");
        return;
    }

    if (editIndex !== null) {
        // Edit mode: Update the student
        const updatedStudent = {
            ...students[editIndex],
            name,
            email,
            password: password !== "" ? password : students[editIndex].password, // Retain old password if not changed
            ph_no,
            program,
            dept_name,
            enrollment_status,
        };

        try {
            console.log("Updated student id", updatedStudent._id);
            const response = await fetch(
                `http://localhost:5000/api/users/${updatedStudent.role}/${updatedStudent._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedStudent),
                }
            );

            if (response.ok) {
                console.log("Updated student:", updatedStudent);
                await fetchStudents(); // Fetch updated list of students
            } else {
                console.error("Failed to update student:", response.statusText);
                alert("Failed to update student");
            }
        } catch (error) {
            console.error("Error updating student:", error);
        }
    } else {
        // Add mode: Add a new student
        const newStudent = {
            name,
            email,
            password,
            role: "student", // Set role directly
            ph_no,
            program,
            dept_name,
            enrollment_status,
        };

        const response = await fetch("http://localhost:5000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newStudent),
        });

        if (response.status === 400) {
            alert("Student Already Exists");
        } else if (response.ok) {
            const createdStudent = await response.json();
            console.log("Created student:", createdStudent);
            await fetchStudents(); // Fetch updated list of students
        } else {
            alert("Failed to add student");
        }
    }

    setShowModal(false); // Close the modal
};


  const handleDelete = async (index) => {
    const studentToDelete = students[index];
    console.log("Deleting student:", studentToDelete); // Debug log

    // Send delete request to the server
    const role = "student"; // Define the role (make sure this is set appropriately)
    const studentId = studentToDelete._id; // Assuming studentToDelete is defined

    const response = await fetch(
      `http://localhost:5000/api/users/${role}/${studentId}`, // Include role in the URL
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const updatedStudents = students.filter((_, i) => i !== index);
      setStudents(updatedStudents);
      console.log("Student deleted successfully"); // Debug log
    } else {
      alert("Failed to delete student");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (sortConfig.key) {
      const aKey = a[sortConfig.key].toLowerCase();
      const bKey = b[sortConfig.key].toLowerCase();
      return sortConfig.direction === "ascending"
        ? aKey.localeCompare(bKey)
        : bKey.localeCompare(aKey);
    }
    return students;
  });

  const filteredStudents = sortedStudents.filter((student) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    if (filterType === "by name") {
        return student.name.toLowerCase().includes(lowerCaseSearchTerm);
    } else if (filterType === "by email") {
        return student.email.toLowerCase().includes(lowerCaseSearchTerm);
    } else if (filterType === "by department name") {
        return student.dept_name.toLowerCase().includes(lowerCaseSearchTerm);
    } else if (filterType === "by student ID") {
        return student.stud_id.toLowerCase().includes(lowerCaseSearchTerm);
    }
    else if (filterType === "by program") {
      return student.program.toLowerCase().includes(lowerCaseSearchTerm);
    }
    else if (filterType === "by phone number") {
      return student.ph_no.toLowerCase().includes(lowerCaseSearchTerm);
    }    else if (filterType === "by enrollment status") {
      return student.enrollment_status.toLowerCase().includes(lowerCaseSearchTerm);
    }
    return true; // No specific filter applied, show all students
});


  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand href="#home">STUDENT MANAGEMENT</Navbar.Brand>
      </Navbar>

      <Form.Control
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-3"
      />
      <Dropdown onSelect={handleFilterChange}>
        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
          <FaFilter /> {filterType}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item eventKey="by name">By Name</Dropdown.Item>
          <Dropdown.Item eventKey="by email">By Email</Dropdown.Item>
          <Dropdown.Item eventKey="by department name">By Department Name</Dropdown.Item>
          <Dropdown.Item eventKey="by member ID">By Member ID</Dropdown.Item>
          <Dropdown.Item eventKey="by program">By Program</Dropdown.Item>
          <Dropdown.Item eventKey="by phone number">By Phone Number</Dropdown.Item>
          <Dropdown.Item eventKey="by enrollment status">By Enrollment Status</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Button variant="primary" onClick={() => handleShowModal(null)}>
        <i className="fas fa-plus icon"></i> Add Student
      </Button>

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th onClick={() => requestSort("name")}>Name</th>
              <th onClick={() => requestSort("email")}>Email</th>
              <th>Phone Number</th>
              <th>Program</th>
              <th>Department</th>
              <th>Enrollment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.stud_id}> {/* Use stud_id for key */}
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.ph_no}</td>
                <td>{student.program}</td>
                <td>{student.dept_name}</td>
                <td>{student.enrollment_status}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleShowModal(index)}
                  >
                    <i className="fas fa-edit icon"></i> Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(index)}>
                    <i className="fas fa-trash-alt icon"></i> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? "Edit Student" : "Add Student"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {editIndex !== null && (
              <Form.Group controlId="formStudentId">
                <Form.Label>Student ID</Form.Label>
                <Form.Control
                  type="text"
                  value={studentId}
                  readOnly // Make the student ID read-only
                />
              </Form.Group>
            )}
            <Form.Group controlId="formStudentName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStudentEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStudentPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStudentPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={ph_no}
                onChange={(e) => setPhNo(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStudentProgram">
              <Form.Label>Program</Form.Label>
              <Form.Control
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStudentDepartment">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                value={dept_name}
                onChange={(e) => setDeptName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStudentEnrollment">
              <Form.Label>Enrollment Status</Form.Label>
              <Form.Control
                type="text"
                value={enrollment_status}
                onChange={(e) => setEnrollmentStatus(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddOrUpdate}>
            {editIndex !== null ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
   </div>
  );
};

export default StudentsPage;