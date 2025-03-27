import React, { useState } from "react";
import "./Home.css";
import { useStateContext } from "../contexts/ContextProvider";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCircle, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { FaMicrosoft, FaAws, FaGoogle } from "react-icons/fa"; // For cloud service icons (Azure, AWS, GCP)
import azureimg from "../data/azure.jpg";
import amazonimg from "../data/amazon.png";
import gcpimg from "../data/gcp.jpg";
const steps = [
  "Select Cloud Provider",
  "Open-AI",
  "Document-Intelligence",
  "Storage Account",
];
const Home = () => {
  const {} = useStateContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [successKey, setSuccesskey] = useState(false);
  const [formData, setFormData] = useState({
    endpoint: "",
    key: "",
    deploymentModel: "",
    apiVersion: "",
  });
  const [errors, setErrors] = useState({});
  const [validity, setValidity] = useState({ endpoint: null, key: null });
  const [loading, setLoading] = useState({ endpoint: false, key: false });

  const validate = (name, value) => {
    if (!value.trim()) {
      return `${name} is required`;
    }
    return "";
  };
  const validateEndpoint = (endpoint) => {
    const regex = /^https:\/\/([a-z0-9]+)\.blob\.core\.windows\.net$/;
    return regex.test(endpoint);
  };

  const generateConnectionString = (endpoint, key) => {
    // Extract AccountName from endpoint (the part before .blob.core.windows.net)
    const accountName = endpoint.split(".")[0].replace("https://", "");

    // Construct the connection string
    const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${key};EndpointSuffix=core.windows.net`;

    return connectionString;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validate(name, value) });

    // Endpoint validation
    if (name === "endpoint") {
      setLoading({ ...loading, [name]: true });
      //alert(validateEndpoint(value))
      if (validateEndpoint(value)) {
        setValidity({ ...validity, [name]: true });
      } else {
        setValidity({ ...validity, [name]: false });
      }
      setLoading({ ...loading, [name]: false });
    }

    // Key validation and connection string generation
    if (name === "key" && formData.endpoint) {
      setLoading({ ...loading, [name]: true });
      const connectionString = generateConnectionString(
        formData.endpoint,
        value
      );
      console.log(connectionString);
      try {
        const response = await fetch(
          "https://pod-7backend-g6fffpfpfhfyheh0.canadacentral-01.azurewebsites.net/config/storage",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              azure_storage_connection_string: connectionString,
            }),
          }
        );

        const result = await response.json();
     
        if (result.message === "Azure Storage configured successfully!") {
          setValidity({ ...validity, [name]: true }); // Set validation to true if message is success
        } else {
          setValidity({ ...validity, [name]: false }); // Set validation to false if message is something else
        }
      } catch (error) {
        setValidity({ ...validity, [name]: false });
      } finally {
        setLoading({ ...loading, [name]: false });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validate(key, formData[key]);
      if (error) {
        validationErrors[key] = error;
      }
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form Data Submitted:", formData);
    }
  };

  const handleChange1 = (e) => {
    setSuccesskey(true); // Update selected cloud service
  };
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSuccesskey(false);
    }
  };

  const handleDiscard = () => {
    setSuccesskey(false);
    setCurrentStep(0);
  };
  const handlePrevious = () => {
    setSuccesskey(false);
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen w-full bg-white text-black ">
      <div className="upload-container ">
        <button className="discard-btn mt-4 w-32" onClick={handleDiscard}>
          Discard
        </button>
        <div className="flex">
          <div className="upload-section " style={{ width: "30%" }}>
            <h2 className=" upload-section1 config-heading text-center ">
              {" "}
              Cloud Service Configuration
            </h2>
            <ul className="relative ml-5 mt-8">
              {steps.map((step, index) => (
                <li key={index} className="flex items-start space-x-3 relative">
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
          <div className="upload-section" style={{ width: "60%" }}>
            <h2
              className=" upload-section1 config-heading text-center "
              style={{ width: "100%" }}
            >
              {" "}
              {steps[currentStep]}
            </h2>
            {currentStep === 0 && (
              <div className="radio-container">
                {/* Radio Button for Azure */}
                <label className="radio-option">
                  <input
                    type="radio"
                    name="cloudService"
                    value="Azure"
                    //checked={selectedService === 'Azure'}*/}
                    onChange={handleChange1}
                  />

                  <img
                    style={{
                      width: "35px",
                      height: "35px",
                      marginLeft: "20px",
                    }}
                    src={azureimg}
                    alt="nttlogo"
                  />
                  <span style={{ marginLeft: "15px" }}>Azure</span>
                </label>

                {/* Radio Button for AWS */}
                <label className="radio-option mt-2">
                  <input
                    type="radio"
                    name="cloudService"
                    value="AWS"
                    // checked={selectedService === 'AWS'}
                    onChange={handleChange}
                    disabled
                  />
                  <img
                    style={{
                      width: "35px",
                      height: "25px",
                      marginLeft: "20px",
                      marginTop: "0px",
                    }}
                    src={amazonimg}
                    alt="nttlogo"
                  />
                  <span style={{ marginLeft: "15px" }}>AWS</span>
                </label>

                {/* Radio Button for GCP */}
                <label className="radio-option">
                  <input
                    type="radio"
                    name="cloudService"
                    value="GCP"
                    //checked={selectedService === 'GCP'}
                    onChange={handleChange}
                    disabled
                  />
                  <img
                    style={{
                      width: "65px",
                      height: "45px",
                      marginLeft: "5px",
                      marginTop: "0px",
                    }}
                    src={gcpimg}
                    alt="nttlogo"
                  />
                  <span>GCP</span>
                </label>
              </div>
            )}
            {currentStep === 1 && (
              <form
                onSubmit={handleSubmit}
                className="p-6 h-32 w-full mx-auto bg-white rounded-2xl "
              >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-lg font-semibold mb-2">
                      Endpoint
                    </label>
                    <div className="relative w-full">
                      <input
                        type="text"
                        name="endpoint"
                        value={formData.endpoint}
                        onChange={handleChange}
                        className={`w-full h-12 text-lg bg-slate-100 border p-2 rounded-lg outline-none `}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {loading.endpoint ? (
                          <span className="inline-block w-4 h-4  animate-pulse rounded-sm"></span>
                        ) : validity.endpoint !== null ? (
                          validity.endpoint ? (
                            <FaCheckCircle className="w-5 h-5 text-green-500" /> // Green check for success
                          ) : (
                            <MdCancel className="w-5 h-5 text-red-500" /> // Red cross for error
                          )
                        ) : null}
                      </span>
                    </div>
                    {errors.endpoint && (
                      <p className="text-red-500 text-s mt-1">
                        {errors.endpoint}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-lg font-semibold mb-2">
                      Key
                    </label>
                    <div className="relative w-full">
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "48px",
                        }}
                      >
                        {/* Full-width Input */}
                        <input
                          type="text"
                          name="key"
                          className="w-full h-12 text-lg bg-slate-100 border border-gray-300 p-2 rounded-lg outline-none"
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "100%", // Full-width
                            paddingRight: "50px", // Allow space for ellipsis in the second input
                            // Hide text
                          }}
                        />

                        {/* Truncated Input (80%) */}
                        <input
                          type="text"
                          name="key"
                          value={formData.key}
                          onChange={handleChange}
                          className="w-full h-12 text-lg bg-slate-100 border border-gray-300 p-2 rounded-lg outline-none"
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "90%", // 80% width for text
                            overflow: "hidden", // Hide overflowed text
                            textOverflow: "ellipsis", // Adds ellipsis
                            whiteSpace: "nowrap", // Prevent text wrapping
                            zIndex: 1, // Ensure it is on top of the full-width input
                            backgroundColor: "transparent", // Transparent background
                            borderColor: "transparent", // Hide border
                          }}
                        />
                      </div>
                      
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {(formData.key !== ""  && loading.key) ? (
                          <span className="w-5 h-5 block border-1 border-black relative animate-borderChange"></span>
                          
                        ) : formData.key !== "" ? (
                          validity.key ? (
                            <FaCheckCircle className="w-5 h-5 text-green-500" /> // Green check for success
                          ) : (
                            <MdCancel className="w-5 h-5 text-red-500" /> // Red cross for error
                          )
                        ) : null}
                      </span>
                    </div>
                    {errors.key && (
                      <p className="text-red-500 text-s mt-1">{errors.key}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-gray-700 text-lg font-semibold mb-2">
                      Deployment Model
                    </label>
                    <input
                      type="text"
                      name="deploymentModel"
                      value={formData.deploymentModel}
                      onChange={handleChange}
                      className="w-full  h-12 text-lg bg-slate-100 border border-gray-300 p-2 rounded-lg outline-none"
                    />
                    {errors.deploymentModel && (
                      <p className="text-red-500 text-s mt-1">
                        {errors.deploymentModel}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-lg font-semibold mb-2">
                      API Version
                    </label>
                    <input
                      type="text"
                      name="apiVersion"
                      value={formData.apiVersion}
                      onChange={handleChange}
                      className="w-full h-12 text-lg bg-slate-100 border border-gray-300 p-2 rounded-lg outline-none"
                    />
                    {errors.apiVersion && (
                      <p className="text-red-500 text-s mt-1">
                        {errors.apiVersion}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            )}

            {/* Next Button at the Bottom Right */}
            <div className="flex justify-between items-center w-full mt-4">
              <button className="previous-btn w-32" onClick={handlePrevious}>
                Previous
              </button>
              {successKey && (
                <button
                  className="next-btn w-32 "
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                >
                  Next
                </button>
              )}
              {!successKey && (
                <button className="nextdisable-btn w-32 ">Next</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
