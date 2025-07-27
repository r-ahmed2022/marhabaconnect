import React from 'react';

const HamburgerMenu = ({ isOpen, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      style={{
        fontSize: '4rem',
        color: '#fff',
        cursor: 'pointer',
        zIndex: 100,
      }}
    >
      <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} hamburger`}></i>
    </div>
  );
};

export default HamburgerMenu;