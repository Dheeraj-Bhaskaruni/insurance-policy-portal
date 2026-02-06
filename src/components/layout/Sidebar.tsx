import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { useAppSelector } from '../../store/hooks';
import { ROUTES } from '../../utils/constants';

import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: '\u2302' },
  { path: ROUTES.POLICIES, label: 'Policies', icon: '\u2637' },
  { path: ROUTES.CLAIMS, label: 'Claims', icon: '\u2696' },
  { path: ROUTES.CUSTOMERS, label: 'Customers', icon: '\u263A' },
  { path: ROUTES.REPORTS, label: 'Reports', icon: '\u2261' },
  { path: ROUTES.SETTINGS, label: 'Settings', icon: '\u2699' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">IC</div>
          <span className="sidebar-brand-text">InsureCorp</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            if (
              (item.path === ROUTES.REPORTS || item.path === ROUTES.CUSTOMERS) &&
              user?.role === 'customer'
            )
              return null;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'active' : ''}`
                }
                end={item.path === '/'}
                onClick={onClose}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="sidebar-user-role">{user?.role}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
