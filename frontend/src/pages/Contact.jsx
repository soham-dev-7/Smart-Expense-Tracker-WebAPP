import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Toast, ToastContainer } from 'react-bootstrap';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="text-center mb-5">
            <h1 className="mb-3" style={{ color: 'inherit', fontWeight: '700', fontSize: '2.5rem' }}>Contact Us</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <Row className="g-4">
            <Col md={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm contact-card" style={{
                borderRadius: '15px',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)'
              }}>
                <Card.Body className="p-4">
                  <h4 className="text-primary mb-4" style={{ fontWeight: '600' }}>Get in Touch</h4>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message..."
                        required
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 contact-submit-btn"
                      style={{
                        borderRadius: '50px',
                        padding: '12px',
                        fontWeight: '600',
                        fontSize: '1rem',
                        boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Send Message
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm contact-card" style={{
                borderRadius: '15px',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.03) 0%, rgba(25, 135, 84, 0.03) 100%)'
              }}>
                <Card.Body className="p-4">
                  <h4 className="text-primary mb-4" style={{ fontWeight: '600' }}>Contact Information</h4>

                  <div className="mb-4 contact-info-item">
                    <h6 className="fw-bold mb-2" style={{ fontSize: '1rem', color: 'inherit' }}>📧 Email</h6>
                    <p className="text-muted mb-0">support@smartexpensetracker.com</p>
                  </div>

                  <div className="mb-4 contact-info-item">
                    <h6 className="fw-bold mb-2" style={{ fontSize: '1rem', color: 'inherit' }}>📱 Phone</h6>
                    <p className="text-muted mb-0">+91 90286 00528</p>
                  </div>

                  <div className="mb-4 contact-info-item">
                    <h6 className="fw-bold mb-2" style={{ fontSize: '1rem', color: 'inherit' }}>🕐 Business Hours</h6>
                    <p className="text-muted mb-0">
                      Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>

                  <div className="contact-info-item">
                    <h6 className="fw-bold mb-2" style={{ fontSize: '1rem', color: 'inherit' }}>🏢 Office</h6>
                    <p className="text-muted mb-0">
                      Gharda Foundation's<br />
                      Gharda Institute of Technology<br />
                      Lavel, Khed, Ratnagiri - 415708
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="success">
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Message sent successfully! We'll get back to you soon.</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default Contact;
