import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import QueueStatusVisualization from "./QueueStatusVisualization"; // Import the visualization component

const App = () => {
  const [userId, setUserId] = useState("");
  const [isUserIdSubmitted, setIsUserIdSubmitted] = useState(false);
  const [queueData, setQueueData] = useState(null);

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

  const handleUserIdSubmit = (event) => {
    event.preventDefault();
    if (userId.trim()) {
      setIsUserIdSubmitted(true);
    }
  };

  const handleBoxClick = (boxId) => {
    setSelectedBoxIds((prev) =>
      prev.includes(boxId)
        ? prev.filter((id) => id !== boxId)
        : [...prev, boxId]
    );
  };

  const handleFinalSubmit = () => {
    console.log("Selected Boxes:", selectedBoxIds);
    alert(`You have selected the following boxes: ${JSON.stringify(selectedBoxIds)}`);
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
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {isUserIdSubmitted && queueData && (
        <div className="queue-status">
          <h2>Queue Status & Information</h2>

          {/* Integrating the visualization component */}
          <QueueStatusVisualization queueData={queueData} />

          {/* Symptom selection boxes */}
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
        </div>
      )}
    </div>
  );
};

export default App;
