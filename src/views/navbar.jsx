import React, { useEffect, useState } from 'react';

import { MdKeyboardArrowDown } from 'react-icons/md';
import { MdKeyboardArrowUp } from "react-icons/md";
import avatar from '../data/user-profile2.png';
import { Link, NavLink, useNavigate,Navigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { Setting, OpenAI,UserProfile} from '.';
import { useStateContext } from '../contexts/ContextProvider';
import { MdKeyboardArrowRight } from "react-icons/md";
import nttlogo from '../data/nttdatalogo.svg';
import {usrNavigate} from 'react-router-dom'
import { IoHomeOutline } from "react-icons/io5";
import { LuSunMoon } from "react-icons/lu";

import { MdOutlineWbSunny } from "react-icons/md";
import "./navbar.css"
const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
 
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 "
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-3 w-2 right-2 top-2"
      />
      {icon}
    </button>
 
);

const Navbar = () => {
  const { activeMenu,setActiveMenu,mainPage,setMainPage,initialState,handleClick,isClicked,currentMode,setCurrentMode,configurationSettings} = useStateContext();
  console.log("ok",initialState,isClicked)
 const menitem = activeMenu
 console.log("main page",activeMenu)
 if(activeMenu == 'false')
 {
  setActiveMenu(false)
 }
  useEffect(() => { 
    localStorage.setItem("openAI_Configuration",activeMenu)
  })
  
    setMainPage(false)
  
  const handleActiveMenu = () => setActiveMenu(!activeMenu);
  const navigate = useNavigate()
  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
    <div className='flex justify-between md:mx-0  relative w-full dark:bg-black'  > 
  
    <div className='flex'><img
          style={{width:"250px",marginLeft:"-5px",marginTop:'-5px'}}
          className=''
          src={nttlogo}
          alt="nttlogo"
        />
      
    </div>
    

      <div className='absolute inline-flex rounded-full h-2 w-48 right-56 top-1.5' > 
     <div className='text-2xl text-gray-800'>Deployment</div>
     <div className='text-2xl  ml-4 text-gray-800'>Documentation</div>
     <div 
  className="flex items-center justify-center mt-5  cursor-pointer" 
  onClick={() => handleClick('userProfile')}
> 
  <img
    className="rounded-full ml-10 w-full h-10 border border-gray-300 shadow-md"

    src={avatar}
    alt="user-profile"
  />
</div>

          {mainPage && <Navigate replace={true} to='/' />}
           {/* {isClicked.setting && <Setting /> }  */}
           {isClicked.userProfile && (<UserProfile />)}
    
           

      </div>
    </div>
  
    
    </div>
  );
};

export default Navbar;
