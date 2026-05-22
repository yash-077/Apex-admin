import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Menu, LogOut, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Topbar = ({ setIsOpen }) => {
  const { logout, admin } = useAdminAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard Overview';
    if (path.startsWith('/dashboard/products')) return 'Products Management';
    if (path.startsWith('/dashboard/users')) return 'User Signups';
    if (path.startsWith('/dashboard/orders')) return 'Real-time Orders';
    return 'Admin Panel';
  };

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button
          className="menu-toggle-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open Sidebar"
        >
          <Menu size={22} />
        </button>
        <span className="topbar-page-title">{getPageTitle()}</span>
      </div>

      <div className="topbar-right">
        <div className="admin-user-badge">
          <div className="user-avatar-mini">
            {admin?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="admin-username">{admin?.name || 'Administrator'}</span>
        </div>
        <button className="topbar-logout-btn" onClick={logout} title="Sign Out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
