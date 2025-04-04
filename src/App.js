import React,{useEffect,useState} from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar,  Sidebar} from './views';
import { useStateContext } from './contexts/ContextProvider';
import {Data_Load,Home } from './components'
import nttlogo from './data/nttdatalogo.svg';
import Login from "./views/Login";
const App = () => {
  localStorage.setItem('OpenAI_Configuration',true)
  localStorage.removeItem("login");
  const {activeMenu, setActiveMenu,login1,setlogin1,currentMode, setCurrentMode, } = useStateContext();
  console.log("chandu",currentMode)
  useEffect(() => {
   
    const currentThemeMode = localStorage.getItem('themeMode');
    if ( currentThemeMode) {
     
      setCurrentMode(currentThemeMode);
    }
  }, []);
 
 
  return (
<div className={currentMode === 'Dark' ? 'dark' : ''}>

<BrowserRouter>
  {!login1 ? (
    <Login />
  ) : (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - Full Width at Top */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-md custom-navbar">
        <Navbar />
      </div>

      {/* Sidebar & Content Container (Below Navbar) */}
      <div className="flex flex-row mt-12">
        {/* Sidebar - Fixed on Left */}
        <div className="w-80 h-screen fixed left-0 top-12 bg-[#F7F8FB] z-40 shadow-lg">
          <Sidebar />
        </div>

        {/* Main Content - Takes Remaining Space */}
        <div className="flex-1 ml-80 p-6 bg-white text-left">
          <Routes>
             <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} /> 
            <Route path="/data_load" element={<Data_Load />} /> 
          </Routes>
        </div>
      </div>
    </div>
  )}
</BrowserRouter>

</div>  )
}

export default App
