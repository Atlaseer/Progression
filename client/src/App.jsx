import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { useAuth } from './Components/AuthContext';
import Four from './pages/Four';
import AboutPage from './pages/AboutPage';
import BannedPage from './pages/BannedPage';
import HomePage from './pages/HomePage';
import LoadingPage from './pages/LoadingPage';
import LoginPage from './pages/Loginpage';
import ProfilePage from './pages/ProfilePage';
import RegisterUserPage from './pages/RegisterUserPage';
import RegisterWorkoutPage from './pages/RegisterWorkoutPage';
import ExercisesPage from './pages/ExercisesPage';
import ViewExercisesPage from './pages/ViewExercises';
import ViewWorkoutsPage from './pages/ViewWorkoutsPage';
import WorkoutsPage from './pages/WorkoutsPage';

function App() {
  const { loading, isActive, user } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!isActive && user) {
    return <BannedPage />;
  }

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<RegisterUserPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Header />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterUserPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/workouts/new" element={<RegisterWorkoutPage />} />
          <Route path="/workouts/list" element={<ViewWorkoutsPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercises/new" element={<ViewExercisesPage />} />
          <Route path="/exercises/list" element={<ViewExercisesPage />} />
          <Route path="*" element={<Four />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
