import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Toast, ToastContainer, Modal } from 'react-bootstrap';
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthContext';

function Bills() {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
    frequency: 'monthly',
    next_due_date: ''
  });

  const billCategories = [
    { value: 'utilities', label: 'Utilities' },
    { value: 'rent', label: 'Rent' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'loan', label: 'Loan' },
    { value: 'mortgage', label: 'Mortgage' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'phone', label: 'Phone' },
    { value: 'internet', label: 'Internet' },
    { value: 'other', label: 'Other' }
  ];
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const response = await apiClient.get('/bills');
      if (response.success) {
        setBills(response.bills || []);
      }
    } catch (error) {
      console.error('Failed to load bills:', error);
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
      if (editingBill) {
        const response = await apiClient.put(`/bills/${editingBill}`, {
          title: formData.name,
          category: formData.category,
          amount: parseFloat(formData.amount),
          frequency: formData.frequency,
          dueDate: formData.next_due_date
        });

        if (response.success) {
          setToastMessage('Bill updated successfully!');
          setToastVariant('success');
          setShowToast(true);
        } else {
          throw new Error(response.message || 'Update failed');
        }
      } else {
        const response = await apiClient.post('/bills', {
          title: formData.name,
          category: formData.category,
          amount: parseFloat(formData.amount),
          frequency: formData.frequency,
          dueDate: formData.next_due_date
        });

        if (response.success) {
          setToastMessage('Bill created successfully!');
          setToastVariant('success');
          setShowToast(true);
        } else {
          throw new Error(response.message || 'Creation failed');
        }
      }

      setShowModal(false);
      setEditingBill(null);
      setFormData({ name: '', category: '', amount: '', frequency: 'monthly', next_due_date: '' });
      loadBills();
    } catch (error) {
      setToastMessage(error.message || 'Operation failed');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleEdit = (bill) => {
    setFormData({
      name: bill.title || bill.name,
      category: bill.category || '',
      amount: bill.amount,
      frequency: bill.frequency,
      next_due_date: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : (bill.next_due_date ? new Date(bill.next_due_date).toISOString().split('T')[0] : '')
    });
    setEditingBill(bill._id || bill.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        const response = await apiClient.delete(`/bills/${id}`);
        if (response.success) {
          setToastMessage('Bill deleted successfully!');
          setToastVariant('success');
          setShowToast(true);
          loadBills();
        }
      } catch (error) {
        setToastMessage(error.message || 'Delete failed');
        setToastVariant('danger');
        setShowToast(true);
      }
    }
  };

  const openNewBillModal = () => {
    setEditingBill(null);
    setFormData({ name: '', category: '', amount: '', frequency: 'monthly', next_due_date: '' });
    setShowModal(true);
  };

  const totalMonthlyBills = bills
    .filter(b => b.frequency === 'monthly')
    .reduce((sum, b) => sum + parseFloat(b.amount), 0);

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return 0;
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Recurring Bills</h2>
        <Button variant="primary" onClick={openNewBillModal}>
          + New Bill
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center border-primary shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Total Monthly Bills</h6>
              <h3 className="text-primary">₹{totalMonthlyBills.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-success shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Active Bills</h6>
              <h3 className="text-success">{bills.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-warning shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Due This Week</h6>
              <h3 className="text-warning">
                {bills.filter(b => getDaysUntilDue(b.next_due_date) <= 7 && getDaysUntilDue(b.next_due_date) >= 0).length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {bills.length === 0 ? (
        <Card className="shadow-sm text-center py-5">
          <Card.Body>
            <h5 className="text-muted">No recurring bills yet</h5>
            <p className="text-muted">Add your first recurring bill to start tracking!</p>
            <Button variant="primary" onClick={openNewBillModal}>
              Add Bill
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {bills.map(bill => {
            const dueDate = bill.dueDate || bill.next_due_date;
            const daysUntilDue = getDaysUntilDue(dueDate);
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

            return (
              <Col md={6} lg={4} key={bill._id || bill.id} className="mb-4">
                <Card className={`shadow-sm h-100 ${isOverdue ? 'border-danger' : isDueSoon ? 'border-warning' : ''}`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5>{bill.title || bill.name}</h5>
                        {bill.category && (
                          <Badge bg="secondary" className="text-capitalize mt-1">
                            {bill.category.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                      <Badge bg={bill.frequency === 'monthly' ? 'primary' : bill.frequency === 'weekly' ? 'info' : 'success'}>
                        {bill.frequency}
                      </Badge>
                    </div>

                    <div className="mb-2">
                      <h3 className="text-primary">₹{parseFloat(bill.amount).toFixed(2)}</h3>
                    </div>

                    <div className="mb-3">
                      <strong>Next Due:</strong> {dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A'}
                      {isOverdue && (
                        <Badge bg="danger" className="ms-2">Overdue</Badge>
                      )}
                      {isDueSoon && !isOverdue && (
                        <Badge bg="warning" className="ms-2">Due Soon</Badge>
                      )}
                      <div className="text-muted small">
                        {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`}
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleEdit(bill)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(bill._id || bill.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingBill ? 'Edit' : 'Create'} Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Bill Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {billCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bill Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Netflix Subscription"
                required
              />
            </Form.Group>

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

            <Form.Group className="mb-3">
              <Form.Label>Frequency</Form.Label>
              <Form.Select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Next Due Date</Form.Label>
              <Form.Control
                type="date"
                name="next_due_date"
                value={formData.next_due_date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                {editingBill ? 'Update' : 'Create'} Bill
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

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

export default Bills;
