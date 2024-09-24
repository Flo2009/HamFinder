import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab, Button } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import Auth from '../utils/auth';

const AppNavbar = ({ isDarkMode, setIsDarkMode }) => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

const handleHomeClick = (event) => {
  event.preventDefault();  // Prevent default link behavior
  window.location.reload(); // Force page refresh
};

  return (
    <>
      <Navbar className={`navbar my-custom-navbar ${isDarkMode ? 'dark-mode' : ''}`} bg='dark' variant='dark' expand='lg'>
        <Container fluid>
        <Navbar.Brand 
          className="hamfinder-custom" // Add inline styles
          onClick={handleHomeClick} // Trigger page refresh
        >
          <span className="hamfinder-ham">Ham</span><span className="hamfinder-finder">Finder</span>
        </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
            <Nav className='ml-auto d-flex'>
              <Nav.Link as={Link} to='/'>
                About
              </Nav.Link>
              {/* if user is logged in show saved stations and logout */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to='/'>
                    Donate
                  </Nav.Link>
                  <Nav.Link as={Link} to='/saved'>
                    My Ham
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
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
