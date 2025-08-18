export interface SpaceApiConfig {
  NASA_API_KEY?: string
  LAUNCH_LIBRARY_API_KEY?: string
  N2YO_API_KEY?: string
  SPACEX_API_URL: string
  NASA_API_URL: string
  LAUNCH_LIBRARY_API_URL: string
  ISS_API_URL: string
  N2YO_API_URL: string
}

export interface McpConfig {
  MCP_SERVER_PORT: number
  MCP_SERVER_HOST: string
  MCP_CLIENT_TRANSPORT: 'http' | 'sse' | 'stdio'
  MCP_CLIENT_TIMEOUT: number
  REDIS_URL?: string
}

export interface AppConfig extends SpaceApiConfig, McpConfig {
  OPENAI_API_KEY: string
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: number
  RATE_LIMIT_WINDOW_MS: number
  RATE_LIMIT_MAX_REQUESTS: number
  CACHE_TTL_SECONDS: number
}

export const getEnvConfig = (): AppConfig => ({
  // Space API Keys
  NASA_API_KEY: process.env.NASA_API_KEY,
  LAUNCH_LIBRARY_API_KEY: process.env.LAUNCH_LIBRARY_API_KEY,
  N2YO_API_KEY: process.env.N2YO_API_KEY,

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',

  // MCP Configuration
  MCP_SERVER_PORT: parseInt(process.env.MCP_SERVER_PORT || '3001'),
  MCP_SERVER_HOST: process.env.MCP_SERVER_HOST || 'localhost',
  MCP_CLIENT_TRANSPORT: (process.env.MCP_CLIENT_TRANSPORT as 'http' | 'sse' | 'stdio') || 'http',
  MCP_CLIENT_TIMEOUT: parseInt(process.env.MCP_CLIENT_TIMEOUT || '30000'),
  REDIS_URL: process.env.REDIS_URL,

  // Server Configuration
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  PORT: parseInt(process.env.PORT || '3001'),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS || '300'),

  // Space API Endpoints
  SPACEX_API_URL: process.env.SPACEX_API_URL || 'https://api.spacexdata.com/v4',
  NASA_API_URL: process.env.NASA_API_URL || 'https://api.nasa.gov',
  LAUNCH_LIBRARY_API_URL: process.env.LAUNCH_LIBRARY_API_URL || 'https://ll.thespacedevs.com/2.2.0',
  ISS_API_URL: process.env.ISS_API_URL || 'http://api.open-notify.org',
  N2YO_API_URL: process.env.N2YO_API_URL || 'https://api.n2yo.com/rest/v1/satellite'
})