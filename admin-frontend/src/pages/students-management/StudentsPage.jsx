import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Navbar, Dropdown } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaFilter } from "react-icons/fa";

import "./StudentsPage.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("student");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ph_no, setPhNo] = useState("");
  const [program, setProgram] = useState("");
  const [faculty, setFaculty] = useState(""); // New: Faculty state
  const [department, setDepartment] = useState(""); // New: Department state
  const [enrollment_status, setEnrollmentStatus] = useState("");
  const [studentId, setStudentId] = useState("");
  const [filterType, setFilterType] = useState("Select Filter");

  // Faculty and department options
  const facultyOptions = {
    FC: ["BSCS", "BSSE", "MIT"],
    FMS: ["BBA", "MBA", "HRM"],
    FE: ["BEE", "BME"],
    RIPHAH: ["BDS", "MBBS"],
  };

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users?role=${roleFilter}`
      );
      if (!response.ok) throw new Error("Failed to fetch students");

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [roleFilter]);

  const handleFilterChange = (eventKey) => {
    setFilterType(eventKey);
  };

  const handleShowModal = (index = null) => {
    setEditIndex(index);
    if (index !== null) {
      // Editing mode
      const student = students[index];
      setName(student.name);
      setEmail(student.email);
      setPassword("");
      setPhNo(student.ph_no);
      setProgram(student.program);
      setFaculty(student.faculty || "");
      setDepartment(student.department || "");
      setEnrollmentStatus(student.enrollment_status);
      setStudentId(student.stud_id);
    } else {
      // Adding mode
      setName("");
      setEmail("");
      setPassword("");
      setPhNo("");
      setProgram("");
      setFaculty("");
      setDepartment("");
      setEnrollmentStatus("");
      setStudentId("");
    }
    setShowModal(true);
  };

  const handleAddOrUpdate = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !ph_no ||
      !program ||
      !faculty ||
      !department ||
      !enrollment_status
    ) {
      alert("Please fill out all fields");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(ph_no)) {
      alert("Please enter a valid phone number (10 digits)");
      return;
    }

    if (editIndex !== null) {
      // Edit mode
      const updatedStudent = {
        ...students[editIndex],
        name,
        email,
        password: password || students[editIndex].password,
        ph_no,
        program,
        faculty,
        department,
        enrollment_status,
      };

      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${updatedStudent.role}/${updatedStudent._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedStudent),
          }
        );

        if (response.ok) {
          await fetchStudents();
        } else {
          alert("Failed to update student");
        }
      } catch (error) {
        console.error("Error updating student:", error);
      }
    } else {
      // Add mode
      const newStudent = {
        name,
        email,
        password,
        role: "student",
        ph_no,
        program,
        faculty,
        department,
        enrollment_status,
      };

      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStudent),
        });

        if (response.ok) {
          await fetchStudents();
        } else {
          alert("Failed to add student");
        }
      } catch (error) {
        console.error("Error adding student:", error);
      }
    }

    setShowModal(false);
  };

  const handleDelete = async (index) => {
    const studentToDelete = students[index];

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${studentToDelete.role}/${studentToDelete._id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setStudents((prev) => prev.filter((_, i) => i !== index));
      } else {
        alert("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
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
    } else if (filterType === "by program") {
      return student.program.toLowerCase().includes(lowerCaseSearchTerm);
    }
    return true;
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
          <Dropdown.Item eventKey="by department name">
            By Department Name
          </Dropdown.Item>
          <Dropdown.Item eventKey="by program">By Program</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Button variant="primary" onClick={() => handleShowModal(null)}>
        <FaPlus /> Add Student
      </Button>

      <Table striped bordered hover className="table">
        <thead>
          <tr>
            <th onClick={() => requestSort("name")}>Name</th>
            <th onClick={() => requestSort("email")}>Email</th>
            <th>Phone Number</th>
            <th>Program</th>
            <th>Faculty</th>
            <th>Department</th>
            <th>Enrollment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={student.stud_id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.ph_no}</td>
              <td>{student.program}</td>
              <td>{student.faculty}</td>
              <td>{student.department}</td>
              <td>{student.enrollment_status}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(index)}
                >
                  <FaEdit /> Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(index)}>
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? "Edit Student" : "Add Student"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={ph_no}
                onChange={(e) => setPhNo(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Program</Form.Label>
              <Form.Control
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Faculty</Form.Label>
              <Form.Control
                as="select"
                value={faculty}
                onChange={(e) => {
                  setFaculty(e.target.value);
                  setDepartment("");
                }}
              >
                <option value="">Select Faculty</option>
                {Object.keys(facultyOptions).map((fac) => (
                  <option key={fac} value={fac}>
                    {fac}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Department</Form.Label>
              <Form.Control
                as="select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={!faculty}
              >
                <option value="">Select Department</option>
                {facultyOptions[faculty]?.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Enrollment Status</Form.Label>
              <Form.Control
                type="text"
                value={enrollment_status}
                onChange={(e) => setEnrollmentStatus(e.target.value)}
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
