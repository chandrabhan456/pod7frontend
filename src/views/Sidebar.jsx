import {React,useState} from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCircle, FaCheckCircle } from 'react-icons/fa';
const steps = [
  "Configuration",
  "Data-Load",
  "Document-Preprocessing",
  "LLM-Interfarence",
  "Export Data",
];
const Sidebar = () => {
  console.log("SSS")
  const {activeMenu, setActiveMenu } = useStateContext();
  console.log(activeMenu)
  const [currentStep, setCurrentStep] = useState(0);
  
  return (
    <div className="w-80 p-4  mt-10">
      <ul className="relative">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start space-x-3 relative">
            {/* Icon & Line Container */}
            <div className="flex flex-col items-center">
              {index < currentStep ? (
                <FaRegCheckCircle className="text-gray-500" size={40} />
              ) : index === currentStep ? (
                <div
      className=" rounded-full  flex items-center justify-center "
      style={{ backgroundColor: '#3b82f6' }} // You can also use Tailwind's class for background color
    >
       <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
       
        border: '0px solid #F7F8FB',
        borderRadius: '50%',
        position: 'relative', // To place icon inside the circle
        backgroundColor: '#f0f0f0',
      }}
    >
      <FaRegCircle size={40} color="transparent"/> {/* Empty Circle Logo */}
      <div
        style={{
          backgroundColor:"white",
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // Centers the inner icon
        }}
      >
        <FaCheckCircle size={40} color="#1e3a8a" className='text-3xl'/> {/* Icon inside the circle */}
        </div>
      </div>
    </div>
              ) : (
                <FaRegCheckCircle className="text-gray-400 " size={40} />
              )}
              {/* Vertical Line - Avoid Adding Line to Last Step */}
              {index !== steps.length - 1 && (
                <div className="w-0.5 h-10 bg-gray-300"></div>
              )}
            </div>

            {/* Step Name (Properly Aligned) */}
            <span
              className={`${
                index === currentStep
                  ? "text-black font-semibold text-xl whitespace-nowrap"
                  : "text-black font-semibold text-xl whitespace-nowrap"
              } mt-1 text-l`} // Small top margin for alignment
            style={{marginLeft:'-10px'}}>
              {step}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}



export default Sidebar
