export type ChannelType = 'text' | 'voice' | 'stage';

export interface DiscordRole {
  id: string;
  name: string;
  color: string; // hex
  hoist: boolean;
  permissions: string[]; // e.g. ["MANAGE_CHANNELS", "VIEW_CHANNEL"]
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: ChannelType;
  topic?: string;
  rolesWithAccess?: string[]; // IDs of roles that have view access
}

export interface DiscordCategory {
  id: string;
  name: string;
  channels: DiscordChannel[];
}

export interface DiscordEmoji {
  id: string;
  name: string;
  url?: string;
  animated: boolean;
}

export interface DiscordTemplate {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  bannerUrl?: string;
  memberCount?: number;
  onlineCount?: number;
  isPublic: boolean;
  categories: DiscordCategory[];
  roles: DiscordRole[];
  emojis: DiscordEmoji[];
  welcomeMessage?: string;
  systemSettings?: {
    verificationLevel: string;
    defaultNotifications: string;
    explicitContentFilter: string;
  };
  likes: number;
  downloads: number;
  creator: string;
  tags: string[];
}

export interface DeploymentLog {
  timestamp: string;
  level: 'info' | 'ok' | 'warn' | 'done' | 'error';
  message: string;
}

export interface DeploymentState {
  id: string;
  templateId: string;
  templateName: string;
  status: 'idle' | 'validating' | 'deploying' | 'verifying' | 'completed' | 'failed';
  progress: number; // 0 to 100
  targetGuildName: string;
  logs: DeploymentLog[];
  startedAt: string;
}

export interface DashboardMetrics {
  totalDeployments: number;
  activeTemplates: number;
  successfulClones: number;
  deploymentSpeed: string;
  rateLimitStatus: string;
}

export interface ActivityFeedItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface CloneOptions {
  roles: boolean;
  categories: boolean;
  textChannels: boolean;
  voiceChannels: boolean;
  stageChannels: boolean;
  emojis: boolean;
  webhooks: boolean;
  welcomeSettings: boolean;
}
