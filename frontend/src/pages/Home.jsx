import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import banner01 from '../assets/banner-01.jpg';
import banner02 from '../assets/banner-02.jpg';
import banner03 from '../assets/banner-03.jpg';
import Signin from '../pages/Signin';

function Home() {
  const banners = [banner01, banner02, banner03];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div>
      <Container fluid className="px-0">
        <div 
          className="hero-section text-white text-center py-5"
          style={{
            position: 'relative',
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Banner Slider Background */}
          {banners.map((banner, index) => (
            <img
              key={index}
              src={banner}
              alt={`Banner ${index + 1}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: index === currentIndex ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                zIndex: 0
              }}
            />
          ))}
          {/* Dark overlay for better text readability */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 1
            }}
          />
          {/* Text Content */}
          <Container style={{ position: 'relative', zIndex: 2 }}>
            <Row className="justify-content-center">
              <Col lg={8}>
                <h1 className="display-3 fw-bold mb-4">Manage Your Money with Ease</h1>
                <p className="lead mb-4">
                  Take control of your finances with our smart expense tracking solution.
                  Track expenses, set goals, and achieve financial freedom.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button 
                    as={Link} 
                    to="/Signin" 
                    className="hero-btn-primary"
                    size="lg"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      padding: '12px 40px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      borderRadius: '50px',
                      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get Started
                  </Button>
                  {/* <Button 
                    as={Link} 
                    to="/login" 
                    className="hero-btn-secondary"
                    size="lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.5)',
                      color: 'white',
                      padding: '12px 40px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      borderRadius: '50px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Login
                  </Button> */}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Container>

      <Container className="py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="mb-4" style={{ color: 'inherit' }}>Why Choose Smart Expense Tracker?</h2>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={4}>
            <div className="feature-card p-4 h-100 border rounded shadow-sm" style={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              borderColor: 'rgba(102, 126, 234, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <div className="feature-icon text-primary mb-3" style={{ fontSize: '3rem' }}>📊</div>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Visual Analytics</h4>
              <p className="text-muted">
                Beautiful charts and graphs help you understand your spending patterns at a glance.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-card p-4 h-100 border rounded shadow-sm" style={{
              background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.05) 0%, rgba(25, 135, 84, 0.05) 100%)',
              borderColor: 'rgba(40, 167, 69, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <div className="feature-icon text-success mb-3" style={{ fontSize: '3rem' }}>🎯</div>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Goal Tracking</h4>
              <p className="text-muted">
                Set financial goals and track your progress towards achieving them.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-card p-4 h-100 border rounded shadow-sm" style={{
              background: 'linear-gradient(135deg, rgba(0, 123, 255, 0.05) 0%, rgba(13, 110, 253, 0.05) 100%)',
              borderColor: 'rgba(0, 123, 255, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <div className="feature-icon text-info mb-3" style={{ fontSize: '3rem' }}>💳</div>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Bill Management</h4>
              <p className="text-muted">
                Never miss a payment with our recurring bill tracking and reminders.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="mt-5 py-5 bg-light rounded cta-section" style={{ 
          transition: 'background-color 0.3s ease',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <Col md={6} className="d-flex align-items-center">
            <div>
              <h3 className="mb-3" style={{ color: 'inherit', fontWeight: '700', marginLeft: '1rem' }}>Start Your Financial Journey Today 💰</h3>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem', marginLeft: '1rem' }}>
                Join thousands of users who have taken control of their finances.
                It's free to get started and takes less than a minute to sign up.
              </p>
              <Button 
                as={Link} 
                to="/Signin" 
                variant="outline-primary" 
                size="lg"
                className="cta-button"
                style={{
                  borderRadius: '50px',
                  padding: '12px 35px',
                  fontWeight: '600',
                  marginLeft: '1rem',
                  boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                Create Free Account
              </Button>
            </div>
          </Col>
          <Col md={6} className="d-flex align-items-center justify-content-center">
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Financial Planning"
                className="img-fluid rounded shadow"
                style={{ 
                  maxHeight: '300px', 
                  objectFit: 'cover',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
