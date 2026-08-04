import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Components/AuthContext';
import '../styles/Main.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const ViewWorkoutsPage = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    axios
      .get(`${SERVER_URL}/api/workouts/me`, { withCredentials: true })
      .then((res) => setWorkouts(res.data))
      .catch(() => setError('Failed to load workouts.'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${SERVER_URL}/api/workouts/${id}`, { withCredentials: true });
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    } catch {
      setError('Failed to delete workout.');
    }
  };

  if (!user) {
    return (
      <div className="view-workouts-container">
        <main className="view-workouts-main">
          <h1>Workouts</h1>
          <p>Please <Link to="/login">sign in</Link> to view your workouts.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="view-workouts-container">
      <main className="view-workouts-main">
        <div className="workouts-header">
          <h1>Workouts</h1>
          <Link to="/workouts/new" className="auth-link">+ Log Workout</Link>
        </div>

        {error && <p className="txt-error">{error}</p>}

        {loading ? (
          <p>Loading…</p>
        ) : workouts.length === 0 ? (
          <p className="workouts-empty">No workouts logged yet. <Link to="/workouts/new">Log your first one!</Link></p>
        ) : (
          <ul className="workout-list">
            {workouts.map((workout) => (
              <li key={workout._id} className="workout-card">
                <div className="workout-card-header">
                  <span className="workout-date">
                    {new Date(workout.createdAt).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <button
                    className="delete-workout-btn"
                    onClick={() => handleDelete(workout._id)}
                    aria-label="Delete workout"
                  >
                    Delete
                  </button>
                </div>

                <table className="workout-sets-table">
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Weight (kg)</th>
                      <th>Reps</th>
                      <th>Time (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workout.sets.map((set, i) => (
                      <tr key={i}>
                        <td>{set.exercise?.name ?? '—'}</td>
                        <td>{set.weight ?? '—'}</td>
                        <td>{set.reps ?? '—'}</td>
                        <td>{set.duration ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default ViewWorkoutsPage;
