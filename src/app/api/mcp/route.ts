import { createMcpHandler } from 'mcp-handler'
import { getEnvConfig } from '@/types/env'
import { SpaceApiService } from '@/lib/space-apis/space-api-service'

const config = getEnvConfig()
const spaceApiService = new SpaceApiService(config)

const handler = createMcpHandler(
  (server) => {
    // MCP Tools - Actions that can be performed
    
    /**
     * Get detailed information about a specific space mission
     */
    server.tool(
      'getMissionDetails',
      'Get detailed information about a specific space mission by ID',
      {
        type: 'object',
        properties: {
          missionId: {
            type: 'string',
            description: 'The unique identifier for the space mission'
          }
        },
        required: ['missionId']
      },
      async (params) => {
        const missionId = params.missionId
        try {
          const mission = await spaceApiService.getMissionDetails(missionId)
          
          return {
            content: [
              {
                type: 'text',
                text: `# 🚀 Mission: ${mission.name}\n\n` +
                      `**Agency:** ${mission.agency}\n` +
                      `**Status:** ${mission.status}\n` +
                      `**Launch Date:** ${mission.launch_date || 'TBD'}\n` +
                      `**Rocket:** ${mission.rocket || 'Unknown'}\n` +
                      `**Destination:** ${mission.destination || 'Earth Orbit'}\n\n` +
                      `**Description:** ${mission.description || 'No description available'}\n\n` +
                      `${mission.live_stream_url ? `🔴 [Live Stream](${mission.live_stream_url})` : ''}`
              }
            ]
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Error fetching mission details: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ],
            isError: true
          }
        }
      }
    )

    /**
     * Get real-time International Space Station position
     */
    server.tool(
      'getISSPosition',
      'Get the current real-time position of the International Space Station',
      {
        type: 'object',
        properties: {
          include_passes: {
            type: 'boolean',
            description: 'Whether to include upcoming ISS passes over specific locations',
            default: false
          }
        },
        required: []
      },
      async (params) => {
        const include_passes = params.include_passes === true
        try {
          const issData = await spaceApiService.getISSPosition(include_passes)
          
          const passInfo = issData.next_passes && issData.next_passes.length > 0 
            ? `\n\n**Next Passes:**\n${issData.next_passes.map(pass => 
                `🛰️ ${new Date(pass.rise_time).toLocaleString()} - ${new Date(pass.set_time).toLocaleString()} (${Math.round(pass.duration_seconds / 60)} min)`
              ).join('\n')}`
            : ''

          return {
            content: [
              {
                type: 'text',
                text: `# 🛰️ International Space Station - Live Position\n\n` +
                      `**Location:** ${issData.latitude.toFixed(4)}°N, ${issData.longitude.toFixed(4)}°E\n` +
                      `**Altitude:** ${issData.altitude_km.toFixed(1)} km\n` +
                      `**Speed:** ${issData.velocity_kmh.toFixed(0)} km/h\n` +
                      `**Orbital Period:** ${issData.orbital_period_minutes.toFixed(1)} minutes\n` +
                      `**Last Updated:** ${new Date(issData.timestamp * 1000).toLocaleString()}${passInfo}`
              }
            ]
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Error fetching ISS position: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ],
            isError: true
          }
        }
      }
    )

    /**
     * Get upcoming rocket launches with countdown timers
     */
    server.tool(
      'getUpcomingLaunches',
      'Get upcoming rocket launches within a specified time period',
      {
        type: 'object',
        properties: {
          days: {
            type: 'number',
            description: 'Number of days to look ahead for upcoming launches',
            default: 30,
            minimum: 1,
            maximum: 365
          }
        },
        required: []
      },
      async (params) => {
        try {
          const days = params.days && typeof params.days === 'number' ? Math.min(Math.max(params.days, 1), 365) : 30
          const launches = await spaceApiService.getUpcomingLaunches({ days, limit: 50 })
          
          if (launches.length === 0) {
            return {
              content: [
                {
                  type: 'text',
                  text: `🗓️ No upcoming launches found in the next ${days} days.`
                }
              ]
            }
          }

          const launchList = launches.map(launch => {
            const launchDate = new Date(launch.launch_date)
            const now = new Date()
            const timeUntilLaunch = launchDate.getTime() - now.getTime()
            const daysUntil = Math.ceil(timeUntilLaunch / (1000 * 60 * 60 * 24))
            
            return `🚀 **${launch.name}** (${launch.agency})\n` +
                   `   Rocket: ${launch.rocket}\n` +
                   `   Launch: ${launchDate.toLocaleDateString()} at ${launchDate.toLocaleTimeString()}\n` +
                   `   Site: ${launch.launch_site}\n` +
                   `   ⏰ ${daysUntil > 0 ? `${daysUntil} days to go` : 'Launching soon!'}\n` +
                   `   ${launch.live_stream_url ? `🔴 [Live Stream](${launch.live_stream_url})` : ''}`
          }).join('\n\n')

          return {
            content: [
              {
                type: 'text',
                text: `# 🗓️ Upcoming Launches (Next ${days} days):\n\n${launchList}`
              }
            ]
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Error fetching upcoming launches: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ],
            isError: true
          }
        }
      }
    )

    // MCP Resources - Read-only data endpoints
    
    /**
     * Current ISS data resource
     */
    server.resource(
      'Current International Space Station position and orbital data',
      'space://iss/current',
      async () => {
        try {
          const issData = await spaceApiService.getISSPosition(true)
          return {
            contents: [
              {
                uri: 'space://iss/current',
                mimeType: 'application/json',
                text: JSON.stringify(issData, null, 2)
              }
            ]
          }
        } catch (error) {
          throw new Error(`Failed to fetch ISS data: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    )
  },
  {},
  { basePath: '/api' }
)

// MCP Discovery endpoint for GET requests
export async function GET(request: Request) {
  // Handle MCP discovery and capabilities
  const url = new URL(request.url)
  
  // Server capabilities and info
  if (url.pathname.endsWith('/mcp')) {
    return Response.json({
      jsonrpc: '2.0',
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
          logging: {}
        },
        serverInfo: {
          name: 'galactic-grid-mcp-server',
          version: '1.0.0',
          description: 'AI-Powered Space Mission Tracking MCP Server',
          author: 'Galactic Grid',
          homepage: 'https://github.com/samiur-r/galactic-grid'
        },
        instructions: 'This MCP server provides real-time space mission data, ISS tracking, and rocket launch information. Use the available tools to get live space data and the resources for cached information.'
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })
  }

  // Fallback to handler for other GET requests
  return handler(request)
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
}

export { handler as POST, handler as DELETE }