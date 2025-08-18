import { createMcpHandler } from 'mcp-handler'
import { 
  GetMissionDetailsSchema,
  GetUpcomingLaunchesSchema,
  GetISSPositionSchema
} from '@/types/space'
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
      GetMissionDetailsSchema,
      async ({ missionId }) => {
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
      GetISSPositionSchema,
      async ({ include_passes = false }) => {
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
      GetUpcomingLaunchesSchema,
      async (params) => {
        try {
          const launches = await spaceApiService.getUpcomingLaunches(params)
          
          if (launches.length === 0) {
            return {
              content: [
                {
                  type: 'text',
                  text: `🗓️ No upcoming launches found in the next ${params.days || 30} days.`
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
                text: `# 🗓️ Upcoming Launches (Next ${params.days || 30} days):\n\n${launchList}`
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
      'space://iss/current',
      'Current International Space Station position and orbital data',
      async () => {
        try {
          const issData = await spaceApiService.getISSPosition(true)
          return JSON.stringify(issData, null, 2)
        } catch (error) {
          throw new Error(`Failed to fetch ISS data: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    )
  },
  {},
  { basePath: '/api' }
)

export { handler as GET, handler as POST, handler as DELETE }