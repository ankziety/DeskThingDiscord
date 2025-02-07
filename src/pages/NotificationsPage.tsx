import React, { useState, useEffect } from "react";
import { Notification } from "../types/discord";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch notifications from localStorage
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0))",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        borderRadius: "8px",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        color: "white",
        padding: "20px",
        margin: "10px",
        overflowY: "auto",
        height: "calc(100vh - 20px)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Notifications
      </h1>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div
            key={index}
            style={{
              marginBottom: "20px",
              padding: "15px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
            }}
          >
            <strong
              style={{
                fontSize: "1.2em",
                display: "block",
                marginBottom: "5px",
              }}
            >
              {notification.title}
            </strong>
            <p style={{ margin: "5px 0" }}>{notification.body}</p>
            <small
              style={{ display: "block", marginTop: "5px", color: "#b9bbbe" }}
            >
              {notification.message.author.username}
            </small>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center" }}>No notifications yet.</p>
      )}
    </div>
  );
};

export default NotificationsPage;
