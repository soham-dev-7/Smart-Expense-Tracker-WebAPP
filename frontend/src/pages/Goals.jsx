import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ProgressBar, Toast, ToastContainer, Modal, Badge } from 'react-bootstrap';
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthContext';

function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    target_amount: '',
    current_amount: '',
    deadline: ''
  });

  const goalCategories = [
    { value: 'savings', label: 'Savings' },
    { value: 'investment', label: 'Investment' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'education', label: 'Education' },
    { value: 'travel', label: 'Travel' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'other', label: 'Other' }
  ];
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const response = await apiClient.get('/goals');
      if (response.success) {
        setGoals(response.goals || []);
      }
    } catch (error) {
      console.error('Failed to load goals:', error);
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
      if (editingGoal) {
        const response = await apiClient.put(`/goals/${editingGoal}`, {
          title: formData.title,
          category: formData.category,
          targetAmount: parseFloat(formData.target_amount),
          currentAmount: parseFloat(formData.current_amount || 0),
          deadline: formData.deadline
        });

        if (response.success) {
          setToastMessage('Goal updated successfully!');
          setToastVariant('success');
          setShowToast(true);
        } else {
          throw new Error(response.message || 'Update failed');
        }
      } else {
        const response = await apiClient.post('/goals', {
          title: formData.title,
          category: formData.category,
          targetAmount: parseFloat(formData.target_amount),
          currentAmount: parseFloat(formData.current_amount || 0),
          deadline: formData.deadline
        });

        if (response.success) {
          setToastMessage('Goal created successfully!');
          setToastVariant('success');
          setShowToast(true);
        } else {
          throw new Error(response.message || 'Creation failed');
        }
      }

      setShowModal(false);
      setEditingGoal(null);
      setFormData({ title: '', category: '', target_amount: '', current_amount: '', deadline: '' });
      loadGoals();
    } catch (error) {
      setToastMessage(error.message || 'Operation failed');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleEdit = (goal) => {
    setFormData({
      title: goal.title,
      category: goal.category || '',
      target_amount: goal.targetAmount || goal.target_amount,
      current_amount: goal.currentAmount || goal.current_amount || 0,
      deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ''
    });
    setEditingGoal(goal._id || goal.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const response = await apiClient.delete(`/goals/${id}`);
        if (response.success) {
          setToastMessage('Goal deleted successfully!');
          setToastVariant('success');
          setShowToast(true);
          loadGoals();
        }
      } catch (error) {
        setToastMessage(error.message || 'Delete failed');
        setToastVariant('danger');
        setShowToast(true);
      }
    }
  };

  const openNewGoalModal = () => {
    setEditingGoal(null);
    setFormData({ title: '', category: '', target_amount: '', current_amount: '', deadline: '' });
    setShowModal(true);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Financial Goals</h2>
        <Button variant="primary" onClick={openNewGoalModal}>
          + New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="shadow-sm text-center py-5">
          <Card.Body>
            <h5 className="text-muted">No goals yet</h5>
            <p className="text-muted">Start by creating your first financial goal!</p>
            <Button variant="primary" onClick={openNewGoalModal}>
              Create Goal
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {goals.map(goal => {
            const currentAmount = goal.currentAmount || goal.current_amount || 0;
            const targetAmount = goal.targetAmount || goal.target_amount || 1;
            const progress = (currentAmount / targetAmount) * 100;
            const daysLeft = Math.ceil(
              (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
            );

            return (
              <Col md={6} lg={4} key={goal._id || goal.id} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5>{goal.title}</h5>
                      {goal.category && (
                        <Badge bg="info" className="text-capitalize">
                          {goal.category.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Progress</span>
                        <span className="fw-bold">{progress.toFixed(0)}%</span>
                      </div>
                      <ProgressBar
                        now={progress}
                        variant={progress >= 100 ? 'success' : 'primary'}
                      />
                    </div>
                    <div className="mb-2">
                      <strong>Current:</strong> ₹{parseFloat(currentAmount).toFixed(2)}
                    </div>
                    <div className="mb-2">
                      <strong>Target:</strong> ₹{parseFloat(targetAmount).toFixed(2)}
                    </div>
                    <div className="mb-3">
                      <strong>Deadline:</strong> {new Date(goal.deadline).toLocaleDateString()}
                      {daysLeft > 0 && (
                        <span className="text-muted ms-2">({daysLeft} days left)</span>
                      )}
                      {daysLeft <= 0 && (
                        <span className="text-danger ms-2">(Expired)</span>
                      )}
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleEdit(goal)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(goal._id || goal.id)}
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
          <Modal.Title>{editingGoal ? 'Edit' : 'Create'} Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Goal Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {goalCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Goal Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Emergency Fund"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Target Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="target_amount"
                value={formData.target_amount}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Current Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="current_amount"
                value={formData.current_amount}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                {editingGoal ? 'Update' : 'Create'} Goal
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

export default Goals;
