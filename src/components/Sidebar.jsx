import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Receipt,
  LogOut,
  X,
  Package
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, admin } = useAdminAuth();

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/products', name: 'Products', icon: ShoppingBag },
    { path: '/dashboard/users', name: 'Users', icon: Users },
    { path: '/dashboard/orders', name: 'Orders', icon: Receipt },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <Package className="brand-icon" size={26} />
            <span className="brand-text">Apex <span className="highlight">Admin</span></span>
          </div>
          <button className="close-sidebar-btn" onClick={() => setIsOpen(false)} aria-label="Close Sidebar">
            <X size={20} />
          </button>
        </div>

        <div className="admin-profile-box">
          <div className="avatar">
            {admin?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="profile-info">
            <h4 className="profile-name">{admin?.name || 'Admin'}</h4>
            <span className="profile-role">Administrator</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setIsOpen(false)}
              >
                <Icon className="nav-icon" size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <LogOut className="nav-icon" size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
