import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Form, Modal, Navbar, Dropdown } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaFilter } from "react-icons/fa";

import "./DepartmentMembersPage.css";

const DepartmentMembersPage = () => {
  const [departmentMembers, setDepartmentMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [errors, setErrors] = useState({});

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const deptNameRef = useRef(null);
  const deptMemIdRef = useRef(null);

  const fetchDepartmentMembers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users?role=deptMember"
      );
      if (response.ok) {
        const data = await response.json();
        setDepartmentMembers(data);
      } else {
        console.error("Failed to fetch department members");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [filterType, setFilterType] = useState("Select Filter");
  
  useEffect(() => {
    fetchDepartmentMembers();
  }, []);

  const handleFilterChange = (eventKey) => {
    setFilterType(eventKey);
  };

  const handleShowModal = (index = null) => {
    setEditIndex(index);
    setShowModal(true);
    setErrors({});
    setTimeout(() => {
      if (index !== null) {
        const member = departmentMembers[index];
        if (nameRef.current) nameRef.current.value = member.name;
        if (emailRef.current) emailRef.current.value = member.email;
        if (passwordRef.current) passwordRef.current.value = member.password;
        if (deptNameRef.current) deptNameRef.current.value = member.dept_name;
        if (deptMemIdRef.current)
          deptMemIdRef.current.value = member.dept_mem_id;
      } else {
        if (nameRef.current) nameRef.current.value = "";
        if (emailRef.current) emailRef.current.value = "";
        if (passwordRef.current) passwordRef.current.value = "";
        if (deptNameRef.current) deptNameRef.current.value = "";
        if (deptMemIdRef.current) deptMemIdRef.current.value = "";
      }
    }, 0);
  };

  const validateForm = () => {
    const errors = {};
    if (!nameRef.current?.value) errors.name = "Name is required.";
    if (
      !emailRef.current?.value ||
      !/\S+@\S+\.\S+/.test(emailRef.current?.value)
    ) {
      errors.email = "A valid email is required.";
    }
    if (!passwordRef.current?.value || passwordRef.current?.value.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (!deptNameRef.current?.value)
      errors.deptName = "Department name is required.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOrUpdate = async () => {
    if (!validateForm()) return;

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const dept_name = deptNameRef.current.value;
    const dept_mem_id = deptMemIdRef.current?.value || "";

    let role = "deptMember";
    if (editIndex !== null) {
      const updatedMember = {
        name,
        email,
        password,
        dept_name,
        dept_mem_id,
        role,
      };
      const response = await fetch(
        `http://localhost:5000/api/users/${role}/${departmentMembers[editIndex]._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMember),
        }
      );

      if (response.ok) {
        await fetchDepartmentMembers();
      } else {
        alert("Failed to update department member");
      }
    } else {
      const newMember = { name, email, password, dept_name, dept_mem_id, role };
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      if (response.status === 400) {
        alert("Department member with this email address already exists!");
      } else if (response.ok) {
        await fetchDepartmentMembers();
      } else {
        alert("Failed to add department member");
      }
    }

    setShowModal(false);
  };

  const handleDelete = async (index) => {
    const memberId = departmentMembers[index]._id;
    const response = await fetch(
      `http://localhost:5000/api/users/${departmentMembers[index].role}/${memberId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      await fetchDepartmentMembers();
    } else {
      alert("Failed to delete department member");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const sortedDepartmentMembers = [...departmentMembers].sort((a, b) => {
    if (sortConfig.key) {
      const aKey = a[sortConfig.key].toLowerCase();
      const bKey = b[sortConfig.key].toLowerCase();
      if (aKey < bKey) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aKey > bKey) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    }
    return departmentMembers;
  });

  const filteredDepartmentMembers = sortedDepartmentMembers.filter((departmentMember) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    if (filterType === "by name") {
      return departmentMember.name.toLowerCase().includes(lowerCaseSearchTerm);
    } else if (filterType === "by email") {
      return departmentMember.email.toLowerCase().includes(lowerCaseSearchTerm);
    } else if (filterType === "by department name") {
      return departmentMember.dept_name.toLowerCase().includes(lowerCaseSearchTerm);
    } else if (filterType === "by member ID") {
      return departmentMember.dept_mem_id.toLowerCase().includes(lowerCaseSearchTerm);
    }
    return true; // No filter applied
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container">
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand href="#home">DEPARTMENT MEMBER MANAGEMENT</Navbar.Brand>
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
        </Dropdown.Menu>
      </Dropdown>

      <Button variant="primary" onClick={() => handleShowModal(null)}>
        Add Department Member
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => requestSort("name")}>Name</th>
            <th onClick={() => requestSort("email")}>Email</th>
            <th onClick={() => requestSort("dept_name")}>Department Name</th>
            <th onClick={() => requestSort("dept_mem_id")}>
              Department Member ID
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartmentMembers.map((departmentMember, index) => (
            <tr key={departmentMember._id}>
              <td>{departmentMember.name}</td>
              <td>{departmentMember.email}</td>
              <td>{departmentMember.dept_name}</td>
              <td>{departmentMember.dept_mem_id}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(index)}
                >
                  <FaEdit /> Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(index)}
                >
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editIndex !== null ? "Edit" : "Add"} Department Member
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                ref={nameRef}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Department Name</Form.Label>
              <Form.Control
                type="text"
                ref={deptNameRef}
                isInvalid={!!errors.deptName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.deptName}
              </Form.Control.Feedback>
            </Form.Group>
            {editIndex !== null && (
              <Form.Group controlId="departmentMemberDeptMemId">
                <Form.Label>Department Member ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter department member ID"
                  ref={deptMemIdRef}
                  readOnly
                />
              </Form.Group>
            )}
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

export default DepartmentMembersPage;
