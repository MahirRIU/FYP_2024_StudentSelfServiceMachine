import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Row, Col, Card, Image } from 'react-bootstrap';
import LoadingBar from '../../components/LoadingBar'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './menu-admin.css';
import image from '../../assets/contact.png';
import cardImage1 from '../../assets/um.png';
import cardImage2 from '../../assets/am.png';
import cardImage3 from '../../assets/tl.png';

const MenuAdmin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const navigateToUserManagement = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/admin/user-management');
    }, 1300);
  };

  const navigateToMachineManagement = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/admin/machine-management');
    }, 1300);
  };

  const navigateToTransactionLog = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/admin/transaction-log');
    }, 1300); 
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand href="#home">ADMINISTRATION</Navbar.Brand>
        <Nav className="ml-auto d-flex align-items-center" style={{ marginLeft: 'auto' }}>
          <Nav.Link  className="d-flex align-items-center">
            <span style={{ color: 'white', marginRight: '8px' }}>Admin</span>
            <Image src={image} alt="profile photo" className='img-profile' roundedCircle />
          </Nav.Link>
        </Nav>
      </Navbar>
      {isLoading && <LoadingBar />}

      <Container fluid>
        <Nav className="flex-column">
        </Nav>
        <Col md={12} className="content">
          <Row>
            <Col md={4}>
              <Card onClick={navigateToUserManagement} className="clickable-card">
                <Card.Body>
                  <Card.Title>User Management</Card.Title>
                  <div className="custom-card-img-container">
                    <Card.Img variant="top" src={cardImage1} alt="Card image" className='card-img' />
                  </div>
                  <Card.Text>
                    Manage your users.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card onClick={navigateToMachineManagement} className="clickable-card">
                <Card.Body>
                  <Card.Title>Machine Management</Card.Title>
                  <div className="custom-card-img-container">
                    <Card.Img variant="top" src={cardImage2} alt="Card image" className='card-img' />
                  </div>
                  <Card.Text>
                    Manage your machines.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card onClick={navigateToTransactionLog} className="clickable-card">
                <Card.Body>
                  <Card.Title>Transaction log</Card.Title>
                  <div className="custom-card-img-container">
                    <Card.Img variant="top" src={cardImage3} alt="Card image" className='card-img' />
                  </div>
                  <Card.Text>
                    Track recent transactions.
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

export default MenuAdmin;
