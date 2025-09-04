import React from 'react';
import '../styles/Main.css';

const Footer = () => {
  return (
    <footer className="progression-footer">
      <p>&copy; {new Date().getFullYear()} Progression. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
