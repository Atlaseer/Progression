import { Link } from 'react-router-dom';
import { FaPlus, FaListUl } from 'react-icons/fa';
import '../styles/Main.css';

const ExercisesPage = () => {
  return (
    <div className="homepage-container">
      <main className="homepage-main">
        <div className="home-nav-grid">
          <Link to="/exercises/new" className="home-nav-card">
            <span className="home-nav-card-icon"><FaPlus /></span>
            <span className="home-nav-card-label">Add Exercise</span>
            <span className="home-nav-card-desc">Create a new exercise</span>
          </Link>
          <Link to="/exercises/list" className="home-nav-card">
            <span className="home-nav-card-icon"><FaListUl /></span>
            <span className="home-nav-card-label">View Exercises</span>
            <span className="home-nav-card-desc">Browse the exercise library</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ExercisesPage;
