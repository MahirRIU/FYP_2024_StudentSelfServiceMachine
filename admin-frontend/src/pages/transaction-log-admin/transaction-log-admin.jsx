import React, { useState, useEffect } from 'react';
import { Container, Navbar, Row, Col, Button, FormControl, Table, Dropdown } from 'react-bootstrap';
import { FaFilter, FaTrash, FaSync } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './transaction-log-admin.css';

const TransactionLogAdmin = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load transactions from the server
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      console.log('Deleting transaction', id);
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTransactions(transactions.filter((transaction) => transaction._id !== id));
      } else {
        console.log(response);
        console.error('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleRefreshAllTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error refreshing transactions:', error);
    }
  };
  const filteredTransactions = transactions.filter((transaction) => 
    transaction.stud_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(transaction.amount).includes(searchTerm) || // Convert amount to string for comparison
    transaction.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.trans_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand href="#home">TRANSACTION LOG</Navbar.Brand>
      </Navbar>

      <Container fluid className="mt-5 pt-3">
        <Row className="current-transactions-header mb-3">
          <Col>
            <h3>Current Transactions</h3>
          </Col>
          <Col className="current-transactions-actions d-flex justify-content-end">
            <FormControl
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={handleSearch}
              className="mr-2"
            />
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                <FaFilter />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>by student ID</Dropdown.Item>
                <Dropdown.Item>by amount</Dropdown.Item>
                <Dropdown.Item>by date</Dropdown.Item>
                <Dropdown.Item>by transaction ID</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="info" onClick={handleRefreshAllTransactions} className="ml-2">
              <FaSync />
            </Button>
          </Col>
        </Row>

        <Row className="transaction-metadata">
          <Col>
            <p>Total Transactions: {transactions.length}</p>
          </Col>
        </Row>

        <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Transaction ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.stud_id}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.date}</td>
                    <td>{transaction.trans_id}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteTransaction(transaction._id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TransactionLogAdmin;
