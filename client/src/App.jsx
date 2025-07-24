import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';

import NotFound from './pages/404';
import AboutPage from './pages/AboutPage';
import BannedPage from './pages/BannedPage';
import HomePage from './pages/HomePage';
import LoadingPage from './pages/LoadingPage';
import LoginPage from './pages/Loginpage';
import ProfilePage from './pages/ProfilePage';
import RegisterUserPage from './pages/RegisterUserPage';
import RegisterWorkoutPage from './pages/RegisterWorkoutPage';
import ViewExercises from './pages/ViewExercises';
import ViewWorkoutsPage from './pages/ViewWorkoutsPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  const { loading, isActive, user } = useAuth()

   if(loading){
    return <LoadingPage />
  }

  if(!isActive && user){

    return(
      <>
      <BannedPage />
      </>  
    )

  }
  
  return (

   <BrowserRouter>
   <Header/>
   <Routes>
    <Route path="/" element={<HomePage/>} />
  </Routes>
  <Footer/>
    </BrowserRouter>
  )
}

export default App
