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
import ViewExercisesPage from './pages/ViewExercises';
import ViewWorkoutsPage from './pages/ViewWorkoutsPage';

function App() {
  const { loading, isActive, user } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!isActive && user) {
    return <BannedPage />;
  }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterUserPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/workouts" element={<ViewWorkoutsPage />} />
        <Route path="/workouts/new" element={<RegisterWorkoutPage />} />
        <Route path="/exercises" element={<ViewExercisesPage />} />
        <Route path="*" element={<Four />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
