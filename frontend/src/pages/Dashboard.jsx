import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Toast, ToastContainer } from 'react-bootstrap';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CATEGORIES = [
  'food',
  'transport', 
  'shopping',
  'entertainment',
  'utilities',
  'healthcare',
  'education',
  'travel',
  'other'
];

function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const response = await apiClient.get('/expenses');
      if (response.success) {
        setExpenses(response.expenses || []);
      }
    } catch (error) {
      console.error('Failed to load expenses:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const response = await apiClient.put(`/expenses/${editingId}`, {
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
          title: formData.description || 'Untitled Expense',
          description: formData.description
        });

        if (response.success) {
          setToastMessage('Expense updated successfully!');
          setToastVariant('success');
          setShowToast(true);
          setEditingId(null);
        } else {
          throw new Error(response.message || 'Update failed');
        }
      } else {
        const response = await apiClient.post('/expenses', {
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
          title: formData.description || 'Untitled Expense',
          description: formData.description
        });

        if (response.success) {
          setToastMessage('Expense added successfully!');
          setToastVariant('success');
          setShowToast(true);
        } else {
          throw new Error(response.message || 'Creation failed');
        }
      }

      setFormData({
        amount: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      loadExpenses();
    } catch (error) {
      setToastMessage(error.message || 'Operation failed');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      amount: expense.amount,
      category: expense.category,
      date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: expense.title || expense.description || ''
    });
    setEditingId(expense._id || expense.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await apiClient.delete(`/expenses/${id}`);
        if (response.success) {
          setToastMessage('Expense deleted successfully!');
          setToastVariant('success');
          setShowToast(true);
          loadExpenses();
        }
      } catch (error) {
        setToastMessage(error.message || 'Delete failed');
        setToastVariant('danger');
        setShowToast(true);
      }
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = !filterCategory || expense.category === filterCategory;
    const title = expense.title || expense.description || '';
    const matchesSearch = !searchTerm ||
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const categoryTotals = CATEGORIES.map(cat => {
    return filteredExpenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  });

  const pieData = {
    labels: CATEGORIES,
    datasets: [{
      data: categoryTotals,
      backgroundColor: [
        '#007bff',
        '#28a745',
        '#ffc107',
        '#dc3545',
        '#17a2b8',
        '#6f42c1',
        '#fd7e14',
        '#20c997',
        '#6c757d'
      ]
    }]
  };

  const currentMonth = new Date().getMonth();
  const monthlyData = Array(12).fill(0);
  expenses.forEach(exp => {
    const month = new Date(exp.date).getMonth();
    monthlyData[month] += parseFloat(exp.amount);
  });

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Monthly Spending',
      data: monthlyData,
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      tension: 0.4
    }]
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Dashboard</h2>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-primary shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Total Expenses</h6>
              <h3 className="text-primary">₹{totalExpenses.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success shadow-sm">
            <Card.Body>
              <h6 className="text-muted">This Month</h6>
              <h3 className="text-success">₹{monthlyData[currentMonth].toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Transactions</h6>
              <h3 className="text-info">{expenses.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Categories</h6>
              <h3 className="text-warning">{CATEGORIES.length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">{editingId ? 'Edit' : 'Add'} Expense</h5>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Amount (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Title/Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter expense title or description"
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="primary" type="submit">
                    {editingId ? 'Update' : 'Add'} Expense
                  </Button>
                  {editingId && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({
                          amount: '',
                          category: 'food',
                          date: new Date().toISOString().split('T')[0],
                          description: ''
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Spending by Category</h5>
              <Pie data={pieData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Monthly Trend</h5>
              <Line data={lineData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Recent Expenses</h5>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(expense => (
                  <tr key={expense._id || expense.id}>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>
                      <Badge bg="primary">{expense.category}</Badge>
                    </td>
                    <td>{expense.title || expense.description || ''}</td>
                    <td className="fw-bold">₹{parseFloat(expense.amount).toFixed(2)}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => handleEdit(expense)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(expense._id || expense.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg={toastVariant}>
          <Toast.Header>
            <strong className="me-auto">{toastVariant === 'success' ? 'Success' : 'Error'}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default Dashboard;
