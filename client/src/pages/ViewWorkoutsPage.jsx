import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Components/AuthContext';
import '../styles/Main.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const emptySet = () => ({ exercise: '', weight: '', reps: '' });

const toISO = (date, time) => new Date(`${date}T${time}`).toISOString();

// "2024-05-10T14:30:00.000Z" → "14:30"
const toTimeValue = (iso) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });

// "2024-05-10T14:30:00.000Z" → "2024-05-10"
const toDateValue = (iso) => new Date(iso).toISOString().slice(0, 10);

const durationMinutes = (start, end) => {
  if (!start || !end) return null;
  const diff = Math.round((new Date(end) - new Date(start)) / 60000);
  return diff > 0 ? diff : null;
};

const formatDuration = (minutes) =>
  Math.floor(minutes / 60) > 0
    ? `${Math.floor(minutes / 60)}h ${minutes % 60}min`
    : `${minutes} min`;

const ViewWorkoutsPage = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    axios.get(`${SERVER_URL}/api/workouts/me`, { withCredentials: true })
      .then((res) => setWorkouts(res.data))
      .catch(() => setError('Failed to load workouts.'))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    axios.get(`${SERVER_URL}/api/exercises`)
      .then((res) => setExercises(res.data))
      .catch(() => {});
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${SERVER_URL}/api/workouts/${id}`, { withCredentials: true });
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    } catch {
      setError('Failed to delete workout.');
    }
  };

  const startEdit = (workout) => {
    setEditingId(workout._id);
    setEditError('');
    const base = workout.startTime ?? workout.createdAt;
    setEditForm({
      date: toDateValue(base),
      startTime: workout.startTime ? toTimeValue(workout.startTime) : '',
      endTime: workout.endTime ? toTimeValue(workout.endTime) : '',
      sets: workout.sets.map((s) => ({
        exercise: s.exercise?._id ?? s.exercise,
        weight: s.weight ?? '',
        reps: s.reps ?? '',
      })),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
    setEditError('');
  };

  const updateEditSet = (index, field, value) =>
    setEditForm((prev) => ({
      ...prev,
      sets: prev.sets.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));

  const addEditSet = () =>
    setEditForm((prev) => ({ ...prev, sets: [...prev.sets, emptySet()] }));

  const removeEditSet = (index) =>
    setEditForm((prev) => ({ ...prev, sets: prev.sets.filter((_, i) => i !== index) }));

  const handleEditSave = async (workoutId) => {
    setEditError('');
    if (editForm.sets.some((s) => !s.exercise)) {
      setEditError('Every exercise must be selected.');
      return;
    }

    const sets = editForm.sets.map((s) => ({
      exercise: s.exercise,
      ...(s.weight !== '' && { weight: Number(s.weight) }),
      ...(s.reps !== '' && { reps: Number(s.reps) }),
    }));

    const body = {
      sets,
      date: editForm.date,
      ...(editForm.startTime && { startTime: toISO(editForm.date, editForm.startTime) }),
      ...(editForm.endTime && { endTime: toISO(editForm.date, editForm.endTime) }),
    };

    try {
      setEditSubmitting(true);
      const res = await axios.patch(
        `${SERVER_URL}/api/workouts/${workoutId}`,
        body,
        { withCredentials: true }
      );
      setWorkouts((prev) => prev.map((w) => w._id === workoutId ? res.data.workout : w));
      cancelEdit();
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to save changes.');
    } finally {
      setEditSubmitting(false);
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
            {workouts.map((workout) => {
              const duration = durationMinutes(workout.startTime, workout.endTime);

              return editingId === workout._id ? (
                <li key={workout._id} className="workout-card">
                  {editError && <p className="txt-error">{editError}</p>}

                  <div className="workout-edit-meta">
                    <div className="workout-date-row">
                      <label htmlFor={`edit-date-${workout._id}`}>Date</label>
                      <input
                        id={`edit-date-${workout._id}`}
                        type="date"
                        value={editForm.date}
                        max={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))}
                      />
                    </div>

                    <div className="workout-time-row">
                      <div className="workout-date-row">
                        <label htmlFor={`edit-start-${workout._id}`}>Start</label>
                        <input
                          id={`edit-start-${workout._id}`}
                          type="time"
                          value={editForm.startTime}
                          onChange={(e) => setEditForm((p) => ({ ...p, startTime: e.target.value }))}
                        />
                      </div>
                      <div className="workout-date-row">
                        <label htmlFor={`edit-end-${workout._id}`}>End</label>
                        <input
                          id={`edit-end-${workout._id}`}
                          type="time"
                          value={editForm.endTime}
                          onChange={(e) => setEditForm((p) => ({ ...p, endTime: e.target.value }))}
                        />
                      </div>
                      {editForm.startTime && editForm.endTime && (() => {
                        const d = durationMinutes(
                          toISO(editForm.date, editForm.startTime),
                          toISO(editForm.date, editForm.endTime)
                        );
                        return d !== null
                          ? <span className="workout-duration-unit">{formatDuration(d)}</span>
                          : null;
                      })()}
                    </div>
                  </div>

                  <div className="workout-exercise-list">
                    <div className="workout-exercise-header">
                      <span>Exercise</span>
                      <span>Weight (kg)</span>
                      <span>Reps</span>
                      <span />
                    </div>
                    {editForm.sets.map((set, index) => (
                      <div key={index} className="workout-exercise-row">
                        <select
                          value={set.exercise}
                          onChange={(e) => updateEditSet(index, 'exercise', e.target.value)}
                          required
                        >
                          <option value="">Select…</option>
                          {exercises.map((ex) => (
                            <option key={ex._id} value={ex._id}>{ex.name}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="—"
                          value={set.weight}
                          onChange={(e) => updateEditSet(index, 'weight', e.target.value)}
                        />
                        <input
                          type="number"
                          min="0"
                          placeholder="—"
                          value={set.reps}
                          onChange={(e) => updateEditSet(index, 'reps', e.target.value)}
                        />
                        <button
                          type="button"
                          className="remove-set-btn"
                          onClick={() => removeEditSet(index)}
                          aria-label="Remove exercise"
                          disabled={editForm.sets.length === 1}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="workout-edit-actions">
                    <button type="button" className="add-set-btn" onClick={addEditSet}>
                      + Add Exercise
                    </button>
                    <div className="workout-edit-buttons">
                      <button
                        type="button"
                        className="submit-workout-btn"
                        onClick={() => handleEditSave(workout._id)}
                        disabled={editSubmitting}
                      >
                        {editSubmitting ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        type="button"
                        className="cancel-edit-btn"
                        onClick={cancelEdit}
                        disabled={editSubmitting}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={workout._id} className="workout-card">
                  <div className="workout-card-header">
                    <div className="workout-card-meta">
                      <span className="workout-date">
                        {new Date(workout.startTime ?? workout.createdAt).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {workout.startTime && (
                        <span className="workout-duration">
                          {toTimeValue(workout.startTime)}
                          {workout.endTime && ` – ${toTimeValue(workout.endTime)}`}
                          {duration !== null && ` (${formatDuration(duration)})`}
                        </span>
                      )}
                    </div>
                    <div className="workout-card-actions">
                      <button
                        className="edit-workout-btn"
                        onClick={() => startEdit(workout)}
                        aria-label="Edit workout"
                      >
                        Edit
                      </button>
                      <button
                        className="delete-workout-btn"
                        onClick={() => handleDelete(workout._id)}
                        aria-label="Delete workout"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <table className="workout-sets-table">
                    <thead>
                      <tr>
                        <th>Exercise</th>
                        <th>Weight (kg)</th>
                        <th>Reps</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workout.sets.map((set, i) => (
                        <tr key={i}>
                          <td>{set.exercise?.name ?? '—'}</td>
                          <td>{set.weight ?? '—'}</td>
                          <td>{set.reps ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
};

export default ViewWorkoutsPage;
