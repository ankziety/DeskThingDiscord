import { User, Channel } from "@ankziety/discord-rpc";

type ACTION_TYPES = "speaking" | "connect" | "disconnect" | "update" | "status";

/**
 * Represents a user within the Discord ecosystem.
 *
 * @interface UserData
 * @property {string} id - Unique identifier for the user.
 * @property {string} [username] - The user's username.
 * @property {string} [nick] - The user's nickname, if available.
 * @property {boolean} [speaking] - Whether the user is currently speaking.
 * @property {number} [volume] - The volume level for the user.
 * @property {string} [avatar] - URL to the user's avatar image.
 * @property {boolean} [mute] - Whether the user is muted.
 * @property {boolean} [deaf] - Whether the user is deafened.
 * @property {boolean} [suppressed] - Whether the user's audio is being suppressed.
 * @property {boolean} [is_self] - True if this user instance represents the client.
 * @property {string} [profile] - Additional profile information or URL.
 */
export interface UserData {
  id: string;
  username?: string;
  nick?: string;
  speaking?: boolean;
  volume?: number;
  avatar?: string;
  mute?: boolean;
  deaf?: boolean;
  suppressed?: boolean;
  is_self?: boolean;
  profile?: string;
}

/**
 * Represents a device used for voice input or output.
 *
 * @interface Device
 * @property {string} id - Unique identifier for the device.
 * @property {string} name - Human-readable name of the device.
 */
export interface Device {
  id: string;
  name: string;
}

/**
 * Configuration for voice input settings.
 *
 * @interface VoiceSettingsInput
 * @property {string} device_id - Identifier for the chosen input device.
 * @property {number} volume - Input volume level (range: 0 to 100).
 * @property {Device[]} available_devices - List of available input devices.
 */
export interface VoiceSettingsInput {
  device_id: string;
  volume: number;
  available_devices: Device[];
}

/**
 * Configuration for voice output settings.
 *
 * @interface VoiceSettingsOutput
 * @property {string} device_id - Identifier for the chosen output device.
 * @property {number} volume - Output volume level (range: 0 to 200).
 * @property {Device[]} available_devices - List of available output devices.
 */
export interface VoiceSettingsOutput {
  device_id: string;
  volume: number;
  available_devices: Device[];
}

/**
 * Represents a keyboard shortcut combination.
 *
 * @interface ShortcutKeyCombo
 * @property {number} type - The type of key (refer to key type definitions).
 * @property {number} code - The numeric key code.
 * @property {string} name - The human-readable name of the key.
 */
export interface ShortcutKeyCombo {
  type: number;
  code: number;
  name: string;
}

/**
 * Settings for voice activation mode.
 *
 * @interface VoiceSettingsMode
 * @property {string} type - Mode type (e.g., "PUSH_TO_TALK" or "VOICE_ACTIVITY").
 * @property {boolean} auto_threshold - Whether the activation threshold is set automatically.
 * @property {number} threshold - Activation threshold (range: -100 to 0).
 * @property {ShortcutKeyCombo} shortcut - Shortcut configuration for mode activation.
 * @property {number} delay - Delay (in ms) before activation (range: 0 to 2000).
 */
export interface VoiceSettingsMode {
  type: string;
  auto_threshold: boolean;
  threshold: number;
  shortcut: ShortcutKeyCombo;
  delay: number;
}

/**
 * Represents the current voice state of a user.
 *
 * @interface VoiceState
 * @property {boolean} mute - Indicates if the user is muted.
 * @property {boolean} self_mute - Indicates if the user has self-muted.
 * @property {boolean} suppress - Indicates if the user's audio is being suppressed.
 * @property {boolean} deaf - Indicates if the user is deafened.
 * @property {boolean} self_deaf - Indicates if the user has self-deafened.
 */
export interface VoiceState {
  mute: boolean;
  self_mute: boolean;
  suppress: boolean;
  deaf: boolean;
  self_deaf: boolean;
}

/**
 * Configuration for the client's voice settings.
 *
 * @interface ClientVoiceState
 * @property {VoiceSettingsInput} input - Voice input configuration.
 * @property {VoiceSettingsOutput} output - Voice output configuration.
 * @property {VoiceSettingsMode} mode - Voice activation mode settings.
 * @property {boolean} automatic_gain_control - Flag for automatic gain control.
 * @property {boolean} echo_cancellation - Flag for echo cancellation.
 * @property {boolean} noise_suppression - Flag for noise suppression.
 * @property {boolean} qos - Flag for Quality of Service.
 * @property {boolean} silence_warning - Whether silence warnings are enabled.
 * @property {boolean} mute - Whether the client is muted.
 * @property {boolean} deaf - Whether the client is deafened.
 */
export interface ClientVoiceState {
  input: VoiceSettingsInput;
  output: VoiceSettingsOutput;
  mode: VoiceSettingsMode;
  automatic_gain_control: boolean;
  echo_cancellation: boolean;
  noise_suppression: boolean;
  qos: boolean;
  silence_warning: boolean;
  mute: boolean;
  deaf: boolean;
}

/**
 * Represents an individual user's voice state settings.
 *
 * @interface UserVoiceState
 * @property {string} id - Unique identifier for the user.
 * @property {boolean} [mute] - Whether the user is muted.
 * @property {number} [volume] - The user's volume level.
 * @property {{left: number, right: number}} [pan] - Audio panning configuration.
 */
export interface UserVoiceState {
  id: string;
  mute?: boolean;
  volume?: number;
  pan?: {
    left: number;
    right: number;
  };
}

/**
 * Data structure for Discord event payloads.
 *
 * @typedef {Object} DiscordEventData
 * @property {ACTION_TYPES} action - The action that triggered the event.
 * @property {User} user - The Discord user associated with the event.
 * @property {VoiceState} voice_state - The user's current voice state.
 * @property {boolean} speaking - Whether the user is speaking.
 * @property {string} nick - The user's nickname.
 * @property {number} volume - The user's volume level.
 * @property {boolean} mute - Whether the user is muted.
 * @property {Object.<string, string|boolean|User|UserVoiceState|number>} [key] - Additional dynamic properties.
 */
export type DiscordEventData = {
  action: ACTION_TYPES;
  user: User;
  voice_state: VoiceState;
  speaking: boolean;
  nick: string;
  volume: number;
  mute: boolean;
  [key: string]: string | boolean | undefined | User | UserVoiceState | number;
};

/**
 * Notification details for a Discord event.
 *
 * @interface Notification
 * @property {string} channel_id - The channel ID where the notification is sent.
 * @property {Message} message - The associated message data.
 * @property {string} icon_url - URL to the notification's icon.
 * @property {string} title - The notification title.
 * @property {string} body - The notification body text.
 */
export interface Notification {
  channel_id: string;
  message: Message;
  icon_url: string;
  title: string;
  body: string;
}

/**
 * Represents a Discord message.
 *
 * @interface Message
 * @property {string} id - Unique identifier for the message.
 * @property {string} content - Raw text content of the message.
 * @property {ContentParsed[]} content_parsed - Parsed representation of the message content.
 * @property {string} nick - The sender's nickname.
 * @property {string} [author_color] - Optional color associated with the author.
 * @property {string} timestamp - ISO timestamp of when the message was sent.
 * @property {boolean} tts - Whether the message is marked for text-to-speech.
 * @property {Mention[]} mentions - List of user mentions within the message.
 * @property {any[]} mention_roles - List of role mentions.
 * @property {any[]} embeds - Embedded media or content.
 * @property {any[]} attachments - File attachments.
 * @property {DiscordUser} author - Information about the message author.
 * @property {boolean} pinned - Whether the message is pinned.
 * @property {number} type - Numeric type identifier for the message.
 */
export interface Message {
  id: string;
  content: string;
  content_parsed: ContentParsed[];
  nick: string;
  author_color?: string;
  timestamp: string;
  tts: boolean;
  mentions: Mention[];
  mention_roles: any[];
  embeds: any[];
  attachments: any[];
  author: DiscordUser;
  pinned: boolean;
  type: number;
}

/**
 * Union type for parsed message content.
 *
 * @typedef {MentionParsed|TextParsed} ContentParsed
 */
type ContentParsed = MentionParsed | TextParsed;

/**
 * Represents a parsed mention within a message.
 *
 * @interface MentionParsed
 * @property {string} userId - The ID of the mentioned user.
 * @property {string} channelId - The channel ID where the mention occurred.
 * @property {string} guildId - The guild ID where the mention occurred.
 * @property {string} parsedUserId - Processed user ID extracted from the mention.
 * @property {ParsedContent[]} content - Array of parsed content segments.
 * @property {"mention"} type - Denotes this content as a mention.
 */
interface MentionParsed {
  userId: string;
  channelId: string;
  guildId: string;
  parsedUserId: string;
  content: ParsedContent[];
  type: "mention";
}

/**
 * Represents parsed text content within a message.
 *
 * @interface TextParsed
 * @property {"text"} type - Denotes this content as plain text.
 * @property {string} content - The textual content.
 * @property {OriginalMatch} originalMatch - Details of the original match.
 */
interface TextParsed {
  type: "text";
  content: string;
  originalMatch: OriginalMatch;
}

/**
 * Represents a segment of parsed content.
 *
 * @interface ParsedContent
 * @property {string} type - The category or type of the content segment.
 * @property {string} content - The actual content text.
 */
interface ParsedContent {
  type: string;
  content: string;
}

/**
 * Details of the original match for parsed content.
 *
 * @interface OriginalMatch
 * @property {string|number} [key] - Dynamic property representing match details.
 */
interface OriginalMatch {
  [key: string]: string | number;
}

/**
 * Represents a user mention within a message.
 *
 * @interface Mention
 * @property {(string|null)} avatar - URL of the user's avatar, or null if unavailable.
 * @property {(string|null)} clan - Clan information, if applicable.
 * @property {string} discriminator - The user's discriminator (e.g., "1234").
 * @property {string} id - Unique identifier for the mentioned user.
 * @property {(string|null)} primary_guild - Primary guild ID if applicable.
 * @property {string} username - The username of the mentioned user.
 * @property {number} publicFlags - Public flag bits.
 * @property {(AvatarDecorationData|null)} avatarDecorationData - Additional avatar decoration data.
 * @property {string} globalName - The user's global name.
 */
interface Mention {
  avatar: string | null;
  clan: string | null;
  discriminator: string;
  id: string;
  primary_guild: string | null;
  username: string;
  publicFlags: number;
  avatarDecorationData: AvatarDecorationData | null;
  globalName: string;
}

/**
 * Details for avatar decoration.
 *
 * @interface AvatarDecorationData
 * @property {string} asset - Identifier or URL for the decoration asset.
 * @property {string} skuId - SKU identifier for the decoration.
 */
interface AvatarDecorationData {
  asset: string;
  skuId: string;
}

/**
 * Extended Discord user information.
 *
 * @interface DiscordUser
 * @extends User
 * @property {string} id - Unique identifier for the user.
 * @property {string} username - The user's username.
 * @property {string} discriminator - The user's discriminator (e.g., "1234").
 * @property {string} global_name - The user's global display name.
 * @property {string} avatar - URL or hash for the user's avatar.
 * @property {(any|null)} avatar_decoration_data - Additional decoration data for the avatar.
 * @property {boolean} bot - Whether the user is a bot.
 * @property {number} flags - Bitfield of user flags.
 * @property {number} premium_type - Indicates the user's premium subscription type.
 */
export interface DiscordUser extends User {
  id: string;
  username: string;
  discriminator: string;
  global_name: string;
  avatar: string;
  avatar_decoration_data: any | null;
  bot: boolean;
  flags: number;
  premium_type: number;
}

/**
 * Transport payload for voice activity events.
 *
 * @interface VoiceActivityDataTransport
 * @extends SocketData
 * @property {"speaking_data"} type - Discriminator for voice activity data.
 * @property {{ id: string, speaking: boolean }} payload - Contains user ID and speaking status.
 */
export interface VoiceActivityDataTransport extends SocketData {
  type: "speaking_data";
  payload: { id: string; speaking: boolean };
}

/**
 * Transport payload for channel information.
 *
 * @interface ChannelInfoTransport
 * @extends SocketData
 * @property {"channel_info"} type - Discriminator for channel info data.
 * @property {DiscordEventChannel} payload - Contains detailed channel information.
 */
export interface ChannelInfoTransport extends SocketData {
  type: "channel_info";
  payload: DiscordEventChannel;
}

/**
 * Transport payload for voice state updates.
 *
 * @interface VoiceStateDataTransport
 * @extends SocketData
 * @property {"voice_state"} type - Discriminator for voice state data.
 * @property {{ id: string, mute: boolean, deaf: boolean }} payload - Contains user ID and updated voice state.
 */
export interface VoiceStateDataTransport extends SocketData {
  type: "voice_state";
  payload: { id: string; mute: boolean; deaf: boolean };
}

/**
 * Transport payload for channel member events.
 *
 * @interface ChannelMemberDataTransport
 * @extends SocketData
 * @property {"connect" | "disconnect"} request - The member action request.
 * @property {UserData | { id: string }} payload - Contains user data or just the user ID.
 */
interface ChannelMemberDataTransport extends SocketData {
  type: "channel_member";
  request: "connect" | "disconnect";
  payload: UserData | { id: string };
}

/**
 * Transport payload for notifications.
 *
 * @interface NotificationDataTransport
 * @extends SocketData
 * @property {"notification_data"} type - Discriminator for notification data.
 * @property {Notification} payload - Contains detailed notification information.
 */
export interface NotificationDataTransport extends SocketData {
  type: "notification_data";
  payload: Notification;
}

/**
 * Extended channel information with Discord-specific properties.
 *
 * @interface DiscordEventChannel
 * @extends Channel
 * @property {string} id - Unique identifier for the channel.
 * @property {string} guild_id - Identifier of the guild this channel belongs to.
 * @property {string} name - Name of the channel.
 * @property {number} type - Channel type (0: guild text, 2: guild voice, 1: DM, 3: group DM).
 * @property {string} [topic] - Optional topic for text channels.
 * @property {number} [bitrate] - Bitrate for voice channels (in bits per second).
 * @property {number} [user_limit] - Maximum number of users in a voice channel (0 if unlimited).
 * @property {number} position - The channel's position in the list.
 * @property {ECVoiceState[]} voice_states - List of voice states for members in the channel.
 * @property {Message[]} [messages] - Optional array of messages (applicable to text channels).
 */
export interface DiscordEventChannel extends Channel {
  id: string;
  guild_id: string;
  name: string;
  type: number;
  topic?: string;
  bitrate?: number;
  user_limit?: number;
  position: number;
  voice_states: ECVoiceState[];
  messages?: Message[];
}

/**
 * Detailed voice state information for a channel member.
 *
 * @interface ECVoiceState
 * @property {VoiceState} voice_state - The user's current voice state.
 * @property {ChannelUser} user - The channel-specific user details (defined elsewhere).
 * @property {string} nick - The user's nickname within the channel.
 * @property {number} volume - The user's audio volume level.
 * @property {boolean} mute - Whether the user is muted.
 * @property {Pan} pan - Audio panning details (defined elsewhere).
 */
export interface ECVoiceState {
  voice_state: VoiceState;
  user: ChannelUser;
  nick: string;
  volume: number;
  mute: boolean;
  pan: Pan;
}

/**
 * Extended Discord user information for event channels.
 *
 * @interface ECUser
 * @extends User
 * @property {string} id - Unique identifier for the user.
 * @property {string} username - The user's username.
 * @property {string} discriminator - The user's discriminator (e.g., "1234").
 * @property {string} avatar - URL or hash for the user's avatar.
 * @property {boolean} bot - Indicates if the user is a bot.
 */
export interface ECUser extends User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  bot: boolean;
}

export type subscriptions = {
  voice: { [key: string]: Subscription[] };
};

export type EventUpdateCallbacks = (data: any) => void;
