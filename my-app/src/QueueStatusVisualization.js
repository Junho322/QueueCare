import React from "react";
import { format, parseISO } from "date-fns";

const QueueStatusVisualization = ({ queueData }) => {
 const globalPosition = queueData?.queue_position?.global || 0;
 const totalQueue = globalPosition + 10;
 const waitingProgress = Math.min(100, Math.round((globalPosition / totalQueue) * 100));

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
           <strong>Triage Category:</strong> {queueData?.triage_category || "N/A"}
         </div>
         <div className="queue-detail">
           <strong>Current Status:</strong> {queueData?.status?.current_phase || "N/A"}
         </div>
       </div>

       <div style={{ 
         width: '100%', 
         backgroundColor: '#e0e0e0', 
         borderRadius: '10px', 
         height: '20px', 
         marginTop: '15px' 
       }}>
         <div style={{
           width: `${waitingProgress}%`,
           height: '100%',
           backgroundColor: '#007bff',
           borderRadius: '10px',
           transition: 'width 0.5s ease'
         }} />
       </div>
       <div style={{ textAlign: 'center', marginTop: '10px' }}>
         <strong>Queue Position:</strong> {globalPosition} / {totalQueue} 
         <span style={{ marginLeft: '10px' }}>({waitingProgress}%)</span>
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