import React, { useEffect, useState } from "react";

interface Notification {
  id: string;
  body: string;
  title: string;
  stackTimestamp: Date;
}

interface NotificationBannerProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-4 text-center transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        background: "rgba(54, 57, 63, 0.9)", // Discord-like background
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)", // Attempt to create a glass effect
        WebkitBackdropFilter: "blur(10px)", // For older versions of WebKit
        color: "white",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px", // Ensure all corners are rounded
        margin: "10px",
        overflow: "hidden", // Ensure content does not overflow
        width: "95%", // Ensure it fits within the screen
        maxWidth: "600px", // Limit the maximum width
      }}
    >
      <strong
        style={{ fontSize: "1.2em", display: "block", marginBottom: "5px" }}
      >
        {notification.title}
      </strong>
      <p style={{ margin: "5px 0" }}>{notification.body}</p>
      <small style={{ display: "block", marginTop: "5px", color: "#b9bbbe" }}>
        {notification.stackTimestamp.toLocaleString()}
      </small>
    </div>
  );
};

export default NotificationBanner;
