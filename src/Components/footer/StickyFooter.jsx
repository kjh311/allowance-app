import React from 'react';

const StickyFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', backgroundColor: '#3C81F6', padding: '10px 0', color: 'white' }}>
      <p>&copy; <a href="https://kjh311.github.io/new_portfolio/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid white' }}>Kevin Huelsmann</a> {currentYear}</p>
    </footer>
  );
};

export default StickyFooter;
