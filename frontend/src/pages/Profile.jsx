import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      if (response.success) {
        setProfile(response.user);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToastVariant('danger');
      setToastMessage('Passwords do not match!');
      setShowToast(true);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setToastVariant('danger');
      setToastMessage('Password must be at least 6 characters long.');
      setShowToast(true);
      return;
    }

    try {
      const response = await apiClient.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.success) {
        setToastVariant('success');
        setToastMessage('Password updated successfully!');
        setShowToast(true);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error(response.message || 'Password update failed');
      }
    } catch (error) {
      setToastVariant('danger');
      setToastMessage(error.message || 'Password update failed');
      setShowToast(true);
    }
  };

  if (!profile) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Profile</h2>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Account Information</h5>
              <div className="mb-3">
                <strong>Name:</strong>
                <p className="text-muted">{profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.username || 'N/A'}</p>
              </div>
              <div className="mb-3">
                <strong>Username:</strong>
                <p className="text-muted">{profile.username || 'N/A'}</p>
              </div>
              <div className="mb-3">
                <strong>Email:</strong>
                <p className="text-muted">{profile.email}</p>
              </div>
              <div className="mb-3">
                <strong>Account Created:</strong>
                <p className="text-muted">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Change Password</h5>
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    required
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Update Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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

export default Profile;
