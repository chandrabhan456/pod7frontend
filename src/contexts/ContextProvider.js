import React, { createContext, useContext, useState,useEffect } from 'react';

const StateContext = createContext();

const initialState = {
  setting: false,
  notification: false,
  userProfile: false,
  
};

export const ContextProvider = ({ children }) => {
  console.log(localStorage.getItem('openAI_Configuration'))
  
 console.log("loginchan",localStorage.getItem('login'))
 let initialLoginState = localStorage.getItem('login');
 if (initialLoginState === null || initialLoginState === 'false') {
   // If null or true, set to false
   localStorage.setItem('login', 'false');
   initialLoginState = false;
 } else {
   // Otherwise, parse as a boolean
   initialLoginState = localStorage.getItem('login')
 }
  const [activeMenu, setActiveMenu] = useState((localStorage.getItem('openAI_Configuration')) || true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [currentColor, setCurrentColor] = useState('blue');
  const [currentMode, setCurrentMode] = useState('Light');
  const [themeSettings, setThemeSettings] = useState(false);
  const [mainPage, setMainPage] = useState(false)
  const [login1, setlogin1] = useState(initialLoginState);
  useEffect(() => {
    localStorage.setItem('login', login1);
  }, [login1]);
 
  const [home,setHome] = useState(true)
  const [playgrond,setPlaygrond] = useState(false)
  const [vertorDB,setVectorDB] = useState(false)
  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem('themeMode', e.target.value);
  };
  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider value={{currentMode, setCurrentMode,vertorDB,setVectorDB, playgrond,setPlaygrond,home,setHome,login1,setlogin1,mainPage,setMainPage,activeMenu,setActiveMenu,handleClick,setIsClicked,isClicked,initialState,setCurrentColor}}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
