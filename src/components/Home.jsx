import React, { useState, useEffect } from "react";
import "./Home.css";
import { useStateContext } from "../contexts/ContextProvider";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCircle, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
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
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    endpoint: "",
    key: "",
    deploymentModel: "",
    apiVersion: "",
  });
  const [validity, setValidity] = useState({
    endpoint: false,
    key: false,
    deploymentModel: false,
    apiVersion: false,
  });
  const [loading, setLoading] = useState({
    endpoint: false,
    key: false,
    deploymentModel: false,
    apiVersion: false,
  });
  const [errors, setErrors] = useState({
    endpoint: "",
    key: "",
    deploymentModel: "",
    apiVersion: "",
  });
  const [prevFormData, setPrevFormData] = useState(formData);
  const validate = (name, value) => {
    if (!value.trim()) {
      return `${name} is required`;
    }
    if (name === "endpoint") {
      return `${name} is not valid `;
    }
    if (name === "key") {
      return "key or Endpoint is not valid ";
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

    // Update formData when an input field changes
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // useEffect to trigger whenever formData changes
  useEffect(() => {
    // Only call handleFormDataChange if formData has changed
    console.log("precformdata", prevFormData);
    if (JSON.stringify(prevFormData) !== JSON.stringify(formData)) {
      handleFormDataChange(formData);
      setPrevFormData(formData); // Update previous formData
    }
  }, [formData, formDataOpenAI]);
  const handleFormDataChange = async (formData) => {
    console.log("Form Data has changed:", formData);

    // You can now directly validate the entire formData or specific fields
    // Example: You can validate each field and set errors for each one
    for (const [name, value] of Object.entries(formData)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "", // Reset any previous errors for the specific field
      }));

      if (name === "deploymentModel" || name === "apiVersion") {
        if (
          JSON.stringify(prevFormData[name]) !== JSON.stringify(formData[name])
        ) {
          setValidity((prevValidity) => ({ ...prevValidity, [name]: false }));
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validate(name, value),
          }));
        }
      }

      if (name === "endpoint") {
        if (validateEndpoint(value)) {
          setValidity((prevValidity) => ({ ...prevValidity, [name]: true }));
          setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        } else if (
          JSON.stringify(prevFormData["endpoint"]) !==
          JSON.stringify(formData["endpoint"])
        ) {
          setValidity((prevValidity) => ({ ...prevValidity, [name]: false }));
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validate(name, value),
          }));
        }
      }

      // Key validation and connection string generation logic
      if (formData["key"] != "" && formData["enpoint"] != "") {
        setLoading((prevLoading) => ({ ...prevLoading, ["key"]: true }));

        const connectionString = generateConnectionString(
          formData["endpoint"],
          formData["key"]
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
            setValidity((prevValidity) => ({ ...prevValidity, ["key"]: true }));
            setErrors((prevErrors) => ({ ...prevErrors, ["key"]: "" }));
          } else {
            setValidity((prevValidity) => ({
              ...prevValidity,
              ["key"]: false,
            }));
            setErrors((prevErrors) => ({
              ...prevErrors,
              ["key"]: validate("key", formData["key"]),
            }));
          }
        } catch (error) {
          setValidity((prevValidity) => ({ ...prevValidity, ["key"]: false }));
        } finally {
          setLoading((prevLoading) => ({ ...prevLoading, ["key"]: false }));
        }
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
    setSelectedService(e.target.value);
    setSuccesskey(true); // Update selected cloud service
  };
  const handleNext = () => {
    if (currentStep <= steps.length - 1) {
      if (currentStep === 1) {
        setFormDataOpenAI({
          endpoint: formData.endpoint,
          key: formData.key,
          deploymentModel: formData.deploymentModel,
          apiVersion: formData.apiVersion,
        });
      }
      if (currentStep === 2) {
        setFormDataDI({
          endpoint: formData.endpoint,
          key: formData.key,
          deploymentModel: formData.deploymentModel,
        });
      }

      setFormData({
        endpoint: "",
        key: "",
        deploymentModel: "",
        apiVersion: "",
      });
      setErrors({
        endpoint: "",
        key: "",
        deploymentModel: "",
        apiVersion: "",
      });
      setPrevFormData({
        endpoint: "",
        key: "",
        deploymentModel: "",
        apiVersion: "",
      });
      setCurrentStep(currentStep + 1);

      setSuccesskey(false);
    }
  };
  const handleSkip = () => {
    setFormData({
      endpoint: "",
      key: "",
      deploymentModel: "",
      apiVersion: "",
    });
    setErrors({
      endpoint: "",
      key: "",
      deploymentModel: "",
      apiVersion: "",
    });
    setPrevFormData({
      endpoint: "",
      key: "",
      deploymentModel: "",
      apiVersion: "",
    });
    setCurrentStep(currentStep + 1);

    setSuccesskey(false);
  };
  const handleDiscard = () => {
    setSelectedService("");
    setSuccesskey(false);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (currentStep === 1) {
      const allValuesFilled = Object.values(formData).every(
        (value) => value !== ""
      );
      const noErrors = Object.values(errors).every((error) => error === "");
      const noLoading = Object.values(loading).every((load) => load === false);
      if (allValuesFilled && noErrors && noLoading) {
        setSuccesskey(true);
      } else {
        console.log(allValuesFilled, noErrors);
        setSuccesskey(false); // Optionally reset success if conditions are not met
      }
    }
    if (currentStep === 2) {
      const allValuesFilled = Object.entries(formData).every(
        ([key, value]) => key === "apiVersion" || value !== ""
      );
      const noErrors = Object.values(errors).every((error) => error === "");
      const noLoading = Object.values(loading).every((load) => load === false);
      if (allValuesFilled && noErrors && noLoading) {
        setSuccesskey(true);
      } else {
        console.log(allValuesFilled, noErrors);
        setSuccesskey(false); // Optionally reset success if conditions are not met
      }
    }
    if (currentStep === 3) {
      const allValuesFilled = Object.entries(formData).every(
        ([key, value]) =>
          ["apiVersion", "deploymentModel"].includes(key) || value !== ""
      );

      const noErrors = Object.values(errors).every((error) => error === "");
      const noLoading = Object.values(loading).every((load) => load === false);
      if (allValuesFilled && noErrors && noLoading) {
        setSuccesskey(true);
      } else {
        console.log(allValuesFilled, noErrors);
        setSuccesskey(false); // Optionally reset success if conditions are not met
      }
    }
  }, [formData, errors, loading, prevFormData]); // Re-run the effect when formData or errors change

  console.log("errors", errors);
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
          <div className="upload-section ">
            <h2
              className=" upload-section1 config-heading text-center whitespace-nowrap"
              style={{ width: "100%", marginTop: "-4%" }}
            >
              Cloud Service Configuration
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
          <div className="upload-section" style={{ width: "60%" }}>
            <h2
              className=" upload-section1 config-heading text-center "
              style={{ width: "100%", marginTop: "-1.7%" }}
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
                    checked={selectedService === "Azure"}
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
                <div className="grid grid-cols-2 gap-6 mt-0">
                  <div className="">
                    <label className="block text-gray-700 text-lg font-semibold mb-2 whitespace-nowrap">
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
                    <div
                      className="float-end"
                      style={{ marginTop: "-1.5rem", marginRight: "1rem" }}
                    >
                      <button
                        onClick={handleSkip} // Replace with your actual handler
                        style={{
                          background: "none",
                          border: "none",
                          color: "#007bff",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                        }}
                      >
                        Skip
                      </button>
                    </div>
                    <label className="block text-gray-700 text-lg font-semibold mb-2 whitespace-nowrap">
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
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-gray-700 text-lg font-semibold mb-2 whitespace-nowrap">
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
                        {formData.endpoint !== "" && loading.endpoint ? (
                          <span className="inline-block w-4 h-4  animate-pulse rounded-sm"></span>
                        ) : formData.endpoint !== "" ? (
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
                    <label className="block text-gray-700 text-lg font-semibold mb-2 whitespace-nowrap">
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
                          className="w-full h-12 text-lg bg-slate-100 border border-gray-300 p-2 rounded-lg "
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
                        {formData.key !== "" && loading.key ? (
                          <span className="w-5 h-5 block border-2 border-black relative animate-borderChange"></span>
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
              </form>
            )}
            {currentStep === 2 && (
              <form
                onSubmit={handleSubmit}
                className="p-6 h-32 w-full mx-auto bg-white rounded-2xl "
              >
                <div className="grid grid-cols-2 gap-6 mt-2">
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
                    <div
                      className="float-end"
                      style={{ marginTop: "-1.5rem", marginRight: "1rem" }}
                    >
                      <button
                        onClick={handleSkip} // Replace with your actual handler
                        style={{
                          background: "none",
                          border: "none",
                          color: "#007bff",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                        }}
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-4">
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
                        {formData.endpoint !== "" && loading.endpoint ? (
                          <span className="inline-block w-4 h-4  animate-pulse rounded-sm"></span>
                        ) : formData.endpoint !== "" ? (
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
                        {formData.key !== "" && loading.key ? (
                          <span className="w-5 h-5 block border-2 border-black relative animate-borderChange"></span>
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
              </form>
            )}
            {currentStep === 3 && (
              <form
                onSubmit={handleSubmit}
                className="p-6 h-32 w-full mx-auto bg-white rounded-2xl "
              >
                <div className="grid grid-cols-2 gap-6 mt-4">
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
                        {formData.endpoint !== "" && loading.endpoint ? (
                          <span className="inline-block w-4 h-4  animate-pulse rounded-sm border-dotted"></span>
                        ) : formData.endpoint !== "" ? (
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
                        {formData.key !== "" && loading.key ? (
                          <span className="w-5 h-5 block border-2 border-black relative animate-borderChange"></span>
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
              </form>
            )}

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
              {successKey && currentStep == 3 && (
                <NavLink
                  onClick={() => {
                    setSidebarCurrentStep(1);
                    setFormDataStorage({
                      endpoint: formData.endpoint,
                      key: formData.key,
                    });
                  }}
                  to="/data_load"
                  key="data_load"
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

export default Home;
