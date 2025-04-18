import React, { useState, useEffect } from "react";
import "./Home.css";
import { useStateContext } from "../contexts/ContextProvider";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCircle, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";

const steps = [
  "Text Data Processing",
  "Confirm",
  "Select Tables Extraction Method",
  "Confirm",
];

 const Document_Preprossing = () => {
  const {
    setSidebarCurrentStep,
    selectedPDFFile,
    formDataStorage,
    setFormDataStorage,
    formDataDI,
    setFormDataDI,
    formDataOpenAI,
    setFormDataOpenAI,
  } = useStateContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [successKey, setSuccesskey] = useState(false);
  const [inputSectionValue, setInputSectionValue] = useState("^(\\d+\\.)\\s+(.*)");
  
  const [selectedMethod, setSelectedMethod] = useState('not-required');

  const [inputSubSectionValue, setInputSubSectionValue] = useState("^(\\d+\\.\\d+)\\.?\\s+(.+)");
  const [inputBulletValue, setInputBulletValue] = useState("^\\s*([a-z])\\.?\\s+(.+)");
  const [result,setResult] = useState("")
   const [isLoading, setIsLoading] = useState(false);
  console.log("pdffile is",selectedPDFFile)
  const handleNext = async () => {
 
    if (currentStep <= steps.length) {
      setCurrentStep((prev) => prev + 1);
      if (currentStep === 0) {
     
        setIsLoading(true)
        try {
       
          // Fetch blob from the blob URL
          const response = await fetch(selectedPDFFile.url);
          const blob = await response.blob();
  
          // Create FormData as per the curl structure
          const formData = new FormData();
          formData.append('file', new File([blob], selectedPDFFile.name, { type: 'application/pdf' }));
          formData.append('section_pattern', inputSectionValue);
          formData.append('subsection_pattern', inputSubSectionValue);
          formData.append('bullet_pattern', inputBulletValue);
  
          // API call
          const apiResponse = await fetch(
            'https://pod-7backend-g6fffpfpfhfyheh0.canadacentral-01.azurewebsites.net/Document-Preprocessing/extract-text',
            {
              method: 'POST',
              headers: {
                // 'Content-Type' should NOT be set manually when using FormData
                accept: 'application/json',
              },
              body: formData,
            }
          );
  
          if (!apiResponse.ok) {
            throw new Error('API request failed');
          }
  
          const result = await apiResponse.json();
          setResult(result)
         console.log("result",result)//  setSelectedPdfFile(result); // Save full JSON response
        } catch (error) {
          console.error('Error uploading file to API:', error);
          return; // Prevent advancing step on error
        }
        finally {
          setIsLoading(false)
        }
      }
    
  
      // Proceed to next step
     
    }
  };
  
  
const handleDiscard = () => {
    setSuccesskey(true);
    setCurrentStep(0);
    if(inputBulletValue!=="")
    {
      setSuccesskey(true)
    }
  };
  
  
  useEffect(() => {
  
    
    if(currentStep===0 && inputSectionValue && inputSubSectionValue && inputBulletValue )
    {
     
      setSuccesskey(true)
    }
    if(currentStep===1 )
      {
       
        setSuccesskey(true)
      }
      if(currentStep===2)
        {
         
          setSuccesskey(true)
        }
  }, []); // This runs whenever `containers` updates
  
  
  return (
    <div className="min-h-screen w-full bg-white text-black main-content  relative">
      <div className="upload-container relative bg-gray-100 p-4">
        {/* Discard Button Wrapper with Background Color */}
        <div className="mt-7 top-0 right-0   h-14 rounded-lg w-full">
          <button
            className="discard-btn w-32 "
            style={{ marginRight: "-2%" }}
            onClick={handleDiscard}
          >
            Discard
          </button>
        </div>
        <div className="upload-sections-wrapper" style={{ marginTop: "-4%" }}>
          <div className="upload-section " style={{height:'30rem'}}>
            <h2
              className=" upload-section1 config-heading text-center whitespace-nowrap"
              style={{ width: "100%", marginTop: "-4%" }}
            >
              Document-Preprossesing
            </h2>
            <ul className="relative ml-5 mt-10">
          
              {steps.map((step, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 relative whitespace-nowrap"
                >
                  {/* Icon & Line Container */}
                  <div className="flex flex-col items-center">
                    {index < currentStep ? (
                      <div
                        className=" rounded-full  flex items-center justify-center "
                        style={{ backgroundColor: "#3b82f6" }} // You can also use Tailwind's class for background color
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",

                            border: "0px solid #F7F8FB",
                            borderRadius: "50%",
                            position: "relative", // To place icon inside the circle
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          <FaRegCircle size={40} color="transparent" />{" "}
                          {/* Empty Circle Logo */}
                          <div
                            style={{
                              backgroundColor: "white",
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)", // Centers the inner icon
                            }}
                          >
                            <FaCheckCircle
                              size={40}
                              color="green"
                              className="text-3xl"
                            />{" "}
                            {/* Icon inside the circle */}
                          </div>
                        </div>
                      </div>
                    ) : index === currentStep ? (
                      <div
                        className=" rounded-full  flex items-center justify-center "
                        style={{ backgroundColor: "#3b82f6" }} // You can also use Tailwind's class for background color
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",

                            border: "0px solid #F7F8FB",
                            borderRadius: "50%",
                            position: "relative", // To place icon inside the circle
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          <FaRegCircle size={40} color="transparent" />{" "}
                          {/* Empty Circle Logo */}
                          <div
                            style={{
                              backgroundColor: "white",
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)", // Centers the inner icon
                            }}
                          >
                            <FaCheckCircle
                              size={40}
                              color="#1e3a8a"
                              className="text-3xl"
                            />{" "}
                            {/* Icon inside the circle */}
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
                        : "text-black font-semibold text-xl"
                    } mt-1 text-l`} // Small top margin for alignment
                    style={{ marginLeft: "-5px" }}
                  >
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="upload-section" style={{ width: "60%",height:'30rem' }}>
            <h2
              className=" upload-section1 config-heading text-center "
              style={{ width: "100%", marginTop: "-1.7%" }}
            >
              {" "}
              {steps[currentStep]}
            </h2>
           {currentStep === 0 &&  
           <form className=" w-full mt-10 flex flex-wrap ">

           {/* Parameter 1 */}
           <div className="flex w-full sm:w-[calc(50%-0.5rem)] flex-col sm:flex-row gap-2 p-4">
             <label className="w-1/3 text-base font-medium whitespace-nowrap">Section Pattern</label>
             <div className="flex flex-col w-full gap-2">
             <div className="relative">
            <input
              type="text"
              placeholder=""
              className=" w-full h-12 text-lg bg-slate-100 border border-gray-300 p-2 rounded-lg pr-24"
            />
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-700"
            >
              Generate
            </button>
          </div>
          <input
             type="text"
             value={inputSectionValue}
             onChange={(e) => setInputSectionValue(e.target.value)}
            placeholder=""
            className=" w-full h-12 text-lg bg-slate-100 border border-gray-300 p-2 rounded-lg"
          />
        </div>
        
             </div>
           
     
           {/* Parameter 2 */}
           <div className="flex w-full sm:w-[calc(50%-0.5rem)] flex-col sm:flex-row gap-2 p-4">
             <label className="w-1/3 text-base font-medium whitespace-nowrap">Subsection</label>
             <div className="flex flex-col w-[130%] gap-2">
             <div className="relative">
            <input
              type="text"
              placeholder=""
              className=" w-full h-12 text-lg bg-slate-100 border border-gray-300 p-2 rounded-lg pr-24"
            />
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-700"
            >
              Generate
            </button>
          </div>
          <input
            type="text"
            value={inputSubSectionValue}
            onChange={(e) => setInputSubSectionValue(e.target.value)}
            placeholder=""
            className=" w-full h-12 text-lg bg-slate-100 border border-gray-300 p-2 rounded-lg"
          />
             </div>
           </div>
     
           {/* Parameter 3 */}
           <div className="flex w-full sm:w-[calc(50%-0.5rem)] flex-col sm:flex-row gap-2 p-4">
             <label className="w-1/3 text-base font-medium whitespace-nowrap">Bullet Pattern</label>
             <div className="flex flex-col  ml-2 w-full gap-2">
             <div className="relative">
            <input
              type="text"
              placeholder=""
              className=" w-full h-12 text-lg bg-slate-100 border border-gray-300 p-2 rounded-lg pr-24"
            />
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-700"
            >
              Generate
            </button>
          </div>
          <input
            type="text"
            value={inputBulletValue}
            onChange={(e) => setInputBulletValue(e.target.value)}
            placeholder=""
            className=" w-full h-12 text-lg bg-slate-100 border border-gray-300 p-2 rounded-lg"
          />
             </div>
           </div>
     
         </form>
  }
 {currentStep === 1 && (
  <div className="max-h-[20rem] overflow-y-auto pr-2 scrollbar-custom">
  {!result?.formatted_JSON ? (
      <div className="loading-container mt-10 flex justify-center items-center">
        <span className="dot"></span>
        <span className="dot ml-2"></span>
        <span className="dot ml-2"></span>
      </div>
    ) : (
      result?.formatted_JSON &&
      Object.entries(result.formatted_JSON).map(([sectionTitle, subsections]) => {
        if (sectionTitle === "None None") return null;

        return (
          <div key={sectionTitle} className="mt-6">
             <h2 className="text-lg font-bold text-gray-800 mb-1">{sectionTitle}</h2>
            {Object.entries(subsections).map(([subTitle, items]) => (
              <div key={subTitle} className="ml-4 mt-2">
                <h3 className="text-md font-semibold text-gray-700">{subTitle}</h3>
                <ul className="list-disc ml-6 text-gray-600">
                  {items.map((text, idx) =>
                    text.trim() ? <li key={idx}>{text}</li> : null
                  )}
                </ul>
              </div>
            ))}
          </div>
        );
      })
    )}
  </div>
)}
{currentStep === 2 && (
  <div className="mt-10">
   
    {/* Not Required Option - Disabled */}
    <label className="flex items-center justify-start ml-5">
  <input
    type="radio"
    name="method"
    value="not-required"
    checked={selectedMethod === 'not-required'}
    onChange={() => setSelectedMethod('not-required')}
    className="form-radio text-blue-600  w-4 h-4 rounded-full"
    
  />
  <span className="text-gray-700 ml-2 pl-0 text-lg">Not Required</span>
</label>


    {/* Document Intelligence Option - Active */}
    <label className="flex items-center justify-start ml-5 mt-2">
      <input
        type="radio"
        name="method"
        value="document-intelligence"
        className="form-radio text-blue-600  w-4 h-4 rounded-full"
        checked={selectedMethod === 'document-intelligence'}
        onChange={() => setSelectedMethod('document-intelligence')}
        disabled
      />
      <span className="text-gray-700 ml-2 pl-0 text-lg">Document-Intelligence</span>
    </label>
  </div>
)}




          
            {/* Next Button at the Bottom Right */}
            <div className="flex justify-between items-center w-full mt-4">
              {/*<button className="previous-btn w-32" onClick={handlePrevious}>
                Previous
              </button>*/}
              
              {(!isLoading && currentStep !== 3) && (
                
                <button className="next-btn w-32 " onClick={handleNext}>
                  Next
                </button>
              )}
            
            
            </div>
          </div>
        </div>
        <div className="mt-16 text-white ">ddd</div>
      </div>
    </div>
  );
};

export default Document_Preprossing
