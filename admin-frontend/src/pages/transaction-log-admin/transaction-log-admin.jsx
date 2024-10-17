import React, { useState } from 'react';
import { Container, Navbar, Nav, Row, Col, Card, Button, Form, Table, FormControl, Dropdown } from 'react-bootstrap';
import { FaSearch, FaFilter, FaTrash, FaSync } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './transaction-log-admin.css';

const initialTransactions = [
  { id: 1, user: 'John Doe', amount: '100 PKR', date: '2024-06-01 12:34:56', transactionId: 'TXN123456' },
  { id: 2, user: 'Jane Smith', amount: '50 PKR', date: '2024-06-02 14:23:45', transactionId: 'TXN654321' },
];

const TransactionLogAdmin = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectTransaction = (id) => {
    setSelectedTransactions((prevSelected) => 
      prevSelected.includes(id) ? prevSelected.filter((transactionId) => transactionId !== id) : [...prevSelected, id]
    );
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  const handleRefreshAllTransactions = () => {
    alert('Refreshing all transactions');
    // In a real-world scenario, you would implement logic to refresh all transaction details
  };

  const filteredTransactions = transactions.filter((transaction) => 
    transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
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
            <FormControl type="text" placeholder="Search transactions..." value={searchTerm} onChange={handleSearch} className="mr-2" />
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                <FaFilter />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>by user</Dropdown.Item>
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
                  <th>Select</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Transaction ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <Form.Check type="checkbox" checked={selectedTransactions.includes(transaction.id)} onChange={() => handleSelectTransaction(transaction.id)} />
                    </td>
                    <td>{transaction.user}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.date}</td>
                    <td>{transaction.transactionId}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteTransaction(transaction.id)}>
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
