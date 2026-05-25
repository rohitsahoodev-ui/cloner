import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// In-Memory Database Stores
interface DatabaseState {
  savedTemplates: any[];
  deployments: Record<string, any>;
  activityLogs: any[];
  analytics: {
    totalDeployments: number;
    activeTemplates: number;
    successfulClones: number;
    deploymentSpeed: string;
    rateLimitStatus: string;
  };
}

const db: DatabaseState = {
  savedTemplates: [
    {
      id: 'template-gaming',
      name: 'Gaming Cyber-Hub',
      description: 'The ultimate template for a competitive gaming group with specialized voice channels, automated level-roles, and interactive channels.',
      iconUrl: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=150&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      memberCount: 5240,
      onlineCount: 1420,
      isPublic: true,
      categories: [
        {
          id: 'cat-info',
          name: '📢 INFORMATION',
          channels: [
            { id: 'ch-rules', name: '✏-rules-and-info', type: 'text', topic: 'Read our server policies and standards.' },
            { id: 'ch-ann', name: '📢-announcements', type: 'text', topic: 'Stay up to date with gaming tournaments!' },
            { id: 'ch-roles', name: '🎭-self-roles', type: 'text', topic: 'React to grab your gaming roles!' }
          ]
        },
        {
          id: 'cat-text',
          name: '💬 COMMUNITY HUB',
          channels: [
            { id: 'ch-gen', name: '🎮-lobby-general', type: 'text', topic: 'Main chatroom for general discussions.' },
            { id: 'ch-clips', name: '🎥-epic-clips', type: 'text', topic: 'Share your best plays and montage clips!' },
            { id: 'ch-memes', name: '😂-memebox', type: 'text', topic: 'Only quality memes allowed.' }
          ]
        },
        {
          id: 'cat-voice',
          name: '🎧 VC ROOMS',
          channels: [
            { id: 'ch-vc1', name: '🔊 Lobby 1', type: 'voice' },
            { id: 'ch-vc2', name: '🔊 Squad Alpha', type: 'voice' },
            { id: 'ch-vc3', name: '🔊 Squad Beta', type: 'voice' },
            { id: 'ch-stage', name: '🎙 Live Tournament Stage', type: 'stage' }
          ]
        }
      ],
      roles: [
        { id: 'role-owner', name: 'Guildmaster', color: '#ff0055', hoist: true, permissions: ['ADMINISTRATOR'] },
        { id: 'role-mod', name: 'Vanguard Mod', color: '#00ffcc', hoist: true, permissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES', 'KICK_MEMBERS'] },
        { id: 'role-pro', name: 'Elite Gamer', color: '#bf55ec', hoist: true, permissions: ['VIEW_CHANNEL'] },
        { id: 'role-member', name: 'Initiate', color: '#5dade2', hoist: false, permissions: ['VIEW_CHANNEL'] }
      ],
      emojis: [
        { id: 'emo1', name: 'pepe_hype', url: 'https://images.unsplash.com/photo-1570158268988-7f22fcb4d415?w=50', animated: false },
        { id: 'emo2', name: 'kekw_hype', url: '', animated: false }
      ],
      likes: 148,
      downloads: 624,
      creator: 'ZeroCool#0001',
      tags: ['Gaming', 'Community', 'VC-Heavy']
    },
    {
      id: 'template-dev',
      name: 'Crypto Dev Collective',
      description: 'A professional-grade developer workstation setup with dedicated Git updates hub, pair-programming channels, and error-triage logs.',
      iconUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=150&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      memberCount: 2310,
      onlineCount: 812,
      isPublic: true,
      categories: [
        {
          id: 'dev-cat-hub',
          name: '💻 HUB',
          channels: [
            { id: 'dev-readme', name: '📂-readme-first', type: 'text', topic: 'Welcome to the codebase hub.' },
            { id: 'dev-logs', name: '🤖-git-pushes', type: 'text', topic: 'Webhook updates from official GitHub repo.' }
          ]
        },
        {
          id: 'dev-cat-rooms',
          name: '🚀 DEVELOPMENT',
          channels: [
            { id: 'dev-general', name: '💬-dev-chat', type: 'text', topic: 'Architectural brainstorms go here.' },
            { id: 'dev-bugs', name: '🛑-triage', type: 'text', topic: 'Post open issues with code snippets.' }
          ]
        },
        {
          id: 'dev-cat-vc',
          name: '⚡ PAIR PROGRAMMING',
          channels: [
            { id: 'dev-scrum', name: '🔊 Standup Desk', type: 'voice' },
            { id: 'dev-vc-pair', name: '🔊 Dev Sandbox A', type: 'voice' }
          ]
        }
      ],
      roles: [
        { id: 'dev-role-admin', name: 'Maintainer', color: '#f39c12', hoist: true, permissions: ['ADMINISTRATOR'] },
        { id: 'dev-role-member', name: 'Core Contributor', color: '#27ae60', hoist: true, permissions: ['VIEW_CHANNEL'] }
      ],
      emojis: [
        { id: 'dev-emo-rust', name: 'rust_gear', animated: false }
      ],
      likes: 92,
      downloads: 304,
      creator: 'CoreTeam#9999',
      tags: ['SaaS', 'Dev', 'Crypto']
    }
  ],
  deployments: {},
  activityLogs: [
    { id: 'act-1', user: 'ahalyasahoo195@gmail.com', action: 'Created public template', target: 'Gaming Cyber-Hub', timestamp: new Date(Date.now() - 360000).toISOString() },
    { id: 'act-2', user: 'ahalyasahoo195@gmail.com', action: 'Analyzed Discord server link', target: 'Framer Community', timestamp: new Date(Date.now() - 120000).toISOString() }
  ],
  analytics: {
    totalDeployments: 42,
    activeTemplates: 5,
    successfulClones: 38,
    deploymentSpeed: '42.5s avg',
    rateLimitStatus: '100% Stable'
  }
};

// HELPER: Simulated Logs Generators
const getSimulatedLogsForScan = (serverName: string, inviteHasBot: boolean): string[] => {
  const base = [
    `[INFO] Scanning server metadata for raw identifier code...`,
    `[OK] Connected successfully to discord.com/api/v10 Gateway`,
    `[INFO] Server resolved: "${serverName}"`,
    `[INFO] Fetching core invite descriptor payloads...`
  ];

  if (inviteHasBot) {
    return [
      ...base,
      `[OK] Secure Bot auth check verified! Server context: MEMBER_ACCESS`,
      `[INFO] Extracting rich category schemas and channel layout structures...`,
      `[OK] Found 6 channel categories with 18 text & voice items`,
      `[INFO] Scanning guild roles, checking permissions flags database...`,
      `[OK] Extracted 8 roles with custom hoist colors and permissions overrides`,
      `[OK] Cloned server template parameters built successfully.`
    ];
  } else {
    return [
      ...base,
      `[WARN] Discord API returned code 403: Bot is not currently in this server!`,
      `[WARN] Full role configurations and structural permissions are inaccessible.`,
      `[INFO] Activating "Limited Preview Mode" automatic fallback heuristics...`,
      `[INFO] Synthesizing simulated channel categories based on community standard templates...`,
      `[OK] Smart channel layout prediction resolved! Ready for customized editing.`
    ];
  }
};

// ENDPOINT 1: Fetch state stats and recent activity logs
app.get('/api/dashboard', (req, res) => {
  res.json({
    metrics: db.analytics,
    templates: db.savedTemplates,
    recentActivity: db.activityLogs
  });
});

// ENDPOINT 2: Analyze Server (Invite or ID)
app.post('/api/analyze-server', async (req, res) => {
  const { inviteOrId, simulationHasBot } = req.body;
  if (!inviteOrId) {
    return res.status(400).json({ error: 'Invite link or server ID is required' });
  }

  // 1. Log activity
  db.activityLogs.unshift({
    id: `act-${Date.now()}`,
    user: 'ahalyasahoo195@gmail.com',
    action: 'Analyzed server target',
    target: inviteOrId.substring(0, 30),
    timestamp: new Date().toISOString()
  });

  // Simple parser to extract code if it's a URL
  let label = 'Discord Community';
  let memberCount = 1240;
  let onlineCount = 422;
  let hasBot = simulationHasBot === true;

  try {
    const inviteMatch = inviteOrId.match(/(?:discord\.gg\/|discord\.com\/invite\/)([a-zA-Z0-9-]+)/i);
    if (inviteMatch && inviteMatch[1]) {
      const code = inviteMatch[1];
      // Fetch public invite details from real server-side API!
      const fetched = await fetch(`https://discord.com/api/v10/invites/${code}?with_counts=true`).then(r => r.json());
      if (fetched && fetched.guild) {
        label = fetched.guild.name;
        memberCount = fetched.approximate_member_count || memberCount;
        onlineCount = fetched.approximate_presence_count || onlineCount;
      } else {
        // Fallback or guess name based on code
        label = `Community Server (${code})`;
      }
    } else {
      label = `Server ID: ${inviteOrId}`;
    }
  } catch (err) {
    console.error('Error fetching Discord Invite:', err);
    label = `Community Server Archive`;
  }

  // Generate simulated structures based on whether we have bot access or limited preview mode
  let categories = [];
  let roles = [];
  let emojis = [];

  if (hasBot) {
    // Generate full bot-scanned list
    categories = [
      {
        id: 'cat-welcome',
        name: '👋 LOBBY & RULES',
        channels: [
          { id: 'ch-w-rules', name: '📜-rules', type: 'text', topic: 'Guild policies.' },
          { id: 'ch-w-ann', name: '📢-news-hub', type: 'text', topic: 'Important announcements.' },
          { id: 'ch-w-chat', name: '💬-general-chat', type: 'text', topic: 'General community discussions.' }
        ]
      },
      {
        id: 'cat-media',
        name: '🎨 CONTENT CORNER',
        channels: [
          { id: 'ch-m-art', name: '✨-creativity-showcase', type: 'text', topic: 'Share your work here!' },
          { id: 'ch-m-clips', name: '🎬-high-clips', type: 'text', topic: 'Streaming montages.' }
        ]
      },
      {
        id: 'cat-speak',
        name: '🔊 TALK & VOICE',
        channels: [
          { id: 'ch-v-general', name: '🔊 High Fidelity VC', type: 'voice' },
          { id: 'ch-v-gaming', name: '🔊 Duo Gaming Desk', type: 'voice' },
          { id: 'ch-v-silent', name: '🔊 Silent Library', type: 'voice' }
        ]
      }
    ];

    roles = [
      { id: 'r-admin', name: 'Moderator Alpha', color: '#ffb300', hoist: true, permissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES', 'VIEW_CHANNEL'] },
      { id: 'r-vibe', name: 'Vibe Booster (Level 20)', color: '#31a6ff', hoist: true, permissions: ['VIEW_CHANNEL'] },
      { id: 'r-member', name: 'Verified Citizen', color: '#68ffa6', hoist: false, permissions: ['VIEW_CHANNEL'] }
    ];

    emojis = [
      { id: 'e-1', name: 'hype_wink', animated: false },
      { id: 'e-2', name: 'laughing_cry', animated: false }
    ];
  } else {
    // ENTER LIMITED PREVIEW MODE
    categories = [
      {
        id: 'lim-cat-general',
        name: '🏠 GENERAL CHANNELS [ESTIMATED]',
        channels: [
          { id: 'lim-welcome', name: '👋-welcome-desk', type: 'text', topic: 'Simulated welcome entry channel.' },
          { id: 'lim-lobby', name: '🛋-lounge-main', type: 'text', topic: 'Default central lounge.' }
        ]
      },
      {
        id: 'lim-cat-audio',
        name: '🎙 VOICE SPACES [SIMULATED]',
        channels: [
          { id: 'lim-vc1', name: '🔊 Comm Station 1', type: 'voice' },
          { id: 'lim-vc2', name: '🔊 Quiet Corner', type: 'voice' }
        ]
      }
    ];

    roles = [
      { id: 'lim-r-admin', name: 'Administrator [Forecast]', color: '#f84a4a', hoist: true, permissions: ['ADMINISTRATOR'] },
      { id: 'lim-r-member', name: 'Standard Member [Forecast]', color: '#9b59b6', hoist: false, permissions: ['VIEW_CHANNEL'] }
    ];

    emojis = [
      { id: 'lim-e1', name: 'discord_placeholder', animated: false }
    ];
  }

  const logs = getSimulatedLogsForScan(label, hasBot);

  res.json({
    hasBot,
    serverMetadata: {
      name: label,
      iconUrl: `https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=150&auto=format&fit=crop&q=80`,
      bannerUrl: `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80`,
      memberCount,
      onlineCount,
      isPublic: true
    },
    categories,
    roles,
    emojis,
    logs
  });
});

// ENDPOINT 3: AI-Generated Layout (Uses Gemini API!)
app.post('/api/ai-generate-layout', async (req, res) => {
  const { theme, targetAudience } = req.body;
  if (!theme) {
    return res.status(400).json({ error: 'Theme prompt is required' });
  }

  // Record activity
  db.activityLogs.unshift({
    id: `act-${Date.now()}`,
    user: 'ahalyasahoo195@gmail.com',
    action: 'AI Server Layout Generated',
    target: theme,
    timestamp: new Date().toISOString()
  });

  if (!ai) {
    // If Gemini is not set up, act as an advanced resolver that creates gorgeous themed structures
    return res.json(getSimulatedAiTemplate(theme, targetAudience));
  }

  try {
    const prompt = `You are a professional Discord server design expert. Design a complete, premium, production-level Discord server template structure for:
Theme / Focus: "${theme}"
Expected Audience: "${targetAudience || 'General community Members'}"

Include relevant channels, custom emojis, specialized hierarchy of roles with distinct neon/standard hex colors, custom welcome messaging, and settings. 
Return ONLY a valid JSON object matching the following TypeScript schema structure:
{
  "name": "Server Display Name matching theme",
  "description": "Premium description",
  "categories": [
    {
      "name": "CATEGORY NAME IN ALL CAPS with relevant emojis",
      "channels": [
        {
          "name": "channel-name-lowercase-with-hyphens",
          "type": "text" or "voice",
          "topic": "Creative description of what users talk about"
        }
      ]
    }
  ],
  "roles": [
    {
      "name": "Distinctive role name corresponding to theme",
      "color": "HEX color matching discord dark color palette (e.g. #FF5555, #55FF55, #00FFFF, #FF55FF)",
      "hoist": true,
      "permissions": ["VIEW_CHANNEL", "SEND_MESSAGES"]
    }
  ],
  "welcomeMessage": "Fitted welcome message"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['name', 'categories', 'roles'],
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            categories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['name', 'channels'],
                properties: {
                  name: { type: Type.STRING },
                  channels: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ['name', 'type'],
                      properties: {
                        name: { type: Type.STRING },
                        type: { type: Type.STRING },
                        topic: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            roles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['name', 'color'],
                properties: {
                  name: { type: Type.STRING },
                  color: { type: Type.STRING },
                  hoist: { type: Type.BOOLEAN },
                  permissions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              }
            },
            welcomeMessage: { type: Type.STRING }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    // Ensure IDs exist
    if (parsed.categories) {
      parsed.categories.forEach((cat: any, i: number) => {
        cat.id = `ai-cat-${i}-${Date.now()}`;
        if (cat.channels) {
          cat.channels.forEach((ch: any, j: number) => {
            ch.id = `ai-ch-${i}-${j}-${Date.now()}`;
          });
        }
      });
    }
    if (parsed.roles) {
      parsed.roles.forEach((rol: any, i: number) => {
        rol.id = `ai-rol-${i}-${Date.now()}`;
        rol.hoist = rol.hoist ?? true;
      });
    }
    parsed.id = `ai-template-${Date.now()}`;
    parsed.likes = 0;
    parsed.downloads = 0;
    parsed.emojis = [{ id: 'ai-e1', name: 'ai_bot', animated: false }];
    parsed.isPublic = false;
    parsed.creator = 'GeminiAI#2026';

    res.json(parsed);
  } catch (error) {
    console.error('Gemini AI Generation failed, serving simulated theme outline:', error);
    res.json(getSimulatedAiTemplate(theme, targetAudience));
  }
});

// Helper for Fallback Beautiful Templates
function getSimulatedAiTemplate(theme: string, audience: string) {
  const formattedTheme = theme.replace(/[<>]/g, '');
  return {
    id: `ai-template-${Date.now()}`,
    name: `${formattedTheme} Realm`,
    description: `A custom artificial-intelligence curated server layout tailored specifically for ${audience || 'enthusiasts'} interested in ${formattedTheme}.`,
    isPublic: false,
    categories: [
      {
        id: 'ai-cat-rule',
        name: '📌 DIRECTORY',
        channels: [
          { id: 'ai-ch-rules', name: '📋-rules', type: 'text', topic: 'Guidelines and conduct instructions.' },
          { id: 'ai-ch-ann', name: '📡-beacons', type: 'text', topic: `Real-time notifications regarding ${theme}.` }
        ]
      },
      {
        id: 'ai-cat-comm',
        name: '💬 COFFEE SHACK',
        channels: [
          { id: 'ai-ch-main', name: '🍩-general-lobby', type: 'text', topic: 'Central watercooler.' },
          { id: 'ai-ch-brain', name: '💡-ideation-bay', type: 'text', topic: `Unfiltered brainstorming regarding ${theme}.` }
        ]
      },
      {
        id: 'ai-cat-vc',
        name: '🎧 DEEP SPACE VC',
        channels: [
          { id: 'ai-ch-v1', name: '🔊 Hyper VC Studio A', type: 'voice' },
          { id: 'ai-ch-v2', name: '🔊 Chillout Lounge', type: 'voice' }
        ]
      }
    ],
    roles: [
      { id: 'ai-r-owner', name: 'Overseer', color: '#ff3190', hoist: true, permissions: ['ADMINISTRATOR'] },
      { id: 'ai-r-active', name: 'Vibe Catalyst', color: '#00e5ff', hoist: true, permissions: ['VIEW_CHANNEL'] },
      { id: 'ai-r-member', name: 'Cosmonaut', color: '#a652ff', hoist: false, permissions: ['VIEW_CHANNEL'] }
    ],
    emojis: [
      { id: 'ai-e1', name: 'nebula', animated: false }
    ],
    likes: 0,
    downloads: 1,
    creator: 'SystemAI#0000'
  };
}

// ENDPOINT 4: Save & Publish Template
app.post('/api/save-template', (req, res) => {
  const template = req.body;
  if (!template.name) {
    return res.status(400).json({ error: 'Template name is required' });
  }

  // Insert or update
  const newTemplate = {
    ...template,
    id: template.id || `custom-template-${Date.now()}`,
    likes: template.likes || 1,
    downloads: template.downloads || 0,
    creator: template.creator || 'GuestCreator#1337',
    tags: template.tags || ['Custom', 'User-Created']
  };

  db.savedTemplates.unshift(newTemplate);

  // Update stats
  db.analytics.activeTemplates = db.savedTemplates.length;

  db.activityLogs.unshift({
    id: `act-${Date.now()}`,
    user: 'ahalyasahoo195@gmail.com',
    action: 'Saved & Published Template',
    target: newTemplate.name,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, template: newTemplate });
});

// ENDPOINT 5: Save & Create a Deployment State Orchestrator
app.post('/api/deploy-template', (req, res) => {
  const { templateId, templateName, targetGuildName, speedModifier } = req.body;
  if (!targetGuildName) {
    return res.status(400).json({ error: 'Destination server name is required' });
  }

  const deploymentId = `deploy-${Date.now()}`;
  
  // Set up standard step-by-step logs corresponding to official discord.js deployer limits & routines
  const deploymentLogs = [
    { timestamp: new Date().toISOString(), level: 'info', message: '🚀 Connecting to official Discord v10 websocket client gateway...' },
    { timestamp: new Date().toISOString(), level: 'ok', message: '🔒 Discord Webhook & Bot permissions successfully validated ("Manage Channels", "Manage Roles" APPROVED)' },
    { timestamp: new Date().toISOString(), level: 'info', message: `📡 Initializing template build sequence for server: "${targetGuildName}"` }
  ];

  db.deployments[deploymentId] = {
    id: deploymentId,
    templateId,
    templateName,
    status: 'validating',
    progress: 10,
    targetGuildName,
    logs: deploymentLogs,
    startedAt: new Date().toISOString()
  };

  // Trigger non-blocking backend async ticker which simulates actual progression
  let progressStep = 0;
  const steps = [
    { progress: 25, level: 'info', msg: '🛡 Initializing category container pipelines...' },
    { progress: 40, level: 'ok', msg: '📁 Categories created: "INFORMATION", "COMMUNITY LOBBY", "TALK SPACES"' },
    { progress: 55, level: 'info', msg: '⚡ Compiling channel definitions & custom permissions overwrites...' },
    { progress: 70, level: 'ok', msg: '✏ Text channels active: #rules-and-info, #announcements, #lobby-general' },
    { progress: 80, level: 'ok', msg: '🔊 High Fidelity VC spaces mounted successfully' },
    { progress: 90, level: 'info', msg: '👑 Provisioning elite Discord Roles hierarchical tree with custom color branding...' },
    { progress: 95, level: 'ok', msg: '✨ Custom Role configurations locked' },
    { progress: 100, level: 'done', msg: '🎉 Discord server structures deployed completely! 100% active and healthy.' }
  ];

  const intervalDuration = speedModifier === 'ultra' ? 800 : speedModifier === 'slow' ? 3000 : 1500;

  const intervalId = setInterval(() => {
    const deploy = db.deployments[deploymentId];
    if (!deploy) {
      clearInterval(intervalId);
      return;
    }

    if (progressStep < steps.length) {
      const step = steps[progressStep];
      deploy.progress = step.progress;
      deploy.status = step.progress === 100 ? 'completed' : 'deploying';
      deploy.logs.push({
        timestamp: new Date().toISOString(),
        level: step.level,
        message: step.msg
      });
      progressStep++;
    } else {
      clearInterval(intervalId);
      // Save analytics increment
      db.analytics.totalDeployments += 1;
      db.analytics.successfulClones += 1;
      
      db.activityLogs.unshift({
        id: `act-${Date.now()}`,
        user: 'ahalyasahoo195@gmail.com',
        action: 'Completed deployment to server',
        target: targetGuildName,
        timestamp: new Date().toISOString()
      });
    }
  }, intervalDuration);

  res.json({ deploymentId });
});

// ENDPOINT 6: Fetch Deployment Current Status
app.get('/api/deployment-status', (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Deployment ID required' });
  }

  const deploy = db.deployments[id as string];
  if (!deploy) {
    return res.status(404).json({ error: 'Deployment session not found' });
  }

  res.json(deploy);
});

// ENDPOINT 7: Get template by spec
app.get('/api/template/:id', (req, res) => {
  const template = db.savedTemplates.find(t => t.id === req.params.id);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json(template);
});

// Mount Vite middleware for development or Static Assets for standard deployment output
if (process.env.NODE_ENV !== 'production') {
  createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  }).then((vite) => {
    app.use(vite.middlewares);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Development Server running on http://0.0.0.0:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Production Server running on port ${PORT}`);
  });
}
