import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns"; // Import date-fns

const QueueStatusVisualization = ({ queueData }) => {
  // Safely extract data with default values
  const globalPosition = queueData?.queue_position?.global || 0;
  const totalQueue = globalPosition + 10; // Example: Assume total queue size
  const categoryPosition = queueData?.queue_position?.category || 0;
  const timeElapsed = queueData?.time_elapsed || 0;

  // Format the arrival time
  const arrivalTime = queueData?.arrival_time
    ? format(parseISO(queueData.arrival_time), "PPpp") // e.g., Jan 25, 2025, 9:33 PM
    : "N/A";

  // Transform data for bar chart
  const chartData = [
    { name: "Global Position", value: globalPosition },
    { name: "Total Queue", value: totalQueue },
  ];

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
            <strong>Triage Category:</strong> {queueData?.triage_category || "N/A"}
          </div>
          <div className="queue-detail">
            <strong>Current Status:</strong> {queueData?.status?.current_phase || "N/A"}
          </div>
          <div className="queue-detail">
            <strong>Time Elapsed:</strong> {timeElapsed} minutes
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>

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
