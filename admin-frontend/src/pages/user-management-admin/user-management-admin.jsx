import React, { useState } from 'react';
import { Container, Navbar, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './user-management-admin.css';
import LoadingBar from '../../components/LoadingBar'; 
import studentImage from '../../assets/student.png';  
import departmentImage from '../../assets/departmentmember.png';

const UserManagementAdmin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const navigateToManageStudent = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/admin/dashboard/manage-students');
    }, 1300);
  };

  const navigateToManageDeptMember = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/admin/dashboard/manage-departmentmembers');
    }, 1300);
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand href="#home">USER MANAGEMENT</Navbar.Brand>
      </Navbar>
      {isLoading && <LoadingBar />}

      <Container fluid className="mt-5 pt-3">
        <Col md={12} className="content">
          <Row>
            <Col md={6}>
              <Card onClick={navigateToManageStudent} className="clickable-card">
                <Card.Body>
                  <Card.Title>Students</Card.Title>
                  <div className="custom-card-img-container">
                    <Card.Img variant="top" src={studentImage} alt="Students" className="card-img" />
                  </div>
                  <Card.Text>
                    Manage student users.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card onClick={navigateToManageDeptMember} className="clickable-card">
                <Card.Body>
                  <Card.Title>Dept Members</Card.Title>
                  <div className="custom-card-img-container">
                    <Card.Img variant="top" src={departmentImage} alt="Department Member" className="card-img" />
                  </div>
                  <Card.Text>
                    Manage department users.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Container>
    </div>
  );
};

export default UserManagementAdmin;
