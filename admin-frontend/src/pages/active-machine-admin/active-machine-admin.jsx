import React, { useState, useEffect } from "react";
import {
  Container,
  Navbar,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaFilter } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./active-machine-admin.css";
import Build from "@mui/icons-material/Build";
import LocationOn from "@mui/icons-material/LocationOn";

const ActiveMachineAdmin = () => {
  const [machines, setMachines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formMachine, setFormMachine] = useState({
    machine_id: "",
    location: "",
  });
  const [filterType, setFilterType] = useState("by id"); // New state for filter type

  const fetchMachines = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/machines");
      if (response.ok) {
        const data = await response.json();
        setMachines(data);
      } else {
        console.error("Failed to fetch machines");
      }
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  // Load machines from the backend
  useEffect(() => {
    fetchMachines();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (filter) => {
    setFilterType(filter); // Update filter type when dropdown selection changes
    setSearchTerm(""); // Reset search term when filter changes
  };

  const handleDeleteMachine = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/machines/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMachines(machines.filter((machine) => machine._id !== id));
      } else {
        console.error("Failed to delete machine");
      }
    } catch (error) {
      console.error("Error deleting machine:", error);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormMachine((prevMachine) => ({ ...prevMachine, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const method = formMachine.machine_id ? "PUT" : "POST";
      const endpoint = formMachine.machine_id
        ? `http://localhost:5000/api/machines/${formMachine.machine_id}`
        : "http://localhost:5000/api/machines";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formMachine),
      });

      if (response.ok) {
        // Re-fetch machines to get the updated list
        await fetchMachines(); // Call the fetchMachines function after adding/updating

        resetForm(); // Reset form after saving
      } else {
        console.error("Failed to save machine");
      }
    } catch (error) {
      console.error("Error saving machine:", error);
    }
  };

  const handleEditMachine = (machine) => {
    setFormMachine({
      machine_id: machine.machine_id,
      location: machine.location,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormMachine({ machine_id: "", location: "" });
    setShowForm(false);
  };

  // Filter machines based on selected filter type and search term
  const filteredMachines = machines.filter((machine) => {
    const searchValue = searchTerm.toLowerCase();
    if (filterType === "by id") {
      return machine.machine_id.toLowerCase().includes(searchValue);
    } else if (filterType === "by location") {
      return machine.location.toLowerCase().includes(searchValue);
    }
    return true; // Default case
  });

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand href="/admin/manage-machines">
          MACHINE MANAGEMENT
        </Navbar.Brand>
      </Navbar>

      <Container fluid className="mt-5 pt-3">
        <Row className="current-machines-header mb-3">
          <Col>
            <h3>Current Machines</h3>
          </Col>
          <Col className="current-machines-actions d-flex justify-content-end">
            <FormControl
              type="text"
              placeholder="Search machines..."
              value={searchTerm}
              onChange={handleSearch}
              className="mr-2"
              style={{ width: "200px" }} // Set your desired width here
            />

            <Dropdown onSelect={handleFilterChange}>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                <FaFilter /> {filterType}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="by id">By ID</Dropdown.Item>
                <Dropdown.Item eventKey="by location">
                  By Location
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button
              variant="primary"
              onClick={() => {
                resetForm(); // Reset form when adding new machine
                setShowForm(true);
              }}
              className="ml-2"
            >
              <FaPlus />
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Machine Id</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMachines.map((machine) => (
                  <tr key={machine._id}>
                    <td>{machine.machine_id}</td>
                    <td>{machine.location}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEditMachine(machine)}
                      >
                        <FaEdit />
                      </Button>{" "}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteMachine(machine._id)}
                      >
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
                  <Card.Title>
                    {formMachine.machine_id ? "Edit Machine" : "Create Machine"}
                  </Card.Title>
                  <Form onSubmit={handleFormSubmit} className="machine-form">
                    {/* Show Machine ID only when editing an existing machine */}
                    {formMachine.machine_id && (
                      <Form.Group controlId="formMachineId">
                        <Form.Label>Machine Id</Form.Label>
                        <div className="input-container">
                          <Build className="input-icon" />
                          <Form.Control
                            type="text"
                            name="machine_id"
                            value={formMachine.machine_id}
                            readOnly // Make this field read-only
                          />
                        </div>
                      </Form.Group>
                    )}
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
                      {formMachine.machine_id
                        ? "Update Machine"
                        : "Create Machine"}
                    </Button>{" "}
                    <Button variant="secondary" onClick={resetForm}>
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
