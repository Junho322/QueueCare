import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import axios from "axios";

const QueueStatusVisualization = ({ queueData }) => {
  const [averageWaitTimes, setAverageWaitTimes] = useState(null); // Store average wait times
  const [error, setError] = useState(null); // Handle API errors

  const globalPosition = queueData?.queue_position?.global || 0;
  const totalQueue = globalPosition + 10;

  const triageCategory = queueData?.triage_category || 0;
  const timeElapsed = queueData?.time_elapsed || 0;

  // Fetch average wait times from the external API
  useEffect(() => {
    const fetchAverageWaitTimes = async () => {
      try {
        const response = await axios.get(
          "https://ifem-award-mchacks-2025.onrender.com/api/v1/stats/current"
        );
        setAverageWaitTimes(response.data.averageWaitTimes);
      } catch (err) {
        console.error("Error fetching average wait times:", err);
        setError("Failed to load average wait times. Please try again later.");
      }
    };

    fetchAverageWaitTimes();
  }, []);

  // Handle case when average wait times are not available
  if (!averageWaitTimes) {
    return <div>{error || "Loading average wait times..."}</div>;
  }

  const averageWaitTime = averageWaitTimes[triageCategory] || 0;

  // Calculate progress bar percentage
  const waitingProgress = Math.min(100, Math.round((timeElapsed / averageWaitTime) * 100));
  const isDelayed = timeElapsed > averageWaitTime;

  const arrivalTime = queueData?.arrival_time
    ? format(parseISO(queueData.arrival_time), "PPpp")
    : "N/A";

  return (
    <div className="queue-visualization-container">
      <div className="queue-info-box">
        <div className="queue-details-grid">
          <div className="queue-detail">
            <strong>Patient ID:</strong> {queueData?.id || "N/A"}
          </div>
          <div className="queue-detail">
            <strong>Arrival Time:</strong> {arrivalTime}
          </div>
          <div className="queue-detail">
            <strong>Triage Category:</strong> {triageCategory}
          </div>
          <div className="queue-detail">
            <strong>Current Status:</strong> {queueData?.status?.current_phase || "N/A"}
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#e0e0e0",
            borderRadius: "10px",
            height: "20px",
            marginTop: "15px",
          }}
        >
          <div
            style={{
              width: `${waitingProgress}%`,
              height: "100%",
              backgroundColor: waitingProgress >= 100 ? "#dc3545" : "#007bff", // Red if delayed
              borderRadius: "10px",
              transition: "width 0.5s ease",
            }}
          />
        </div>

        {/* Progress Info */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          {isDelayed ? (
            <strong style={{ color: "#dc3545" }}>
              We are sorry for the delay, you should be called soon. ({waitingProgress}%)
            </strong>
          ) : (
            <span>
              <strong>Time Elapsed:</strong> {timeElapsed} mins / {averageWaitTime} mins
              <span style={{ marginLeft: "10px" }}>({waitingProgress}%)</span>
            </span>
          )}
        </div>

        <div className="investigation-status">
          <div className="investigation-detail">
            <strong>Imaging:</strong> {queueData?.status?.investigations?.imaging || "Pending"}
          </div>
          <div className="investigation-detail">
            <strong>Lab Tests:</strong> {queueData?.status?.investigations?.labs || "Pending"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueStatusVisualization;
