import React, { useEffect } from "react";

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
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 w-full bg-blue-500 text-white p-4 text-center">
      <strong>{notification.title}</strong>
      <p>{notification.body}</p>
      <small>{notification.stackTimestamp.toLocaleString()}</small>
    </div>
  );
};

export default NotificationBanner;
