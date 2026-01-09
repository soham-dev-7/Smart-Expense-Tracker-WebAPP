import { Navbar, Nav, Container, Button, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import logo from '../assets/logo.png';
import logoBlack from '../assets/logo_black.png';
import './Navbar.css';

function NavigationBar() {
  const { user, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Navbar
      bg={darkMode ? 'dark' : 'light'}
      variant={darkMode ? 'dark' : 'light'}
      expand="lg"
      className="custom-navbar shadow-sm"
      style={{
        background: darkMode
          ? 'linear-gradient(135deg, #1a1d29 0%, #252836 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderBottom: darkMode ? '1px solid #3a3f51' : '1px solid #e9ecef'
      }}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center brand-container"
          style={{
            textDecoration: 'none',
            // transition: 'transform 0.2s ease'
          }}
        // onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        // onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Image
            src={darkMode ? logoBlack : logoBlack}
            alt="Smart Expense Tracker Logo"
            className="navbar-logo me-2"
            style={{
              height: '60px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <div className="brand-text">
            <span
              className="brand-name fw-bold"
              style={{
                fontSize: '1.1rem',
                color: darkMode ? '#a855f7' : '#0056b3',
                letterSpacing: '0.5px',
                display: 'inline-block',
                fontWeight: '700'
              }}
            >
              Smart
            </span>
            <span className="brand-subtitle d-block" style={{
              fontSize: '0.6rem',
              color: darkMode ? '#a0a0a0' : '#6c757d',
              fontWeight: '500',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              Expense Tracker
            </span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{
            border: darkMode ? '1px solid #3a3f51' : '1px solid #dee2e6'
          }}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">
            {user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className="nav-link-custom"
                  style={{
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    borderRadius: '6px',
                    padding: '6px 12px'
                  }}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/transactions"
                  className="nav-link-custom"
                  style={{
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    borderRadius: '6px',
                    padding: '6px 12px'
                  }}
                >
                  Transactions
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/goals"
                  className="nav-link-custom"
                  style={{
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    borderRadius: '6px',
                    padding: '6px 12px'
                  }}
                >
                  Goals
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/bills"
                  className="nav-link-custom"
                  style={{
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    borderRadius: '6px',
                    padding: '6px 12px'
                  }}
                >
                  Bills
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  className="nav-link-custom"
                  style={{
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    borderRadius: '6px',
                    padding: '6px 12px'
                  }}
                >
                  Profile
                </Nav.Link>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="theme-toggle-btn"
                  style={{
                    border: darkMode ? '1px solid #3a3f51' : '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    transition: 'all 0.3s ease',
                    fontSize: '1.1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {darkMode ? '☀️' : '🌙'}
                </Button>
                <Nav.Link
                  as={Link}
                  to="/home">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleLogout}
                    style={{
                      borderRadius: '8px',
                      padding: '6px 16px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Logout
                  </Button>
                </Nav.Link>
              </>
            ) : (
              <>
                {/* Public navigation when user is not authenticated */}
                <Nav.Link
                  as={Link}
                  to="/home"
                  className="nav-link-custom"
                  style={{
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    borderRadius: '6px',
                    padding: '6px 12px'
                  }}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/about"
                  className="nav-link-custom"
                  style={{
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    borderRadius: '6px',
                    padding: '6px 12px'
                  }}
                >
                  About
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/contact"
                  className="nav-link-custom"
                  style={{
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    borderRadius: '6px',
                    padding: '6px 12px'
                  }}
                >
                  Contact
                </Nav.Link>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="theme-toggle-btn"
                  style={{
                    border: darkMode ? '1px solid #3a3f51' : '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    transition: 'all 0.3s ease',
                    fontSize: '1.1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {darkMode ? '☀️' : '🌙'}
                </Button>
                {/* Single Sign In button that leads to the Signin split-screen page */}
                <Nav.Link as={Link} to="/signin" className="px-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    style={{
                      borderRadius: '8px',
                      bordercolor: 'black',
                      padding: '6px 20px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      // border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Sign In
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
