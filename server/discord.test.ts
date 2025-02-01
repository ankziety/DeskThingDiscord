import { describe, test, expect, vi, beforeEach } from "vitest";
import DiscordHandler from "./discord";

// Create a mock DeskThingClass
const mockDeskThing = {
  sendError: vi.fn(),
  sendLog: vi.fn(),
  getData: vi.fn().mockResolvedValue({
    client_id: "test_client_id",
    client_secret: "test_client_secret",
    token: "test_token",
    settings: { activity: { value: "testActivity" } },
  }),
  saveData: vi.fn(),
  addBackgroundTaskLoop: vi.fn((fn: Function) => fn()),
  addSettings: vi.fn(),
  send: vi.fn(),
  encodeImageFromUrl: vi.fn(async (url: string) => "encodedImage"),
};

// Create a stub for rpc methods
const stubRPC = {
  subscribe: vi.fn().mockResolvedValue({ unsubscribe: vi.fn() }),
  connect: vi.fn().mockResolvedValue({}),
  getSelectedChannel: vi.fn().mockResolvedValue({
    id: "channel1",
    name: "Test Channel",
    voice_states: [],
  }),
  login: vi.fn().mockResolvedValue({}),
  on: vi.fn(),
  setActivity: vi.fn().mockResolvedValue({}),
  clearActivity: vi.fn(),
  setUserVoiceSettings: vi.fn().mockResolvedValue({}),
  setVoiceSettings: vi.fn().mockResolvedValue({}),
  destroy: vi.fn(),
  selectVoiceChannel: vi.fn().mockResolvedValue({}),
};

let handler: any; // using any to allow overriding private properties

beforeEach(() => {
  // Clear mocks before each test
  vi.clearAllMocks();
  handler = new DiscordHandler(mockDeskThing as any);
  // Override rpc with our stub
  handler.rpc = { ...stubRPC };
});

describe("DiscordHandler", () => {
  test("sendEror calls DeskThingServer.sendError with the proper message", () => {
    const errorMsg = "Test error message";
    handler.sendEror(errorMsg);
    expect(mockDeskThing.sendError).toHaveBeenCalledWith(
      `[Discord] ${errorMsg}`
    );
  });

  test("sendLog calls DeskThingServer.sendLog with the proper message", () => {
    const logMsg = "Test log message";
    handler.sendLog(logMsg);
    expect(mockDeskThing.sendLog).toHaveBeenCalledWith(`[Discord] ${logMsg}`);
  });

  test("mergeUserData adds a new user and encodes profile picture", async () => {
    const newUser = {
      id: "user1",
      username: "testUser",
      nick: "nick",
      speaking: false,
      volume: 50,
      mute: false,
      deaf: false,
      avatar: "avatar1",
    };
    // Initially, connectedUserList is empty.
    const merged = await handler.mergeUserData(newUser);
    expect(merged.id).toBe("user1");
    expect(mockDeskThing.encodeImageFromUrl).toHaveBeenCalledWith(
      expect.stringContaining(
        `https://cdn.discordapp.com/avatars/${newUser.id}/${newUser.avatar}.png`
      )
    );
    // Call merge again with updated data.
    const updatedUser = {
      id: "user1",
      username: "updatedUser",
      nick: "updatedNick",
      speaking: false,
      volume: 70,
      mute: true,
      deaf: false,
      avatar: "avatar1",
    };
    const mergedUpdated = await handler.mergeUserData(updatedUser);
    expect(mergedUpdated.username).toBe("updatedUser");
  });

  test("getCachedUser returns an existing user", async () => {
    // Add a user first
    const newUser = {
      id: "user1",
      username: "testUser",
      nick: "nick",
      speaking: false,
      volume: 50,
      mute: false,
      deaf: false,
      avatar: "avatar1",
    };
    await handler.mergeUserData(newUser);
    const cached = handler.getCachedUser("user1");
    expect(cached.id).toBe("user1");
    expect(mockDeskThing.sendLog).toHaveBeenCalledWith(
      expect.stringContaining("Attempting to fetch user with id user1")
    );
  });

  test("getCachedUser calls sendError when user is not found", () => {
    try {
      handler.getCachedUser("nonexistent");
    } catch (e) {
      // Expected error thrown via sendError call
    }
    expect(mockDeskThing.sendError).toHaveBeenCalledWith(
      "User nonexistent does not exist in the connected user cache"
    );
  });

  test("leaveCall calls rpc.selectVoiceChannel with null", async () => {
    await handler.leaveCall();
    expect(stubRPC.selectVoiceChannel).toHaveBeenCalledWith(null);
  });

  test("clearSelectedChannel unsubscribes from channel and resets state", async () => {
    // Simulate an active selectedChannel and subscription
    handler.selectedChannel = {
      id: "channel1",
      name: "Test Channel",
      voice_states: [],
    };
    handler.recentChannels = [];
    handler.subscriptions = {
      voice: {
        channel1: [{ unsubscribe: vi.fn() }, { unsubscribe: vi.fn() }],
      },
    };
    // Call clearSelectedChannel
    await handler.clearSelectedChannel();
    expect(handler.selectedChannel).toBe(null);
    expect(handler.connectedUserList.length).toBe(0);
    expect(handler.recentChannels).toContainEqual({
      id: "channel1",
      name: "Test Channel",
      voice_states: [],
    });
  });

  test("setClientVoiceSetting calls rpc.setVoiceSettings and sends voice_data", async () => {
    // Setup mergeUserData to resolve to a user with id matching rpc.user?.id
    const fakeUser = { id: "user_rpc", username: "RPCUser" };
    handler.mergeUserData = vi.fn().mockResolvedValue(fakeUser);
    // Define a fake rpc.user
    handler.rpc.user = { id: "user_rpc" };
    const data = { payload: { someSetting: true } };
    await handler.setClientVoiceSetting(data);
    expect(stubRPC.setVoiceSettings).toHaveBeenCalledWith(data);
    expect(mockDeskThing.send).toHaveBeenCalledWith({
      app: "discord",
      type: "voice_data",
      payload: { id: "user_rpc", someSetting: true },
    });
  });

  test("handleVoiceStateCreate processes user join correctly", async () => {
    // Prepare a fake DiscordEventData
    const fakeEvent = {
      user: { id: "user1", username: "testUser", avatar: "avatar1" },
      nick: "nick",
      volume: 50,
      voice_state: {
        mute: false,
        self_mute: false,
        suppress: false,
        deaf: false,
        self_deaf: false,
      },
    };
    // Override mergeUserData to return a user and avoid error
    handler.mergeUserData = vi
      .fn()
      .mockResolvedValue({ id: "user1", username: "testUser" });
    await handler.handleVoiceStateCreate(fakeEvent as any);
    expect(mockDeskThing.sendLog).toHaveBeenCalledWith(
      expect.stringContaining("Handling Voice State Create")
    );
    expect(mockDeskThing.send).toHaveBeenCalledWith({
      app: "discord",
      type: "channel_member",
      request: "connect",
      payload: { id: "user1", username: "testUser" },
    });
  });
});
