import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaPlus } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import { useAuth } from './AuthContext';
import logo from '../assets/progressionIcon.svg';

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Check screen width to determine if mobile view is needed
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync searchText with the URL search query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchText(params.get('search') || '');
  }, [location.search]);

  // Clear searchText on navigation via browser back/forward
  useEffect(() => {
    const unlisten = () => setSearchText('');
    window.addEventListener('popstate', unlisten);
    return () => window.removeEventListener('popstate', unlisten);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchText.trim()) {
        navigate(`/?search=${encodeURIComponent(searchText.trim())}`);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <header className="forum-header">
      <div className="forum-separate-part">
        <div className="forum-logo">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Progression Logo" className="logo-icon" />
            <h2>Progression</h2>
          </Link>
        </div>
      </div>

      <div>
        {isMobileView ? (
          <>
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <MobileMenu
              isOpen={isMobileMenuOpen}
              location={location}
              navigate={navigate}
              searchText={searchText}
              setSearchText={setSearchText}
              handleSearchKeyDown={handleSearchKeyDown}
            />
          </>
        ) : (
          <div className="forum-separate-part">
            <Navbar currentPath={location.pathname} />
          </div>
        )}
      </div>

      <div className="forum-user">
        {user ? (
          <div>
            <Link to="/newpost" className="auth-link"><FaPlus /> Create</Link>
            <UserMenu />
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-link">Sign In</Link>
            <Link to="/signup" className="auth-link">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
