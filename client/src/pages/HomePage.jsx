import { Link, useNavigate } from 'react-router-dom';
import { FaDumbbell, FaListUl, FaInfoCircle, FaUserCircle, FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../Components/AuthContext';
import '../styles/Main.css';

const navCards = [
  { to: '/workouts', icon: <FaDumbbell />, label: 'Workouts', desc: 'Log and view your training sessions' },
  { to: '/exercises', icon: <FaListUl />, label: 'Exercises', desc: 'Browse the exercise library' },
];

const HomePage = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="homepage-container">
      <main className="homepage-main">
        <div className="home-nav-grid">
          {navCards.map(({ to, icon, label, desc }) => (
            <Link key={to} to={to} className="home-nav-card">
              <span className="home-nav-card-icon">{icon}</span>
              <span className="home-nav-card-label">{label}</span>
              <span className="home-nav-card-desc">{desc}</span>
            </Link>
          ))}

          <Link to={`/profile/${user?.username}`} className="home-nav-card">
            <span className="home-nav-card-icon"><FaUserCircle /></span>
            <span className="home-nav-card-label">{user?.username}</span>
            <span className="home-nav-card-desc">View your profile</span>
          </Link>

          {isAdmin && (
            <Link to="/admin" className="home-nav-card home-nav-card--admin">
              <span className="home-nav-card-icon"><FaUserShield /></span>
              <span className="home-nav-card-label">Admin</span>
              <span className="home-nav-card-desc">Manage users and content</span>
            </Link>
          )}

          <Link to="/about" className="home-nav-card">
            <span className="home-nav-card-icon"><FaInfoCircle /></span>
            <span className="home-nav-card-label">About</span>
            <span className="home-nav-card-desc">Learn more about Progression</span>
          </Link>

          <button onClick={handleSignOut} className="home-nav-card home-nav-card--signout">
            <span className="home-nav-card-icon"><FaSignOutAlt /></span>
            <span className="home-nav-card-label">Sign Out</span>
            <span className="home-nav-card-desc">See you next time</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
