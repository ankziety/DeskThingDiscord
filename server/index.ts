import DiscordHandler from "./discord";
import { DeskThing as DK, SocketData } from "deskthing-server";
export { DK as DeskThing };

const DeskThingServer = DK;
let discord: DiscordHandler | null = null;

const main = async () => {
  // Set Data object and ensure it is up-to-date
  let data = await DeskThingServer.getData();
  DeskThingServer.on("data", (newData) => {
    data = newData;
    DeskThingServer.sendLog(
      `[Discord] Data object has been updated ${JSON.stringify(newData)}`
    );
  });

  // Initialize settings
  if (
    !data?.settings?.auto_switch_view ||
    !data.settings?.notifications ||
    !data.settings?.activity ||
    !data.settings?.dm_notifications
  ) {
    DeskThingServer.addSettings({
      auto_switch_view: {
        label: "Auto Switch View",
        type: "boolean",
        value: false,
      },
      activity: {
        label: "Display Activity",
        type: "boolean",
        value: false,
      },
      dm_notifications: {
        label: "Display DM Notifications",
        type: "boolean",
        value: true,
      },
    });
  }
  // Check if data exists
  if (!data?.client_id || !data?.client_secret) {
    const requestScopes = {
      client_id: {
        value: "",
        label: "Discord Client ID",
        instructions:
          'You can get your Discord Client ID from the <a href="https://discord.com/developers/applications" target="_blank" style="color: lightblue;">Discord Application Dashboard</a>. You must create a new discord bot and then under OAuth2 find CLIENT ID - Copy and paste that into this field.',
      },
      client_secret: {
        value: "",
        label: "Discord Client Secret",
        instructions:
          'You can get your Spotify Client Secret from the <a href="https://discord.com/developers/applications" target="_blank" style="color: lightblue;">Discord Application Dashboard</a>. You must create a new application and then under OAuth2 click "Reveal Secret" or "Reset Secret" and copy-paste that here in this field.',
      },
      redirect_url: {
        label: "Discord Redirect URI",
        value: "http://localhost:8888/callback/discord",
        instructions:
          'Set the Discord Redirect URI to http://localhost:8888/callback/discord and then click "Save".\n This ensures you can authenticate your account to this application',
      },
    };

    DeskThingServer.getUserInput(requestScopes, async (data) => {
      if (data.payload.client_id && data.payload.client_secret) {
        DeskThingServer.saveData(data.payload);
        discord = new DiscordHandler(DeskThingServer);
        await discord.registerRPC();
      } else {
        DeskThingServer.sendError(
          "[Discord] Please fill out all the fields! Restart Discord to try again"
        );
      }
    });
  } else {
    discord = new DiscordHandler(DeskThingServer);
    await discord.registerRPC();
  }

  DeskThingServer.on("set", handleSet);
  DeskThingServer.on("get", handleGet);

  DeskThingServer.sendLog("[Server] Discord app started successfully.");
};

const handleSet = (data: SocketData) => {
  if (!data.request) {
    DeskThingServer.sendError("[Discord] No request provided in 'set' data.");
    return;
  }

  if (discord === null)
    throw new Error("[Discord] Discord client not initialized");

  switch (data.request) {
    case "hangup":
      discord.leaveCall();
      break;
    case "mic":
      discord.setClientVoiceSetting({ mute: data.payload || false });
      break;
    case "deafened":
      discord.setClientVoiceSetting({ deaf: data.payload || false });
      break;
    case "user_voice_state":
      // @ts-expect-error
      discord.setUserVoiceState(data.payload);
      break;
    default:
      DeskThingServer.sendError(
        `[Discord] Unhandled 'set' request: ${data.request}`
      );
      break;
  }
};

const handleGet = (data: SocketData) => {
  // if (data.app !== "discord") {
  //   // Ignore data not intended for the discord app
  //   return;
  // }
  // DeskThingServer.sendLog(`New data get request ${JSON.stringify(data)}`);

  if (!data.request) {
    DeskThingServer.sendError("[Discord] No request provided in 'get' data.");
    return;
  }

  if (discord === null)
    throw new Error("[Discord] Discord client not initialized");

  if (data.request == "refresh_call") {
    DeskThingServer.sendLog("[Discord] Refreshing call data");
    discord.refreshCallData();
  } else {
    DeskThingServer.sendError(
      `[Discord] Unhandled 'get' request: ${data.request}`
    );
  }
};

// Start the DeskThing
DeskThingServer.on("start", main);

DeskThingServer.on("stop", () => {
  DeskThingServer.sendError("[Discord] Stopping discord application");
  DeskThingServer.off("set", handleSet);
  DeskThingServer.off("get", handleGet);
  if (discord) {
    discord.destroy();
    discord = null;
  }
});

DeskThingServer.on("purge", () => {
  DeskThingServer.sendError("[Discord] Purging discord application");
});
