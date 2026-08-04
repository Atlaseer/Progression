import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Components/AuthContext';
import '../styles/Main.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const emptyExercise = () => ({ exercise: '', weight: '', reps: '', duration: '' });

const RegisterWorkoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [sets, setSets] = useState([emptyExercise()]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/exercises`)
      .then((res) => setExercises(res.data))
      .catch(() => setError('Failed to load exercises. Is the server running?'));
  }, []);

  const updateSet = (index, field, value) => {
    setSets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const addExercise = () => setSets((prev) => [...prev, emptyExercise()]);

  const removeExercise = (index) => setSets((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (sets.some((s) => !s.exercise)) {
      setError('Every exercise must be selected.');
      return;
    }

    const payload = sets.map((s) => ({
      exercise: s.exercise,
      ...(s.weight !== '' && { weight: Number(s.weight) }),
      ...(s.reps !== '' && { reps: Number(s.reps) }),
      ...(s.duration !== '' && { duration: Number(s.duration) }),
    }));

    try {
      setSubmitting(true);
      await axios.post(
        `${SERVER_URL}/api/workouts`,
        { sets: payload },
        { withCredentials: true }
      );
      navigate('/workouts');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save workout.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="workout-page">
        <div className="workout-form-card">
          <h1>Log a Workout</h1>
          <p>You must be <Link to="/login">signed in</Link> to log a workout.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-page">
      <div className="workout-form-card">
        <h1>Log a Workout</h1>

        {error && <p className="txt-error">{error}</p>}

        <form onSubmit={handleSubmit} className="workout-form">
          <div className="workout-exercise-list">
            <div className="workout-exercise-header">
              <span>Exercise</span>
              <span>Weight (kg)</span>
              <span>Reps</span>
              <span>Time (s)</span>
              <span />
            </div>

            {sets.map((set, index) => (
              <div key={index} className="workout-exercise-row">
                <select
                  value={set.exercise}
                  onChange={(e) => updateSet(index, 'exercise', e.target.value)}
                  required
                >
                  <option value="">Select…</option>
                  {exercises.map((ex) => (
                    <option key={ex._id} value={ex._id}>
                      {ex.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="—"
                  value={set.weight}
                  onChange={(e) => updateSet(index, 'weight', e.target.value)}
                />

                <input
                  type="number"
                  min="0"
                  placeholder="—"
                  value={set.reps}
                  onChange={(e) => updateSet(index, 'reps', e.target.value)}
                />

                <input
                  type="number"
                  min="0"
                  placeholder="—"
                  value={set.duration}
                  onChange={(e) => updateSet(index, 'duration', e.target.value)}
                />

                <button
                  type="button"
                  className="remove-set-btn"
                  onClick={() => removeExercise(index)}
                  aria-label="Remove exercise"
                  disabled={sets.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="add-set-btn" onClick={addExercise}>
            + Add Exercise
          </button>

          <button type="submit" className="submit-workout-btn" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Workout'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterWorkoutPage;
