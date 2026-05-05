import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, GitCompare, History, Calculator } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <Calculator size={28} className="brand-icon" />
        <h2>SE-Estimator</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/compare" className={({ isActive }) => (isActive ? 'active' : '')}>
            <GitCompare size={20} />
            <span>Compare</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : '')}>
            <History size={20} />
            <span>History</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
