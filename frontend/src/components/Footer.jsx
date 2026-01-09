import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import logo from '../assets/logo.png';
import logoBlack from '../assets/logo_black.png';

function Footer() {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Newsletter subscription logic here
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  const topCategories = [
    'Dashboard',
    'Transactions',
    'Goals',
    'Bills',
  ];

  const importantLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/signin', label: 'Sign In' }
  ];

  return (
    <footer
      className="footer-modern mt-5"
      style={{
        background: darkMode
          ? 'linear-gradient(135deg, #1a1d29 0%, #252836 100%)'
          : 'linear-gradient(135deg,rgb(0, 20, 40) 0%,rgb(67, 0, 135) 100%)',
        color: '#ffffff',
        paddingTop: '3rem',
        paddingBottom: '0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorative patterns */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translateY(-50%)'
        }}
      />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Row - Four Columns */}
        <Row className="mb-5">
          {/* Column 1: Branding and Contact Info */}
          <Col xs={12} sm={6} md={6} lg={3} className="mb-4 mb-lg-0">
            <div className="d-flex align-items-center mb-3">
              <img
                src={darkMode ? logoBlack : logoBlack}
                alt="Smart Expense Tracker"
                style={{ height: '60px', width: 'auto', marginRight: '0.75rem' }}
                className="img-fluid"
              />
              <h5 className="mb-0" style={{ color: '#ffffff', fontWeight: '700', fontSize: '1.1rem' }}>
                Smart Expense Tracker
              </h5>
            </div>
            <p className="small mb-4" style={{ color: '#b0b0b0', lineHeight: '1.6', fontSize: '0.875rem' }}>
              Manage your finances with ease and confidence. Track expenses, set goals, and achieve financial freedom.
            </p>
            <div className="d-flex align-items-start mb-2">
              <span style={{ marginRight: '10px', fontSize: '1.2rem', flexShrink: 0 }}>📞</span>
              <div>
                <h6 style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Contact Information
                </h6>
                <p className="small mb-1" style={{ color: '#b0b0b0', wordBreak: 'break-word' }}>
                  support@smartexpensetracker.com
                </p>
                <p className="small mb-0" style={{ color: '#b0b0b0' }}>
                  +91 90286 00528
                </p>
              </div>
            </div>
          </Col>

          {/* Column 2: Top Categories */}
          <Col xs={12} sm={6} md={6} lg={3} className="mb-4 mb-lg-0">
            <h6
              style={{
                color: '#ffffff',
                fontWeight: '600',
                marginBottom: '1rem',
                marginLeft: '7rem',
                fontSize: '1rem'
              }}
            >
              Top Categories
            </h6>
            <div
              style={{
                width: '40px',
                height: '2px',
                background: '#007bff',
                marginLeft: '8rem',
                marginBottom: '1.5rem'
              }}
            />
            <ul className="list-unstyled">
              {topCategories.map((category, index) => (
                <li key={index} className="mb-2">
                  <Link
                    to={category === 'Dashboard' ? '/signin' :
                        category === 'Transactions' ? '/signin' :
                        category === 'Goals' ? '/signin' :
                          category === 'Bills' ? '/signin' : '#'}
                    style={{
                      color: '#b0b0b0',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      marginLeft: '8rem',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = '#b0b0b0'}
                    className="d-inline-block"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Column 3: Important Links */}
          <Col xs={12} sm={6} md={6} lg={3} className="mb-4 mb-lg-0">
            <h6
              style={{
                color: '#ffffff',
                fontWeight: '600',
                marginBottom: '1rem',
                marginLeft: '7rem',
                fontSize: '1rem'
              }}
            >
              Quick Links
            </h6>
            <div
              style={{
                width: '40px',
                height: '2px',
                background: '#007bff',
                marginLeft: '8rem',
                marginBottom: '1.5rem'
              }}
            />
            <ul className="list-unstyled">
              {importantLinks.map((link, index) => (
                <li key={index} className="mb-2">
                  <Link
                    to={link.path}
                    style={{
                      color: '#b0b0b0',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      marginLeft: '8rem',
                      transition: 'color 0.3s ease',
                      textTransform: 'capitalize'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = '#b0b0b0'}
                    className="d-inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Column 4: Newsletter */}
          <Col xs={12} sm={6} md={12} lg={3} className="mb-4 mb-lg-0">
            <h6
              style={{
                color: '#ffffff',
                fontWeight: '600',
                marginBottom: '1rem',
                marginLeft: '7rem',
                fontSize: '1rem'
              }}
            >
              Newsletter
            </h6>
            <div
              style={{
                width: '40px',
                height: '2px',
                background: '#007bff',
                marginLeft: '8rem',
                marginBottom: '1.5rem'
              }}
            />
            <p className="small mb-3" style={{ color: '#b0b0b0', lineHeight: '1.6', fontSize: '0.875rem' }}>
              Enter your email to receive our latest updates about our products and features.
            </p>
            <Form onSubmit={handleNewsletterSubmit}>
              <div className="d-flex flex-column flex-sm-row gap-2">
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    background: darkMode ? '#2d3142' : '#34495e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    borderRadius: '5px',
                    flex: '1 1 auto'
                  }}
                />
                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    borderRadius: '5px',
                    background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                    border: 'none',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}
                  className="w-100 w-sm-auto"
                >
                  Subscribe
                </Button>
              </div>
            </Form>
          </Col>
        </Row>

      </Container>

      {/* Bottom Row - Copyright and Social Media - Full Width Black Background */}
      <div
        style={{
          backgroundColor: '#000738ff',
          width: '100%',
          padding: '1.5rem 0',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          marginTop: '2rem'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={8} className="mb-3 mb-md-0 text-center text-md-start">
              <p className="small mb-0" style={{ color: '#b0b0b0', fontSize: '0.875rem' }}>
                © {new Date().getFullYear()} Smart Expense Tracker. All Rights Reserved.
              </p>
            </Col>

            <Col xs={12} md={4} className="text-center text-md-end">
              <div className="d-flex align-items-center justify-content-center justify-content-md-end gap-3 flex-wrap">
                <span className="small" style={{ color: '#b0b0b0' }}>Follow Us:</span>
                <div className="d-flex gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#b0b0b0', fontSize: '1.5rem', textDecoration: 'none', transition: 'color 0.3s ease', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={(e) => e.target.style.color = '#1877F2'}
                    onMouseLeave={(e) => e.target.style.color = '#b0b0b0'}
                    aria-label="Facebook"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#b0b0b0', fontSize: '1.5rem', textDecoration: 'none', transition: 'color 0.3s ease', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={(e) => e.target.style.color = '#1DA1F2'}
                    onMouseLeave={(e) => e.target.style.color = '#b0b0b0'}
                    aria-label="Twitter"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#b0b0b0', fontSize: '1.5rem', textDecoration: 'none', transition: 'color 0.3s ease', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={(e) => e.target.style.color = '#E4405F'}
                    onMouseLeave={(e) => e.target.style.color = '#b0b0b0'}
                    aria-label="Instagram"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
