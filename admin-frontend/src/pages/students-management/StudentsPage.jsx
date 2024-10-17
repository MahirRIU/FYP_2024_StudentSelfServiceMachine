import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import './StudentsPage.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome for icons
import 'bootstrap/dist/css/bootstrap.min.css';
import image from '../../assets/contact.png';
import { Navbar} from 'react-bootstrap';


const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    // Fetching the student list (you can fetch from an API here)
    setStudents([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]);
  }, []);

  const handleShowModal = (index = null) => {
    setEditIndex(index);
    
    if (index !== null && nameRef.current && emailRef.current) {
      nameRef.current.value = students[index].name;
      emailRef.current.value = students[index].email;
    } else if (nameRef.current && emailRef.current) {
      nameRef.current.value = '';
      emailRef.current.value = '';
    }
    setShowModal(true);
  };

  const handleAddOrUpdate = () => {
    const name = nameRef.current.value;
    const email = emailRef.current.value;

    if (name === '' || email === '') {
      alert('Please fill out all fields');
      return;

      
    }

    if (editIndex !== null) {
      const updatedStudents = [...students];
      updatedStudents[editIndex] = { ...updatedStudents[editIndex], name, email };
      setStudents(updatedStudents);
    } else {
      setStudents([...students, { id: students.length + 1, name, email }]);
    }

    setShowModal(false);
  };

  const handleDelete = (index) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (sortConfig.key) {
      const aKey = a[sortConfig.key].toLowerCase();
      const bKey = b[sortConfig.key].toLowerCase();
      if (aKey < bKey) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aKey > bKey) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    }
    return students;
  });

  const filteredStudents = sortedStudents.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
     <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
    <Navbar.Brand href="#home">STUDENT MANAGEMENT</Navbar.Brand>
    </Navbar>

      <div className="search-container">
        <i className="fas fa-search search-icon"></i>
        <Form.Control
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          className="mb-3"
        />
      </div>

      <Button variant="primary" onClick={() => handleShowModal(null)}>
        <i className="fas fa-plus icon"></i> Add Student
      </Button>

      <Table striped bordered hover className="table">
        <thead>
          <tr>
            <th onClick={() => requestSort('name')}>Name</th>
            <th onClick={() => requestSort('email')}>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal(index)}>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? 'Edit Student' : 'Add Student'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="studentName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" ref={nameRef} />
            </Form.Group>
            <Form.Group controlId="studentEmail">
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

export default StudentsPage;
