import React from "react";

interface NotificationListProps {
  notifications: string[];
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
}) => {
  return (
    <div className="fixed bottom-0 right-0 w-1/3 bg-gray-800 text-white p-4">
      <h2 className="text-lg mb-2">Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index} className="mb-1">
            {notification}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
