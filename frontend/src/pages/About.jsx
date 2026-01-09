import { Container, Row, Col } from 'react-bootstrap';

function About() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1 className="mb-4 text-center" style={{ color: 'inherit' }}>About Smart Expense Tracker</h1>

          <div className="mb-4">
            <img
              src="https://images.pexels.com/photos/5716001/pexels-photo-5716001.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="About Us"
              className="img-fluid rounded shadow mb-4"
            />
          </div>

          <h3 className="text-primary mb-3">Our Mission</h3>
          <p className="lead text-muted mb-4">
            We believe everyone deserves financial clarity and control. Smart Expense Tracker
            was built to make personal finance management simple, intuitive, and accessible to everyone.
          </p>

          <h3 className="text-primary mb-3">What We Do</h3>
          <p className="text-muted mb-4">
            Our platform helps you track every dollar you spend, categorize your expenses,
            and gain insights into your spending habits. With powerful analytics and intuitive
            visualizations, you'll always know where your money is going.
          </p>

          <h3 className="text-primary mb-3">Our Values</h3>
          <ul className="text-muted">
            <li className="mb-2">
              <strong>Simplicity:</strong> We make complex financial tracking simple and intuitive.
            </li>
            <li className="mb-2">
              <strong>Privacy:</strong> Your financial data is yours. We use industry-leading security to keep it safe.
            </li>
            <li className="mb-2">
              <strong>Transparency:</strong> No hidden fees, no surprises. What you see is what you get.
            </li>
            <li className="mb-2">
              <strong>Empowerment:</strong> We give you the tools and insights to make better financial decisions.
            </li>
          </ul>

          <div className="mt-5 p-4 bg-light rounded" style={{ transition: 'background-color 0.3s ease' }}>
            <h4 className="mb-3" style={{ color: 'inherit' }}>Why Financial Tracking Matters</h4>
            <p className="text-muted mb-0">
              Studies show that people who actively track their expenses are 2x more likely to
              save money and achieve their financial goals. By understanding where your money goes,
              you can make informed decisions about your spending and saving habits.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
