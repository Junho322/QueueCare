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
    { id: 1, label: "How much longer do I have to wait?" },
    { id: 2, label: "What does my queue position mean?" },
    { id: 3, label: "Can you explain what 'registered' means in my current phase?" },
    { id: 4, label: "Why is my triage category marked as Yellow (Level III)?" },
    { id: 5, label: "What determines when I will be seen by a doctor?" },
    { id: 6, label: "Is there any way to speed up my turn?" },
    { id: 7, label: "Can you suggest ways to manage anxiety while I wait?" },
    { id: 8, label: "Is it safe for me to move around while waiting?" },
    { id: 9, label: "Can I get some water or a snack while waiting?" },
    { id: 10, label: "Can I listen to calming music or do breathing exercises to feel better?" },
    { id: 11, label: "Can I leave the waiting area temporarily without losing my place in line?" },
    { id: 12, label: "What happens if I need to step out for an emergency?" },
    { id: 13, label: "Is there any paperwork I need to complete while waiting?" },
    { id: 14, label: "Can I update my information or check-in again if needed?" },
    { id: 15, label: "When will I know more about my condition?" },
    { id: 16, label: "What kind of care can I expect for my triage category?" },
    { id: 17, label: "Will I be informed if there’s a change in my triage priority?" },
    { id: 18, label: "Can you guide me to the restroom or a comfortable seating area?" },
    { id: 19, label: "Are there any amenities or support services I can use while waiting?" },
    { id: 20, label: "What should I do if my condition worsens while waiting?" },
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
    setSelectedBoxIds((prev) => (prev.includes(boxId) ? [] : [boxId]));
};

  const handleFinalSubmit = async () => {
    const selectedQuestions = boxes
      .filter((box) => selectedBoxIds.includes(box.id))
      .map((box) => box.label)
      .join(" ");

    const payload = {
      question_input: selectedQuestions || "no input was given. don't answer",
      patient_id: userId,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/education/gumloop",
        payload
      );
      const extractedResponse = response.data;
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
            >
              Change ID
            </button>
          </div>

          <QueueStatusVisualization queueData={queueData} />

          <div className="questions-container">
  <h3>Choose Your Questions (Click to Highlight)</h3>
  <div className="questions-grid">
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
