import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Row, Col, Card, Image, Button } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './menu-admin.css';
import image from '../../assets/contact.png';
import cardImage1 from '../../assets/um.png';
import cardImage2 from '../../assets/am.png';
import cardImage3 from '../../assets/tl.png';

// Register Chart.js elements
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const MenuAdmin = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');
  const [studentData, setStudentData] = useState([]);
  const [departmentStats, setDepartmentStats] = useState({});
  const [machineData, setMachineData] = useState([]);
  const [machineLocationStats, setMachineLocationStats] = useState({});
  const [deptMemberData, setDeptMemberData] = useState([]);
  const [deptMemberStats, setDeptMemberStats] = useState({});

  // Retrieve the admin's name from localStorage
  useEffect(() => {
    const name = localStorage.getItem('adminName');
    setAdminName(name || 'Admin');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminName'); // Remove admin session data
    navigate('/admin/login'); // Redirect to login page
  };

  // Fetch dynamic data for students, machines, and department members
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await fetch(`http://localhost:5000/api/users?role=student`);
        const students = await studentResponse.json();
        setStudentData(students);

        const deptStats = students.reduce((acc, student) => {
          acc[student.department] = (acc[student.department] || 0) + 1;
          return acc;
        }, {});
        setDepartmentStats(deptStats);

        const machineResponse = await fetch('http://localhost:5000/api/machines');
        const machines = await machineResponse.json();
        setMachineData(machines);

        const locationStats = machines.reduce((acc, machine) => {
          acc[machine.location] = (acc[machine.location] || 0) + 1;
          return acc;
        }, {});
        setMachineLocationStats(locationStats);

        const deptMemberResponse = await fetch(`http://localhost:5000/api/users?role=deptMember`);
        const deptMembers = await deptMemberResponse.json();
        setDeptMemberData(deptMembers);

        const deptMemberStats = deptMembers.reduce((acc, member) => {
          acc[member.dept_name] = (acc[member.dept_name] || 0) + 1;
          return acc;
        }, {});
        setDeptMemberStats(deptMemberStats);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const navigateTo = (path) => {
    navigate(path);
  };

  const departmentChartData = {
    labels: Object.keys(departmentStats),
    datasets: [
      {
        label: 'Students per Department',
        data: Object.values(departmentStats),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384D9', '#36A2EBD9', '#FFCE56D9', '#4BC0C0D9', '#9966FFD9'],
      },
    ],
  };

  const machineLocationChartData = {
    labels: Object.keys(machineLocationStats),
    datasets: [
      {
        label: 'Machines by Location',
        data: Object.values(machineLocationStats),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384D9', '#36A2EBD9', '#FFCE56D9', '#4BC0C0D9'],
      },
    ],
  };

  const deptMemberChartData = {
    labels: Object.keys(deptMemberStats),
    datasets: [
      {
        label: 'Dept Members per Department',
        data: Object.values(deptMemberStats),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384D9', '#36A2EBD9', '#FFCE56D9', '#4BC0C0D9', '#9966FFD9'],
      },
    ],
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow-lg">
        <Navbar.Brand href="#home" className="fw-bold">
          ADMINISTRATION
        </Navbar.Brand>
        <Nav className="ml-auto d-flex align-items-center" style={{ marginLeft: 'auto' }}>
          <Nav.Link className="d-flex align-items-center">
            <span style={{ color: 'white', marginRight: '8px', fontWeight: '500' }}>{adminName}</span>
            <Image src={image} alt="profile photo" className="img-profile" roundedCircle />
          </Nav.Link>
          <Button variant="outline-light" className="ms-3" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Navbar>

      <Container fluid className="pt-5 mt-5">
        <Row>
          <Col md={4}>
            <Card onClick={() => navigateTo('/admin/user-management')} className="clickable-card shadow">
              <Card.Body>
                <Card.Title className="text-center">User Management</Card.Title>
                <div className="custom-card-img-container">
                  <Card.Img variant="top" src={cardImage1} alt="Card image" className="card-img" />
                </div>
                <Card.Text className="text-center">Manage your users efficiently.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card onClick={() => navigateTo('/admin/machine-management')} className="clickable-card shadow">
              <Card.Body>
                <Card.Title className="text-center">Machine Management</Card.Title>
                <div className="custom-card-img-container">
                  <Card.Img variant="top" src={cardImage2} alt="Card image" className="card-img" />
                </div>
                <Card.Text className="text-center">Monitor machine operations.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card onClick={() => navigateTo('/admin/transaction-log')} className="clickable-card shadow">
              <Card.Body>
                <Card.Title className="text-center">Transaction Logs</Card.Title>
                <div className="custom-card-img-container">
                  <Card.Img variant="top" src={cardImage3} alt="Card image" className="card-img" />
                </div>
                <Card.Text className="text-center">Review financial transactions.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={6} className="mb-4">
            <Card className="chart-card shadow">
              <Card.Body>
                <Card.Title className="text-center">Students by Department</Card.Title>
                <Bar data={departmentChartData} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="chart-card shadow">
              <Card.Body>
                <Card.Title className="text-center">Machines by Location</Card.Title>
                <Pie data={machineLocationChartData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="mb-4">
            <Card className="chart-card shadow">
              <Card.Body>
                <Card.Title className="text-center">Dept Members by Department</Card.Title>
                <Bar data={deptMemberChartData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MenuAdmin;
