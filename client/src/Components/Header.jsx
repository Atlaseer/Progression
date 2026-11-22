import { Link } from 'react-router-dom';
import logo from '../assets/progressionIcon.svg';

const Header = () => {
  return (
    <header className="forum-header">
      <div className="forum-logo">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Progression Logo" className="logo-icon" />
          <h2>Progression</h2>
        </Link>
      </div>
    </header>
  );
};

export default Header;
