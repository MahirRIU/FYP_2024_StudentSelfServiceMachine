import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import './DepartmentMembersPage.css';
import { Navbar } from 'react-bootstrap';

const DepartmentMembersPage = () => {
  const [departmentMembers, setDepartmentMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  
  // Fix: Initialize useRef with null instead of an empty string
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    setDepartmentMembers([
      { id: 1, name: 'Mr. Charlie Brown', email: 'charlie@example.com' },
      { id: 2, name: 'Ms. Diana Prince', email: 'diana@example.com' },
    ]);
  }, []);

  const handleShowModal = (index = null) => {
    setEditIndex(index);
    if (index !== null) {
      if (nameRef.current && emailRef.current) {
        nameRef.current.value = departmentMembers[index].name;
        emailRef.current.value = departmentMembers[index].email;
      }
    } else {
      if (nameRef.current && emailRef.current) {
        nameRef.current.value = '';
        emailRef.current.value = '';
      }
    }
    setShowModal(true);
  };

  const handleAddOrUpdate = () => {
    const name = nameRef.current ? nameRef.current.value : '';
    const email = emailRef.current ? emailRef.current.value : '';

    // Validation
    if (name === '' || email === '') {
      alert('Please fill out all fields');
      return;
    }

    if (editIndex !== null) {
      const updatedDepartmentMembers = [...departmentMembers];
      updatedDepartmentMembers[editIndex] = { ...updatedDepartmentMembers[editIndex], name, email };
      setDepartmentMembers(updatedDepartmentMembers);
    } else {
      setDepartmentMembers([...departmentMembers, { id: departmentMembers.length + 1, name, email }]);
    }

    setShowModal(false);
  };

  const handleDelete = (index) => {
    const updatedDepartmentMembers = departmentMembers.filter((_, i) => i !== index);
    setDepartmentMembers(updatedDepartmentMembers);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const sortedDepartmentMembers = [...departmentMembers].sort((a, b) => {
    if (sortConfig.key) {
      const aKey = a[sortConfig.key].toLowerCase();
      const bKey = b[sortConfig.key].toLowerCase();
      if (aKey < bKey) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aKey > bKey) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    }
    return departmentMembers;
  });

  const filteredDepartmentMembers = sortedDepartmentMembers.filter((departmentMember) =>
    departmentMember.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container">
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
    <Navbar.Brand href="#home" >DEPARTMENT MEMBER MANAGEMENT</Navbar.Brand>
    </Navbar>
      {/* <h1>Department Members Management</h1> */}

      <Form.Control
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-3"
      />

      <Button variant="primary" onClick={() => handleShowModal(null)}>
        Add Department Member
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => requestSort('name')}>Name</th>
            <th onClick={() => requestSort('email')}>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartmentMembers.map((departmentMember, index) => (
            <tr key={departmentMember.id}>
              <td>{departmentMember.name}</td>
              <td>{departmentMember.email}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal(index)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(index)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? 'Edit Department Member' : 'Add Department Member'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="departmentMemberName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" ref={nameRef} />
            </Form.Group>
            <Form.Group controlId="departmentMemberEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" ref={emailRef} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddOrUpdate}>
            {editIndex !== null ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DepartmentMembersPage;
