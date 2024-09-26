//'https://donate.stripe.com/test_8wM6so2Ix2jc8Qo3cc'
// src/components/AboutUs.js
import React from 'react';
import '../App.css'; // Optional: Use if you're using external CSS for styling.

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-header">
        <h1>About Us</h1>
        <p>Welcome to Our Company</p>
      </div>

      <div className="about-us-content">
        <section>
          <h2>Our Mission</h2>
          <p>
            We are dedicated to providing the best products and services to our customers. Our mission is to innovate and lead in our industry while delivering exceptional experiences.
          </p>
        </section>

        <section>
          <h2>Our Vision</h2>
          <p>
            Our vision is to be a globally recognized company that excels in providing unique and sustainable solutions for the future.
          </p>
        </section>

        <section>
          <h2>Our Team</h2>
          <p>
            We are a diverse group of professionals who are passionate about what we do. Together, we strive to make a positive impact on the world.
          </p>
        </section>
      </div>

      <div className="about-us-footer">
        <h3>Contact Us</h3>
        <p>Email: info@ourcompany.com</p>
        <p>Phone: (123) 456-7890</p>
      </div>
    </div>
  );
};

export default AboutUs;