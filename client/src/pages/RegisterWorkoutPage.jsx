import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Components/AuthContext';
import { TimePicker } from '../Components/TimePicker';
import '../styles/Main.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const emptyGroup = () => ({ exercise: '', sets: [{ weight: '', reps: '' }] });

const todayValue = () => new Date().toISOString().slice(0, 10);

const currentTimeValue = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const toISO = (date, time) => new Date(`${date}T${time}`).toISOString();

const RegisterWorkoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [groups, setGroups] = useState([emptyGroup()]);
  const [workoutDate, setWorkoutDate] = useState(todayValue());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const computedDuration = (() => {
    if (!startTime || !endTime) return null;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    return diff > 0 ? diff : diff + 24 * 60; // handle crossing midnight
  })();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/exercises`)
      .then((res) => setExercises(res.data))
      .catch(() => setError('Failed to load exercises. Is the server running?'));
  }, []);

  const updateGroupExercise = (gi, val) =>
    setGroups(prev => prev.map((g, i) => i === gi ? { ...g, exercise: val } : g));

  const updateSetCount = (gi, raw) => {
    const n = Math.max(1, Math.min(20, parseInt(raw, 10) || 1));
    setGroups(prev => prev.map((g, i) => {
      if (i !== gi) return g;
      const cur = g.sets;
      if (n === cur.length) return g;
      if (n > cur.length)
        return { ...g, sets: [...cur, ...Array(n - cur.length).fill(null).map(() => ({ weight: '', reps: '' }))] };
      return { ...g, sets: cur.slice(0, n) };
    }));
  };

  const updateSetField = (gi, si, field, val) =>
    setGroups(prev => prev.map((g, i) =>
      i === gi
        ? { ...g, sets: g.sets.map((s, j) => j === si ? { ...s, [field]: val } : s) }
        : g
    ));

  const addGroup = () => setGroups(prev => [...prev, emptyGroup()]);
  const removeGroup = (gi) => setGroups(prev => prev.filter((_, i) => i !== gi));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (groups.some(g => !g.exercise)) {
      setError('Every exercise must be selected.');
      return;
    }

    const payload = groups.flatMap(g =>
      g.sets.map(s => ({
        exercise: g.exercise,
        ...(s.weight !== '' && { weight: Number(s.weight) }),
        ...(s.reps !== '' && { reps: Number(s.reps) }),
      }))
    );

    try {
      setSubmitting(true);
      await axios.post(
        `${SERVER_URL}/api/workouts`,
        {
          sets: payload,
          date: workoutDate,
          ...(showStart && startTime && { startTime: toISO(workoutDate, startTime) }),
          ...(showEnd && endTime && { endTime: toISO(workoutDate, endTime) }),
        },
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
          <div className="workout-date-row">
            <label htmlFor="workout-date">Date</label>
            <div className="workout-date-inputs">
              <input
                id="workout-date"
                type="date"
                value={workoutDate}
                max={todayValue()}
                onChange={(e) => setWorkoutDate(e.target.value)}
              />
              <button
                type="button"
                className="today-btn"
                onClick={() => setWorkoutDate(todayValue())}
                disabled={workoutDate === todayValue()}
              >
                Today
              </button>
            </div>
          </div>

          <div className="workout-time-row">
            <div className="workout-date-row">
              <label>Start</label>
              {showStart ? (
                <div className="workout-date-inputs">
                  <TimePicker value={startTime} onChange={setStartTime} />
                  <button
                    type="button"
                    className="today-btn"
                    onClick={() => { setShowStart(false); setStartTime(''); }}
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="today-btn"
                  onClick={() => { setShowStart(true); setStartTime(currentTimeValue()); }}
                >
                  Set
                </button>
              )}
            </div>
            <div className="workout-date-row">
              <label>End</label>
              {showEnd ? (
                <div className="workout-date-inputs">
                  <TimePicker value={endTime} onChange={setEndTime} />
                  <button
                    type="button"
                    className="today-btn"
                    onClick={() => { setShowEnd(false); setEndTime(''); }}
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="today-btn"
                  onClick={() => { setShowEnd(true); setEndTime(currentTimeValue()); }}
                >
                  Set
                </button>
              )}
            </div>
            {computedDuration !== null && (
              <span className="workout-duration-unit">
                {Math.floor(computedDuration / 60) > 0
                  ? `${Math.floor(computedDuration / 60)}h ${computedDuration % 60}min`
                  : `${computedDuration} min`}
              </span>
            )}
          </div>

          <div className="workout-exercise-list">
            <div className="workout-exercise-header">
              <span>Exercise</span>
              <span>Sets</span>
              <span />
            </div>

            {groups.map((group, gi) => (
              <div key={gi} className="workout-exercise-group">
                <div className="workout-exercise-group-header">
                  <select
                    value={group.exercise}
                    onChange={(e) => updateGroupExercise(gi, e.target.value)}
                    required
                  >
                    <option value="">Select…</option>
                    {exercises.map((ex) => (
                      <option key={ex._id} value={ex._id}>{ex.name}</option>
                    ))}
                  </select>

                  <div className="workout-sets-count">
                    <span>Sets</span>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={group.sets.length}
                      onChange={(e) => updateSetCount(gi, e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="remove-set-btn"
                    onClick={() => removeGroup(gi)}
                    aria-label="Remove exercise"
                    disabled={groups.length === 1}
                  >
                    ✕
                  </button>
                </div>

                {group.sets.map((set, si) => (
                  <div key={si} className="workout-set-row">
                    <span className="workout-set-num">{si + 1}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="kg"
                      value={set.weight}
                      onChange={(e) => updateSetField(gi, si, 'weight', e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="reps"
                      value={set.reps}
                      onChange={(e) => updateSetField(gi, si, 'reps', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button type="button" className="add-set-btn" onClick={addGroup}>
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
