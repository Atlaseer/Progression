import { Link } from 'react-router-dom';
import { FaPlus, FaListUl } from 'react-icons/fa';
import '../styles/Main.css';

const WorkoutsPage = () => {
  return (
    <div className="homepage-container">
      <main className="homepage-main">
        <div className="home-nav-grid">
          <Link to="/workouts/new" className="home-nav-card">
            <span className="home-nav-card-icon"><FaPlus /></span>
            <span className="home-nav-card-label">Log Workout</span>
            <span className="home-nav-card-desc">Record a new training session</span>
          </Link>
          <Link to="/workouts/list" className="home-nav-card">
            <span className="home-nav-card-icon"><FaListUl /></span>
            <span className="home-nav-card-label">View Workouts</span>
            <span className="home-nav-card-desc">Browse your workout history</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default WorkoutsPage;
