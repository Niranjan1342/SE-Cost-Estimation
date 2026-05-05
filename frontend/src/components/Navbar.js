import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h2 className="navbar-title">AI Estimation Dashboard</h2>
      </div>
      <div className="navbar-right">
        <div className="user-profile">
          <User size={20} />
          <span>{userName}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
