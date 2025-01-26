import React, { useState, useEffect } from "react";
import axios from 'axios';

const App = () => {
  const [userId, setUserId] = useState("");
  const [isUserIdSubmitted, setIsUserIdSubmitted] = useState(false);
  const [queueData, setQueueData] = useState(null);

  // Boxes that can be clicked to highlight
  const boxes = [
    { id: 1, label: "Symptom A" },
    { id: 2, label: "Symptom B" },
    { id: 3, label: "Symptom C" },
    { id: 4, label: "Symptom D" },
  ];

  // State to track which boxes are selected
  const [selectedBoxIds, setSelectedBoxIds] = useState([]);

  /**
   * Once the user ID is submitted, fetch queue/patient data from the API.
   */
  useEffect(() => {
    if (isUserIdSubmitted && userId) {
      (async () => {
        try {
          const response = await axios.get(
            `https://ifem-award-mchacks-2025.onrender.com/api/v1/patient/${userId}`
          );
          // The data from the response:
          //  e.g. {
          //    "arrival_time": "...",
          //    "id": "...",
          //    "queue_position": { "category": 3, "global": 17 },
          //    "status": { "current_phase": "...", "investigations": {...} },
          //    "time_elapsed": ...,
          //    "triage_category": ...
          //  }
          setQueueData(response.data);
        } catch (err) {
          console.error("Error fetching patient data:", err);
        }
      })();
    }
  }, [isUserIdSubmitted, userId]);

  /**
   * Handle user ID submission.
   */
  const handleUserIdSubmit = (event) => {
    event.preventDefault();
    if (userId.trim()) {
      setIsUserIdSubmitted(true);
    }
  };

  /**
   * Toggle box selection.
   */
  const handleBoxClick = (boxId) => {
    if (selectedBoxIds.includes(boxId)) {
      // If already selected, remove it
      setSelectedBoxIds((prev) => prev.filter((id) => id !== boxId));
    } else {
      // Otherwise, add it
      setSelectedBoxIds((prev) => [...prev, boxId]);
    }
  };

  /**
   * Handle final Submit action for the selected boxes.
   * You can send these selected items to the backend or perform other logic.
   */
  const handleFinalSubmit = () => {
    console.log("Selected Boxes:", selectedBoxIds);
    alert(`You have selected the following boxes: ${JSON.stringify(selectedBoxIds)}`);
    // e.g. POST these selected box IDs to your backend.
  };

  return (
    <div style={{ fontFamily: "sans-serif", margin: "20px" }}>
      {/* Step 1: Prompt for ID */}
      {!isUserIdSubmitted && (
        <div>
          <h2>Please Enter Your ID</h2>
          <form onSubmit={handleUserIdSubmit}>
            <input
              type="text"
              placeholder="Enter ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={{ padding: "8px", marginRight: "8px" }}
            />
            <button type="submit" style={{ padding: "8px" }}>
              Submit
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Display Queue Status once data is fetched */}
      {isUserIdSubmitted && queueData && (
        <div style={{ marginTop: "20px" }}>
          <h2>Queue Status & Information</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <div>
              <strong>ID:</strong> {queueData.id}
            </div>
            <div>
              <strong>Arrival Time:</strong> {queueData.arrival_time}
            </div>
            <div>
              <strong>Global Queue Position:</strong> {queueData.queue_position?.global}
            </div>
            <div>
              <strong>Category Queue Position:</strong> {queueData.queue_position?.category}
            </div>
            <div>
              <strong>Time Elapsed:</strong> {queueData.time_elapsed} minutes
            </div>
            <div>
              <strong>Triage Category:</strong> {queueData.triage_category}
            </div>
            <div>
              <strong>Status:</strong> {queueData.status?.current_phase}
            </div>
            <div>
              <strong>Investigations - Imaging:</strong> {queueData.status?.investigations?.imaging}
            </div>
            <div>
              <strong>Investigations - Labs:</strong> {queueData.status?.investigations?.labs}
            </div>
          </div>

          {/* Boxes section */}
          <div style={{ marginTop: "30px" }}>
            <h3>Choose Your Symptoms (Click to Highlight)</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {boxes.map((box) => {
                const isSelected = selectedBoxIds.includes(box.id);
                return (
                  <div
                    key={box.id}
                    onClick={() => handleBoxClick(box.id)}
                    style={{
                      cursor: "pointer",
                      padding: "20px",
                      border: isSelected ? "3px solid blue" : "1px solid gray",
                      borderRadius: "8px",
                      backgroundColor: isSelected ? "#cde7ff" : "#ffffff",
                      textAlign: "center",
                      width: "120px",
                    }}
                  >
                    {box.label}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleFinalSubmit}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
