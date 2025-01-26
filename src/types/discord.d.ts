import { User } from "@ankziety/discord-rpc";

type ACTION_TYPES = "speaking" | "connect" | "disconnect" | "update" | "status";

export interface UserData {
  id: string;
  username?: string;
  nick?: string;
  speaking?: boolean;
  volume?: number;
  avatar?: string;
  mute?: boolean;
  deaf?: boolean;
  profile?: string;
}

export interface Device {
  id: string;
  name: string;
}

export interface VoiceSettingsInput {
  device_id: string;
  volume: number; // min: 0, max: 100
  available_devices: Device[];
}

export interface VoiceSettingsOutput {
  device_id: string;
  volume: number; // min: 0, max: 200
  available_devices: Device[];
}

export interface ShortcutKeyCombo {
  type: number; // see key types
  code: number; // key code
  name: string; // key name
}

export interface VoiceSettingsMode {
  type: string; // can be PUSH_TO_TALK or VOICE_ACTIVITY
  auto_threshold: boolean;
  threshold: number; // min: -100, max: 0
  shortcut: ShortcutKeyCombo;
  delay: number; // min: 0, max: 2000
}

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

export interface UserVoiceState {
  id: string;
  mute?: boolean;
  volume?: number;
  pan?: {
    left: number;
    right: number;
  };
}

export type discordData = {
  action: ACTION_TYPES;
  user: User;
  voice_state: ClientVoiceState;
  speaking: boolean;
  nick: string;
  volume: number;
  mute: boolean;
  [key: string]: string | boolean | undefined | User | UserVoiceState | number;
};

// Root Interface for the first JSON block
interface Notification {
  channel_id: string;
  message: Message;
  icon_url: string;
  title: string;
  body: string;
}

// Common Message Interface
interface Message {
  id: string;
  content: string;
  content_parsed: ContentParsed[];
  nick: string;
  author_color?: string;
  ß;
  timestamp: string;
  tts: boolean;
  mentions: Mention[];
  mention_roles: any[];
  embeds: any[];
  attachments: any[];
  author: Author;
  pinned: boolean;
  type: number;
}

// ContentParsed Union Types
type ContentParsed = MentionParsed | TextParsed;

interface MentionParsed {
  userId: string;
  channelId: string;
  guildId: string;
  parsedUserId: string;
  content: ParsedContent[];
  type: "mention";
}

interface TextParsed {
  type: "text";
  content: string;
  originalMatch: OriginalMatch;
}

interface ParsedContent {
  type: string;
  content: string;
}

interface OriginalMatch {
  [key: string]: string | number;
}

// Mention Interface
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

// AvatarDecorationData Interface
interface AvatarDecorationData {
  asset: string;
  skuId: string;
}

// Author Interface
interface Author {
  id: string;
  username: string;
  discriminator: string;
  global_name: string;
  avatar: string;
  avatar_decoration_data: any | null; // Adjust the type if you have more details
  bot: boolean;
  flags: number;
  premium_type: number;
}

interface VoiceActivityDataTransport extends SocketData {
  type: "speaking_data";
  payload: { id: string; speaking: boolean };
}

interface ChannelInfoTransport extends SocketData {
  type: "channel_info";
  payload: Channel;
}

interface VoiceStateDataTransport extends SocketData {
  type: "voice_state";
  payload: { id: string; mute: boolean; deaf: boolean };
}

interface ChannelMemberDataTransport extends SocketData {
  type: "channel_member";
  request: "connect" | "disconnect";
  payload: UserData | { id: string };
}

interface NotificationDataTransport extends SocketData {
  type: "notification_data";
  payload: Notification;
}
