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
    formDataStorage,
    setFormDataStorage,
    formDataDI,
    setFormDataDI,
    formDataOpenAI,
    setFormDataOpenAI,
  } = useStateContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [successKey, setSuccesskey] = useState(false);
  const [containers, setContainers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedContainers, setSelectedContainers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [structuredDocuments, setStructuredDocuments] = useState({});
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [containerName, setContainerName] = useState(null);
  const [folderName, setFolderName] = useState(null);
  const [downloadedDocument, setDownloadedDocument] = useState(null);
  const generateConnectionString = (endpoint, key) => {
    // Extract AccountName from endpoint (the part before .blob.core.windows.net)
    const accountName = endpoint.split(".")[0].replace("https://", "");
    console.log("formdataDI", formDataDI);
    console.log("formdataStorage", formDataStorage);
    // Construct the connection string
    const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${key};EndpointSuffix=core.windows.net`;

    return connectionString;
  };
  useEffect(() => {
    setIsLoading(true)
    const fetchContainers = async () => {
      const connectionString = generateConnectionString(
        formDataStorage["endpoint"],
        formDataStorage["key"]
      );
      console.log(connectionString);

      try {
        const response = await fetch(
          "https://pod-7backend-g6fffpfpfhfyheh0.canadacentral-01.azurewebsites.net/Data-Load/containers",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              connection_string: connectionString,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON here
        console.log("Containers:", data);
        setContainers(data.containers); // Assuming API returns { containers: ["container1", "container2"] }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContainers();
  }, []); // Runs only on mount
  useEffect(() => {
    console.log("Updated Containers:", containers);

  }, [containers]); // This runs whenever `containers` updates
  const fetchContainersdocument = async () => {
    const connectionString = generateConnectionString(
      formDataStorage["endpoint"],
      formDataStorage["key"]
    );
    console.log(connectionString);

    try {
      const response = await fetch(
        "https://pod-7backend-g6fffpfpfhfyheh0.canadacentral-01.azurewebsites.net/Data-Load/documents",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            connection_string: connectionString,
            container_names: selectedContainers,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Documents:", data);
      setDocuments(data)
    
    }catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCheckboxChange = (event) => {
   
    const { checked, value } = event.target;
   
    setSelectedContainers((prevSelected) =>
      checked ? [...prevSelected, value] : prevSelected.filter((c) => c !== value)
    );
  };
  const downloadDocument = async () => {
    
    const connectionString = generateConnectionString(
      formDataStorage["endpoint"],
      formDataStorage["key"]
    );
    console.log(connectionString);
    const documentName = folderName === 'nofolder' 
    ? selectedDocument 
    : `${folderName}/${selectedDocument}`;

    try {
      const response = await fetch(
        "https://pod-7backend-g6fffpfpfhfyheh0.canadacentral-01.azurewebsites.net/Data-Load/documents/download",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            connection_string: connectionString,
            container_name: containerName,
            document_name: documentName
          }),
        }
      );
    
      if (!response.ok) {
        throw new Error('Failed to download document');
      }
      
     
     
      const arrayBuffer = await response.arrayBuffer();

      // If your file is a PDF:
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      
      const fileUrl = URL.createObjectURL(blob);
      
      setDownloadedDocument({ name: documentName, url: fileUrl });
      
      
    }catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleNext = () => {
    if (currentStep <= steps.length) {
      if(currentStep===0){
        setIsLoading(true)
        fetchContainersdocument()
        
      }
      if(currentStep===1){
        setIsLoading(true)
        downloadDocument()
        
      }
      setCurrentStep(currentStep + 1);

      setSuccesskey(false);
    }
 
  };
  const transformDocuments = (documents) => {
    const result = {};
  
    // Loop through each container (e.g., msadoc, test1, etc.)
    Object.entries(documents).forEach(([containerName, items]) => {
      result[containerName] = {};
  
      // Ensure items is an array
      if (!Array.isArray(items)) {
        console.warn(`Skipping container "${containerName}" - items is not an array`, items);
        return;
      }
  
      // Loop through each document in the container
      items.forEach((item) => {
        const parts = item.split("/");  // Split by '/' to separate folder and filename
        const hasFolder = parts.length > 1;  // If there are folders in the path
  
        const folder = hasFolder ? parts[0] : "nofolder";  // First part is folder or "nofolder"
        const fileName = hasFolder ? parts.slice(1).join("/") : item;  // Join the rest as the filename
  
        // Initialize folder if not already present
        if (!result[containerName][folder]) {
          result[containerName][folder] = { documents: [] };
        }
  
        // Add the document to the folder's "documents" array
        result[containerName][folder].documents.push(fileName);
      });
    });
  
    return result;
  };
  
  
  
  useEffect(() => {
    console.log("Updated Documents:", documents);
    if (documents && Object.keys(documents).length > 0){
      const transformed = transformDocuments(documents.documents);
      console.log("Transformed Structure:", transformed);
      // You can also store it in state if needed
      setStructuredDocuments(transformed);
    }
  }, [documents,folderName,containerName]); 
  const handleDiscard = () => {
    setSuccesskey(false);
    setCurrentStep(0);
    setSelectedContainers([])
  };
  
  const handleDocumentChange = (event) => {
    const selectedDocument = event.target.value;
    // Optionally, you could track which container and folder the document came from
    const [containerName, folderName] = event.target.name.split('-').slice(0, 2);
  
    // Update the selected document in your state
    setSelectedDocument(selectedDocument);
    setContainerName(containerName);
    setFolderName(folderName);
    // If you need to know the container and folder (for further logic), you can use the variables
    console.log('Selected document:', selectedDocument);
    console.log('Container name:', containerName);
    console.log('Folder name:', folderName);
  };
  
  useEffect(() => {
  
    
    if(currentStep===0 && selectedContainers.length>0)
    {
     
      setSuccesskey(true)
    }
    if(currentStep===1 && selectedDocument!=='')
      {
       
        setSuccesskey(true)
      }
      if(currentStep===2)
        {
         
          setSuccesskey(true)
        }
  }, [selectedContainers,documents,selectedDocument]); // This runs whenever `containers` updates
  
  
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
            placeholder=""
            className=" w-full h-12 text-lg bg-slate-100 border border-gray-300 p-2 rounded-lg"
          />
             </div>
           </div>
     
         </form>
  }

          
            {/* Next Button at the Bottom Right */}
            <div className="flex justify-between items-center w-full mt-4">
              {/*<button className="previous-btn w-32" onClick={handlePrevious}>
                Previous
              </button>*/}
              {successKey && currentStep !== 3 && (
                <button className="next-btn w-32 " onClick={handleNext}>
                  Next
                </button>
              )}
              { currentStep == 2 && (
                <NavLink
                  onClick={() => {
                    setSidebarCurrentStep(2);
                  }}
                  to="/document_preprossesing"
                  key="document_preprossesing"
                >
                  <button className="next-btn w-32 ">Next</button>
                </NavLink>
              )}
              {!successKey && (
                <button className="nextdisable-btn w-32 ">Next</button>
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
