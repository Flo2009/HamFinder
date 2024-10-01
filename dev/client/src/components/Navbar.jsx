import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import logo from '../assets/images/logo.png'
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import Auth from '../utils/auth';
import { loadStripe } from '@stripe/stripe-js';
import { calculateTotalDonations } from '../utils/donationCalculation';
import { useQuery } from '@apollo/client';
import { ME_DONATION, GET_TOTAL_DONATIONS } from '../utils/queries';
// import { Elements, useStripe, useElement, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_8wM6so2Ix2jc8Qo3cc')

const AppNavbar = ({ isDarkMode, setIsDarkMode }) => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);
  const isLoggedIn = Auth.loggedIn(); 

  const { loading: userLoading, error: userError, data: userData, refetch } = useQuery(ME_DONATION, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only', // Ensure fresh data on every request
  });
  // Fetch the total donation amount
  const { loading: totalLoading, error: totalError, data: totalData } = useQuery(GET_TOTAL_DONATIONS);
  // Inside your component
  const navigate = useNavigate();

  const handleHomeClick = (event) => {
    event.preventDefault();
    navigate('/');  // Navigate to the home page
    window.location.reload(); // Force page refresh
  };
  console.log(userData);

  // Re-fetch the donation data on page redirect or load
  useEffect(() => {
    if (isLoggedIn) {
      refetch();  // Refetch the user data whenever the component is mounted
    }
  }, [refetch, isLoggedIn]);

  // Check if data exists and user is defined
  // const user = data ? data.me : null;
  // const totalDonated = user && user.donated ? calculateTotalDonations(user.donationAmount) : 0;

  let totalDonatedByUser = 0;
  if (isLoggedIn && userData && userData.me.donated) {
    totalDonatedByUser = calculateTotalDonations(userData.me.donationAmount);
  }

  let totalDonations = 0;
  if (totalData && totalData.allDonations) {
    totalDonations = totalData.allDonations;
  }
  
  return (
    <>
      <Navbar className={`navbar my-custom-navbar ${isDarkMode ? 'dark-mode' : ''}`} bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          <Navbar.Brand 
            className="hamfinder-custom" // Add inline styles
            onClick={handleHomeClick} // Trigger page refresh
          >
            {/* Add the logo image */}
            <img
              src={logo}
              alt="HamFinder Logo"
              style={{ width: '40px', height: '40px', marginRight: '10px' }}
              id="hamfinder-logo"
            />
            <span className="hamfinder-ham">Ham</span><span className="hamfinder-finder">Finder</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
            <Nav className='ml-auto d-flex'>
              <Nav.Link as={Link} to='/aboutus'>
                About
              </Nav.Link>
              {/* if user is logged in show saved stations and logout */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to='/donate'>{/* https://donate.stripe.com/test_8wM6so2Ix2jc8Qo3cc */}
                    Donate
                  </Nav.Link>
                  <Nav.Link as={Link} to='/saved'>
                    My Ham
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                  {userData && userData.me.donated && (
                    <div className="navbar-donation">
                      <span>Donated Ham: ${totalDonatedByUser}</span>
                    </div>
                  )}
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
              )}
               {/* Display total donations across all users */}
               {!totalLoading && !totalError && (
                <div className="navbar-donation">
                  <span>Total Ham: ${totalDonations}</span>
                </div>
              )}
              {/* Dark Mode Toggle Button */}
              <div
                className={`analog-switch ${isDarkMode ? 'dark' : ''}`}
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                <span className="switch-knob"></span>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* set modal data up */}
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
