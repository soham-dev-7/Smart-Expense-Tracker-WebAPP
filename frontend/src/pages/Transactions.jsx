import { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthContext';

function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, startDate, endDate, categoryFilter]);

  const loadTransactions = async () => {
    try {
      const response = await apiClient.get('/expenses');
      if (response.success) {
        setTransactions(response.expenses || []);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (startDate) {
      filtered = filtered.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= new Date(startDate);
      });
    }

    if (endDate) {
      filtered = filtered.filter(t => {
        const tDate = new Date(t.date);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the entire end date
        return tDate <= end;
      });
    }

    if (categoryFilter) {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    setFilteredTransactions(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Title', 'Amount'];
    const csvData = filteredTransactions.map(t => [
      t.date,
      t.category,
      t.title || t.description || '',
      t.amount
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const categories = [...new Set(transactions.map(t => t.category))];

  return (
    <Container className="py-4">
      <h2 className="mb-4">Transactions</h2>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Button variant="success" onClick={exportToCSV} className="w-100">
                  Export to CSV
                </Button>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center mt-3">
            <h5>Total: <span className="text-primary">₹{totalAmount.toFixed(2)}</span></h5>
            <p className="text-muted">Showing {filteredTransactions.length} of {transactions.length} transactions</p>
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Title</th>
                  <th>Amount</th>
                </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(transaction => (
                  <tr key={transaction._id || transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>
                      <Badge bg="primary">{transaction.category}</Badge>
                    </td>
                    <td>{transaction.title || transaction.description || ''}</td>
                    <td className="fw-bold text-danger">
                      ₹{parseFloat(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Transactions;
