"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

type EmergencyAlert = {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  status: string;
  timestamp: string;
};

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "alerts"));
        console.log("✅ Firebase connected! Docs found:", querySnapshot.size);
        setConnected(true);
        const alertList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as EmergencyAlert[];
        setAlerts(alertList);
      } catch (error) {
        console.log("❌ Firebase error:", error);
      }
    };
    testConnection();
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🚨 Tulong Dashboard</h1>
      <p style={{ color: connected ? "green" : "red" }}>
        Firebase: {connected ? "✅ Connected" : "❌ Connecting..."}
      </p>
      <h2>Recent Alerts:</h2>
      {alerts.map(alert => (
        <div key={alert.id} style={{
          padding: "1rem",
          margin: "0.5rem 0",
          backgroundColor: "#ff4444",
          borderRadius: "8px",
          color: "white"
        }}>
          <p>👤 User: {alert.userId}</p>
          <p>📍 Lat: {alert.latitude}, Lng: {alert.longitude}</p>
          <p>🔴 Status: {alert.status}</p>
        </div>
      ))}
    </main>
  );
}