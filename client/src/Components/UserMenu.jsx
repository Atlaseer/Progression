import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const UserMenu = () =>
{
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => 
    {
        await logout();
        setOpen(false);
        navigate('/');
    }, [logout, navigate]);

    useEffect(() => 
    {
        const handleOutsideClick = (e) => 
        {
            if(menuRef.current && !menuRef.current.contains(e.target))
            {
                setOpen(false);
            }
        };
        const handleEscape = (e) => 
        {
            if (e.key === 'Escape') setOpen(false);
        };
        if (open) 
        {
            document.addEventListener('mousedown', handleOutsideClick);
            document.addEventListener('keydown', handleEscape);
        }
        return () => 
        {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    return (
    <div className="user-dropdown-wrapper" ref={menuRef}>
      <button
        className="user-dropdown-button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        tabIndex={0}
      >
        <FaUserCircle className="user-icon" />
        <span className="user-name">{user?.username}</span>
        <FaChevronDown className="dropdown-chevron" />
      </button>

      {open && (
        <div className="user-dropdown-menu" role="menu">
          <Link to={`/profile/${user?.username}`} onClick={() => setOpen(false)} role="menuitem" tabIndex={0}>
            Profile
          </Link>
          <button onClick={handleLogout} role="menuitem" tabIndex={0}>Sign Out</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
