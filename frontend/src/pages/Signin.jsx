import { useState } from 'react';
import { Container, Row, Col, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(loginData.email, loginData.password);

    if (error) {
      setToastVariant('danger');
      setToastMessage(error.message || 'Login failed. Please check your credentials.');
      setShowToast(true);
      setLoading(false);
    } else {
      setToastVariant('success');
      setToastMessage('Login successful!');
      setShowToast(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      setToastVariant('danger');
      setToastMessage('Passwords do not match!');
      setShowToast(true);
      return;
    }

    if (signupData.password.length < 6) {
      setToastVariant('danger');
      setToastMessage('Password must be at least 6 characters long.');
      setShowToast(true);
      return;
    }

    setLoading(true);

    const nameParts = signupData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const username = signupData.email.split('@')[0];
    
    const { error } = await signUp(signupData.email, signupData.password, username, firstName, lastName);

    if (error) {
      setToastVariant('danger');
      setToastMessage(error.message || 'Registration failed. Please try again.');
      setShowToast(true);
      setLoading(false);
    } else {
      setToastVariant('success');
      setToastMessage('Account created successfully!');
      setShowToast(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }
  };

  return (
    <div
      className={`auth-container ${isLogin ? 'login-mode' : 'signup-mode'}`}
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >
      <Container fluid className="px-0">
        <Row className="g-0" style={{ minHeight: '100vh', display: 'flex' }}>
          {/* Blue Panel - LEFT for Login, RIGHT for Signup */}
          <Col 
            md={6} 
            className="d-none d-md-flex align-items-center justify-content-center auth-left"
            style={{
              background: darkMode 
                ? 'linear-gradient(135deg, #0d2688ff 0%, #26054dff 100%)' 
                : 'linear-gradient(135deg, #5700c1ff 0%, #0056b3 100%)',
              position: 'relative',
              overflow: 'hidden',
              order: isLogin ? 1 : 2
            }}
          >
            {/* Curved Divider - curves RIGHT for Login (left panel), LEFT for Signup (right panel) */}
            <svg
              style={{
                position: 'absolute',
                [isLogin ? 'right' : 'left']: '-50px',
                top: 0,
                bottom: 0,
                width: '200px',
                height: '100%',
                zIndex: 1,
                transform: isLogin ? 'none' : 'scaleX(-1)'
              }}
              preserveAspectRatio="none"
              viewBox="0 0 200 100"
            >
              <path
                d="M 0,0 Q 100,50 0,100 L 0,100 L 200,100 L 200,0 Z"
                fill={darkMode ? '#1a1d29' : '#ffffff'}
              />
            </svg>
            <div className="text-center text-white px-4" style={{ position: 'relative', zIndex: 2 }}>
              <h2 className="mb-3" style={{ fontSize: '2rem', fontWeight: '700' }}>
                {isLogin ? 'New here?' : 'Already have an account?'}
              </h2>
              <p className="mb-4" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                {isLogin ? 'Then Sign up and start tracking!' : 'Login and continue tracking your finances.'}
              </p>
              <Button
                variant="outline-light"
                size="lg"
                onClick={() => setIsLogin((prev) => !prev)}
                style={{
                  borderRadius: '50px',
                  padding: '12px 40px',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  borderWidth: '2px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isLogin ? 'SIGN UP' : 'LOGIN'}
              </Button>
            </div>
          </Col>

          {/* Forms area - RIGHT for Login, LEFT for Signup (always white background) */}
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center auth-right"
            style={{
              background: darkMode ? '#1a1d29' : '#ffffff',
              padding: '3rem 2rem',
              minHeight: '100vh',
              position: 'relative',
              order: isLogin ? 2 : 1
            }}
          >
            <div style={{ width: '100%', maxWidth: '450px', position: 'relative', zIndex: 2 }}>
              <h1 
                className="mb-4" 
                style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700',
                  color: darkMode ? '#e0e0e0' : '#333'
                }}
              >
                {isLogin ? 'Sign in' : 'Sign up'}
              </h1>

              {/* LOGIN FORM */}
              {isLogin && (
                <Form onSubmit={handleLoginSubmit} className="auth-form auth-form-visible">
                  <Form.Group className="mb-3">
                    <div className="d-flex align-items-center mb-2" style={{ position: 'relative' }}>
                      <span 
                        style={{ 
                          position: 'absolute', 
                          left: '15px', 
                          fontSize: '1.2rem',
                          color: darkMode ? '#a0a0a0' : '#6c757d',
                          zIndex: 1
                        }}
                      >
                        👤
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="Email"
                        required
                        style={{
                          paddingLeft: '45px',
                          borderRadius: '10px',
                          height: '50px',
                          border: darkMode ? '1px solid #3a3f51' : '1px solid #dee2e6'
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="d-flex align-items-center mb-2" style={{ position: 'relative' }}>
                      <span 
                        style={{ 
                          position: 'absolute', 
                          left: '15px', 
                          fontSize: '1.2rem',
                          color: darkMode ? '#a0a0a0' : '#6c757d',
                          zIndex: 1
                        }}
                      >
                        🔒
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="Password"
                        required
                        style={{
                          paddingLeft: '45px',
                          borderRadius: '10px',
                          height: '50px',
                          border: darkMode ? '1px solid #3a3f51' : '1px solid #dee2e6'
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                    style={{
                      borderRadius: '10px',
                      height: '50px',
                      fontWeight: '600',
                      fontSize: '1rem',
                      background: darkMode 
                        ? 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)' 
                        : 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {loading ? 'Logging in...' : 'LOGIN'}
                  </Button>

                  <div className="text-center">
                    <a 
                      href="#" 
                      style={{ 
                        color: darkMode ? '#ffffff' : '#007bff',
                        textDecoration: 'none',
                        fontSize: '0.9rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      Forgot Password?
                    </a>
                  </div>
                </Form>
              )}
              
              {/* Signup CTA on right side when in login mode */}
              {isLogin && (
                <div className="text-center mt-4 d-md-none" style={{ position: 'relative', zIndex: 2 }}>
                  <p style={{ color: darkMode ? '#a0a0a0' : '#6c757d', marginBottom: '1rem' }}>
                    New here?
                  </p>
                  <Button
                    variant="outline-primary"
                    onClick={() => setIsLogin(false)}
                    style={{
                      borderRadius: '50px',
                      padding: '10px 30px',
                      fontWeight: '600'
                    }}
                  >
                    SIGN UP
                  </Button>
                </div>
              )}

              {/* SIGNUP FORM */}
              {!isLogin && (
                <Form onSubmit={handleSignupSubmit} className="auth-form auth-form-visible">
                  <Form.Group className="mb-3">
                    <div className="d-flex align-items-center mb-2" style={{ position: 'relative' }}>
                      <span 
                        style={{ 
                          position: 'absolute', 
                          left: '15px', 
                          fontSize: '1.2rem',
                          color: darkMode ? '#a0a0a0' : '#6c757d',
                          zIndex: 1
                        }}
                      >
                        👤
                      </span>
                      <Form.Control
                        type="text"
                        name="name"
                        value={signupData.name}
                        onChange={handleSignupChange}
                        placeholder="Full Name"
                        required
                        style={{
                          paddingLeft: '45px',
                          borderRadius: '10px',
                          height: '50px',
                          border: darkMode ? '1px solid #3a3f51' : '1px solid #dee2e6'
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="d-flex align-items-center mb-2" style={{ position: 'relative' }}>
                      <span 
                        style={{ 
                          position: 'absolute', 
                          left: '15px', 
                          fontSize: '1.2rem',
                          color: darkMode ? '#a0a0a0' : '#6c757d',
                          zIndex: 1
                        }}
                      >
                        📧
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        placeholder="Email"
                        required
                        style={{
                          paddingLeft: '45px',
                          borderRadius: '10px',
                          height: '50px',
                          border: darkMode ? '1px solid #3a3f51' : '1px solid #dee2e6'
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="d-flex align-items-center mb-2" style={{ position: 'relative' }}>
                      <span 
                        style={{ 
                          position: 'absolute', 
                          left: '15px', 
                          fontSize: '1.2rem',
                          color: darkMode ? '#a0a0a0' : '#6c757d',
                          zIndex: 1
                        }}
                      >
                        🔒
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        placeholder="Password"
                        required
                        style={{
                          paddingLeft: '45px',
                          borderRadius: '10px',
                          height: '50px',
                          border: darkMode ? '1px solid #3a3f51' : '1px solid #dee2e6'
                        }}
                      />
                    </div>
                    <Form.Text style={{ color: darkMode ? '#a0a0a0' : '#6c757d', fontSize: '0.85rem', marginLeft: '15px' }}>
                      Password must be at least 6 characters long.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="d-flex align-items-center mb-2" style={{ position: 'relative' }}>
                      <span 
                        style={{ 
                          position: 'absolute', 
                          left: '15px', 
                          fontSize: '1.2rem',
                          color: darkMode ? '#a0a0a0' : '#6c757d',
                          zIndex: 1
                        }}
                      >
                        🔒
                      </span>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        placeholder="Confirm Password"
                        required
                        style={{
                          paddingLeft: '45px',
                          borderRadius: '10px',
                          height: '50px',
                          border: darkMode ? '1px solid #3a3f51' : '1px solid #dee2e6'
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                    style={{
                      borderRadius: '10px',
                      height: '50px',
                      fontWeight: '600',
                      fontSize: '1rem',
                      background: darkMode 
                        ? 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)' 
                        : 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {loading ? 'Creating Account...' : 'SIGN UP'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: darkMode ? '#ffffff' : '#007bff',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      Already have an account? Sign in here
                    </button>
                  </div>
                </Form>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg={toastVariant}>
          <Toast.Header>
            <strong className="me-auto">{toastVariant === 'success' ? 'Success' : 'Error'}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Auth;

