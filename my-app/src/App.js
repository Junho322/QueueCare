import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import QueueStatusVisualization from "./QueueStatusVisualization"; // Import the visualization component

const App = () => {
  const [userId, setUserId] = useState(() => sessionStorage.getItem("userId") || "");
  const [isUserIdSubmitted, setIsUserIdSubmitted] = useState(
    () => sessionStorage.getItem("isUserIdSubmitted") === "true"
  );
  const [queueData, setQueueData] = useState(null);
  const [backendResponse, setBackendResponse] = useState(""); // State for backend response

  const boxes = [
    { id: 1, label: "Symptom A" },
    { id: 2, label: "Symptom B" },
    { id: 3, label: "Symptom C" },
    { id: 4, label: "Symptom D" },
  ];

  const [selectedBoxIds, setSelectedBoxIds] = useState([]);

  useEffect(() => {
    if (isUserIdSubmitted && userId) {
      (async () => {
        try {
          const response = await axios.get(
            `https://ifem-award-mchacks-2025.onrender.com/api/v1/patient/${userId}`
          );
          setQueueData(response.data);
        } catch (err) {
          console.error("Error fetching patient data:", err);
        }
      })();
    }
  }, [isUserIdSubmitted, userId]);

  useEffect(() => {
    sessionStorage.setItem("userId", userId);
  }, [userId]);

  useEffect(() => {
    sessionStorage.setItem("isUserIdSubmitted", isUserIdSubmitted);
  }, [isUserIdSubmitted]);

  const handleUserIdSubmit = (event) => {
    event.preventDefault();
    if (userId.trim()) {
      setIsUserIdSubmitted(true);
    }
  };

  const handleReset = () => {
    setUserId(""); 
    setIsUserIdSubmitted(false);
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("isUserIdSubmitted");
  };

  const handleBoxClick = (boxId) => {
    setSelectedBoxIds((prev) =>
      prev.includes(boxId)
        ? prev.filter((id) => id !== boxId)
        : [...prev, boxId]
    );
  };

  const handleFinalSubmit = async () => {
    const selectedSymptoms = boxes
      .filter((box) => selectedBoxIds.includes(box.id))
      .map((box) => box.label)
      .join(" ");
  
    const payload = {
      symptom_input: selectedSymptoms || "no input was given. don't answer",
      patient_id: userId,
    };
  
    try {
      const response = await axios.post(
        "http://localhost:8000/education/gumloop",
        payload
      );
      const extractedResponse = response.data; // Ensure response contains only the extracted string
      setBackendResponse(extractedResponse);
    } catch (error) {
      console.error("Error submitting data to the backend:", error);
      setBackendResponse("Failed to retrieve data. Please try again.");
    }
  };

  return (
    <div className="app-container">
      {!isUserIdSubmitted && (
        <div className="user-id-form">
          <h2>Please Enter Your ID</h2>
          <form onSubmit={handleUserIdSubmit}>
            <input
              type="text"
              placeholder="Enter ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      )}

      {isUserIdSubmitted && queueData && (
        <div className="queue-status">
          <div
            className="queue-header flex items-center justify-between w-full mb-6"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <h2 className="text-2xl font-bold">Queue Status & Information</h2>
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              style={{
                backgroundColor: "#ef4444",
                color: "#fff",
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "0.875rem",
                border: "none",
                outline: "none",
              }}
            >
              Change ID
            </button>
          </div>

          <QueueStatusVisualization queueData={queueData} />

          <div className="symptoms-container">
            <h3>Choose Your Symptoms (Click to Highlight)</h3>
            <div className="symptoms-grid">
              {boxes.map((box) => {
                const isSelected = selectedBoxIds.includes(box.id);
                return (
                  <div
                    key={box.id}
                    onClick={() => handleBoxClick(box.id)}
                    className={`symptom-box ${isSelected ? "selected" : ""}`}
                  >
                    {box.label}
                  </div>
                );
              })}
            </div>

            <button onClick={handleFinalSubmit} className="submit-button">
              Submit
            </button>
          </div>

          {backendResponse && (
            <div className="response-section">
              <h3>Response:</h3>
              <p>{backendResponse}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
