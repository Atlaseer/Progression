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

  //const { loading, isActive, user } = useAuth()

  // if(loading){
  //  return <LoadingPage />
  //}

  //if(!isActive && user){

   // return(
    //  <>
    //  <BannedPage />
    //  </>  
   // )

//  }
  
  return (

   <BrowserRouter>
   <Header/>
   <Routes>
    <Route path="/" element={
      <>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    } />
  </Routes>
  <Footer/>
    </BrowserRouter>
  )
}

export default App
