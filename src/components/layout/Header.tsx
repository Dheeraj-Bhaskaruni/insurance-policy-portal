import React from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/authSlice';
import { selectCurrentUser } from '../../store/selectors';
import Button from '../ui/Button';

import './Header.css';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          &#9776;
        </button>
        <h2 className="header-welcome">
          Welcome back, <span className="header-username">{user?.firstName}</span>
        </h2>
      </div>
      <div className="header-right">
        <Button variant="ghost" size="sm" onClick={() => dispatch(logoutUser())}>
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default Header;
