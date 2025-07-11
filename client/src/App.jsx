import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoadingPage from './pages/LoadingPage';
import BannedPage from './pages/BannedPage';
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
