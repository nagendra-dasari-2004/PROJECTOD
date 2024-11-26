import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import axios from "axios";

const App = () => {
  const [scans, setScans] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  const backendUrl = "http://localhost:5000"; // Replace with your backend URL

  // Generate QR Code Data
  const qrData = `${backendUrl}/scan`;

  // Fetch scans from the backend
  const fetchScans = async () => {
    try {
      const response = await axios.get(`${backendUrl}/scans`);
      setScans(response.data);
    } catch (error) {
      console.error("Error fetching scans", error);
    }
  };

  // Record scan with user location
  const recordScan = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        try {
          await axios.post(`${backendUrl}/scan`, { latitude, longitude });
          alert("Scan recorded successfully!");
          fetchScans();
        } catch (error) {
          console.error("Error recording scan", error);
        }
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h1>QR Code Scanner and Tracker</h1>

      {/* QR Code Display */}
      <div style={{ margin: "20px auto" }}>
        <h2>Scan this QR Code:</h2>
        <QRCode value={qrData} size={200} />
      </div>

      {/* Button to simulate a scan */}
      <button
        onClick={recordScan}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Simulate QR Scan
      </button>

      {/* Display Scanned Locations */}
      <div style={{ marginTop: "30px" }}>
        <h2>Scanned Locations</h2>
        {scans.length === 0 ? (
          <p>No scans recorded yet.</p>
        ) : (
          <table
            style={{
              width: "80%",
              margin: "0 auto",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>#</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Latitude
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Longitude
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan, index) => (
                <tr key={scan._id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {index + 1}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {scan.latitude}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {scan.longitude}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {new Date(scan.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default App;
