import Controls from "./Controls";
import discordStore from "../Stores/discordStore";
import { useEffect, useState } from "react";
import {
  IconDeafenedDiscord,
  IconMicOffDiscord,
  IconUserCircle,
  IconBell,
} from "../assets/icons";
import ChannelBanner from "./ChannelBanner";
import NotificationBanner from "./NotificationBanner";
import { Notification, UserData } from "../types/discord";
import { Link } from "react-router-dom";

export const Call = () => {
  const [callData, setCallData] = useState<UserData[]>(
    discordStore.getCallData()
  );
  const [currentNotification, setCurrentNotification] =
    useState<Notification | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleCallDataUpdate = (data: UserData[]) => {
    setCallData(data);
  };

  const addNotification = (notif: Notification) => {
    setNotifications((notifs) => [...notifs, notif]);
    localStorage.setItem(
      "notifications",
      JSON.stringify([...notifications, notif])
    );
    setCurrentNotification(notif);
  };

  const handleNotificationClose = () => {
    setCurrentNotification(null);
  };

  useEffect(() => {
    // Request initial call data

    const removeCallDataListener =
      discordStore.subscribeToCallData(handleCallDataUpdate);
    const removeNotificationListener =
      discordStore.subscribeToNotificationData(addNotification);

    discordStore.requestCallData();

    return () => {
      removeCallDataListener();
      removeNotificationListener();
    };
  }, []);

  // Helper function to create a volume border based on user's volume
  const getVolumeBorder = (volume: number) => {
    const degree = (volume / 200) * 360;
    // Fallback for older browsers that might not support conic-gradient
    return `linear-gradient(indigo ${degree}deg, transparent ${degree}deg)`;
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-900 text-white">
      <div className="relative">
        {currentNotification && (
          <NotificationBanner
            notification={currentNotification}
            onClose={handleNotificationClose}
          />
        )}
        <Link
          to="/notifications"
          className="absolute top-2 right-4 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 focus:outline-none"
        >
          <IconBell className="h-6 w-6" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </Link>
        <ChannelBanner />
      </div>

      {/* Participants display area */}
      <div className="flex-1 flex flex-wrap justify-center items-center p-4 overflow-y-auto">
        {callData && callData.length > 0 ? (
          callData.map((participant) => (
            <div
              key={participant.id}
              className="flex flex-col items-center m-3"
            >
              {participant.profile ? (
                <div className="relative w-40 h-40">
                  {/* Participant's avatar with speaking indication */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-full ${
                      participant.speaking
                        ? "border-4 border-green-500"
                        : "border-transparent p-1"
                    }`}
                    style={{
                      background: getVolumeBorder(participant.volume ?? 0),
                    }}
                  >
                    <div
                      className="inset-0 w-full h-full overflow-hidden rounded-full"
                      style={{
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        background: `url(${participant.profile})`,
                      }}
                    />
                  </div>
                  {/* Mute and deafened indicators */}
                  <div className="absolute right-0 bottom-0 text-red-500 fill-current flex gap-1">
                    {participant.mute && <IconMicOffDiscord />}
                    {participant.deaf && <IconDeafenedDiscord />}
                  </div>
                </div>
              ) : (
                // Default icon if no profile picture
                <IconUserCircle
                  iconSize={280}
                  className="bg-green-500 w-40 h-40 rounded-full"
                />
              )}
              <div className="user-info">
                {/* Display user's nickname or username */}
                <h2 className="font-semibold">
                  {participant.nick || participant.username}
                </h2>
              </div>
            </div>
          ))
        ) : (
          <p
            className="text-center text-gray-500"
            onClick={() =>
              addNotification({
                title: "Test Notification",
                body: "This is a test notification body for testing purposes. Much longer text that is used to test the overflow of the notification banner. This is a test notification body for testing purposes. Much longer text that is used to test the overflow of the notification banner. This is a test notification body for testing purposes. Much longer text that is used to test the overflow of the notification banner. This is a test notification body for testing purposes. Much longer text that is used to test the overflow of the notification banner.",
                message: {
                  author: {
                    username: "DeskThing",
                    id: "",
                    discriminator: "",
                    global_name: "",
                    avatar: "",
                    avatar_decoration_data: undefined,
                    bot: false,
                    flags: 0,
                    premium_type: 0,
                  },
                  id: "",
                  content: "",
                  content_parsed: [],
                  nick: "",
                  timestamp: "",
                  tts: false,
                  mentions: [],
                  mention_roles: [],
                  embeds: [],
                  attachments: [],
                  pinned: false,
                  type: 0,
                },
                channel_id: "",
                icon_url: "",
              })
            }
          >
            No participants in the call
          </p>
        )}
      </div>
      {/* Controls component */}
      <Controls />
    </div>
  );
};
