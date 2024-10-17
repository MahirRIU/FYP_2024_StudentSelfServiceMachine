import React, { useState } from 'react';
import { Container, Navbar, Nav, Row, Col, Card, Button, Form, Table, FormControl, Dropdown } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './active-machine-admin.css';
import Build from '@mui/icons-material/Build';
import LocationOn from '@mui/icons-material/LocationOn';

const initialMachines = [
  { id: 1, name: 'Kiosk 1', location: 'Lobby'},
  { id: 2, name: 'Kiosk 2', location: 'Cafeteria'},
];

const ActiveMachineAdmin = () => {
  const [machines, setMachines] = useState(initialMachines);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMachine, setFormMachine] = useState({ id: null, name: '', location: ''});

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectMachine = (id) => {
    setSelectedMachines((prevSelected) => 
      prevSelected.includes(id) ? prevSelected.filter((machineId) => machineId !== id) : [...prevSelected, id]
    );
  };

  const handleDeleteMachine = (id) => {
    setMachines(machines.filter((machine) => machine.id !== id));
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormMachine((prevMachine) => ({ ...prevMachine, [name]: value }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (formMachine.id) {
      setMachines(machines.map((machine) => (machine.id === formMachine.id ? formMachine : machine)));
    } else {
      setMachines([...machines, { ...formMachine, id: machines.length + 1 }]);
    }
    setFormMachine({ id: null, name: '', location: '' });
    setShowForm(false);
  };

  const handleEditMachine = (machine) => {
    setFormMachine(machine);
    setShowForm(true);
  };

  const filteredMachines = machines.filter((machine) => 
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand href="/admin/manage-machines">MACHINE MANAGEMENT</Navbar.Brand>
      </Navbar>

      <Container fluid className="mt-5 pt-3">
        <Row className="current-machines-header mb-3">
          <Col>
            <h3>Current Machines</h3>
          </Col>
          <Col className="current-machines-actions d-flex justify-content-end">
            <FormControl type="text" placeholder="Search machines..." value={searchTerm} onChange={handleSearch} className="mr-2" />
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                <FaFilter />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>by name</Dropdown.Item>
                <Dropdown.Item>by location</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="primary" onClick={() => setShowForm(true)} className="ml-2">
              <FaPlus />
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Machine Id</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMachines.map((machine) => (
                  <tr key={machine.id}>
                    <td>
                      <Form.Check type="checkbox" checked={selectedMachines.includes(machine.id)} onChange={() => handleSelectMachine(machine.id)} />
                    </td>
                    <td>{machine.name}</td>
                    <td>{machine.location}</td>
                    <td>
                      <Button variant="warning" size="sm" onClick={() => handleEditMachine(machine)}>
                        <FaEdit />
                      </Button>{' '}
                      <Button variant="danger" size="sm" onClick={() => handleDeleteMachine(machine.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        {showForm && (
          <Row className="mt-3">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>{formMachine.id ? 'Edit Machine' : 'Create Machine'}</Card.Title>
                  <Form onSubmit={handleFormSubmit} className="machine-form">
                    <Form.Group controlId="formName">
                      <Form.Label>Machine Id</Form.Label>
                      <div className="input-container">
                        <Build className="input-icon" />
                        <Form.Control
                          type="text"
                          name="name"
                          value={formMachine.name}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </Form.Group>
                    <Form.Group controlId="formLocation">
                      <Form.Label>Location</Form.Label>
                      <div className="input-container">
                        <LocationOn className="input-icon" />
                        <Form.Control
                          type="text"
                          name="location"
                          value={formMachine.location}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      {formMachine.id ? 'Update Machine' : 'Create Machine'}
                    </Button>{' '}
                    <Button variant="secondary" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ActiveMachineAdmin;
