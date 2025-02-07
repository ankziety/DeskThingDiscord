import React, { useEffect, useState } from "react";
import { Notification } from "../types/discord";

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
    const timer = setTimeout(onClose, 20000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 text-center transition-transform duration-500 ease-in-out z-100 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0))",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        borderRadius: "8px",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        color: "white",
        margin: "10px",
        overflow: "hidden",
        width: "95%",
        maxWidth: "600px",
        maxHeight: "200px",
        position: "relative",
      }}
    >
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-white focus:outline-none absolute top-2 right-2"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <strong
        style={{
          fontSize: "1.2em",
          display: "block",
          marginBottom: "5px",
        }}
      >
        {notification.title}
      </strong>
      <p className="max-h-10 overflow-hidden text-ellipsis">
        {notification.body}
      </p>
      <small style={{ display: "block", marginTop: "5px", color: "#b9bbbe" }}>
        {notification.message.author.username}
      </small>
    </div>
  );
};

export default NotificationBanner;
