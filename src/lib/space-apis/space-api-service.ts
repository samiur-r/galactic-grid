import { 
  type Mission, 
  type Launch, 
  type ISSPosition, 
  type Satellite,
  type MissionSearch,
  type LaunchSearch,
  type AppConfig
} from '@/types/space'

export class SpaceApiService {
  constructor(private config: AppConfig) {}

  async getMissionDetails(missionId: string): Promise<Mission> {
    // Mock data for testing
    return {
      id: missionId,
      name: 'Test Mission: Falcon 9 Demo',
      description: 'A demonstration mission for testing our MCP server',
      agency: 'SpaceX',
      status: 'upcoming',
      launch_date: '2024-02-15T15:30:00Z',
      mission_type: 'Satellite Deployment',
      rocket: 'Falcon 9',
      payload: 'Starlink Satellites',
      live_stream_url: 'https://www.spacex.com/launches/'
    }
  }

  async searchMissions(params: MissionSearch): Promise<Mission[]> {
    // Mock data for testing
    return [
      {
        id: 'spacex-demo-1',
        name: 'Falcon 9 Starlink Mission',
        description: 'Deploy Starlink satellites to orbit',
        agency: 'SpaceX',
        status: 'upcoming',
        launch_date: '2024-02-20T10:00:00Z',
        rocket: 'Falcon 9',
        payload: 'Starlink Group 6-37'
      },
      {
        id: 'nasa-demo-1',
        name: 'Artemis III Prep Mission',
        description: 'Preparation mission for Artemis III lunar landing',
        agency: 'NASA',
        status: 'upcoming',
        launch_date: '2024-03-15T14:30:00Z',
        rocket: 'SLS Block 1',
        payload: 'Lunar Gateway Module'
      }
    ]
  }

  async getUpcomingLaunches(params: LaunchSearch): Promise<Launch[]> {
    // Mock data for testing
    return [
      {
        id: 'launch-1',
        mission_id: 'spacex-demo-1',
        name: 'Falcon 9 Starlink-6-37',
        agency: 'SpaceX',
        rocket: 'Falcon 9 Block 5',
        launch_date: '2024-02-20T10:00:00Z',
        launch_time_utc: '2024-02-20T10:00:00Z',
        launch_site: 'Kennedy Space Center LC-39A',
        status: 'scheduled',
        live_stream_url: 'https://www.spacex.com/launches/'
      }
    ]
  }

  async getISSPosition(includePasses: boolean = false): Promise<ISSPosition> {
    // Real ISS API call for testing
    try {
      const response = await fetch('http://api.open-notify.org/iss-now.json')
      const data = await response.json()
      
      return {
        timestamp: data.timestamp,
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
        altitude_km: 408,
        velocity_kmh: 27600,
        orbital_period_minutes: 93,
        ...(includePasses && {
          next_passes: [
            {
              rise_time: '2024-02-15T20:30:00Z',
              set_time: '2024-02-15T20:36:00Z',
              duration_seconds: 360
            }
          ]
        })
      }
    } catch (error) {
      throw new Error(`Failed to fetch ISS position: ${error}`)
    }
  }

  async getSatelliteData(params: any): Promise<Satellite[]> {
    // Mock data for testing
    return [
      {
        id: 'iss',
        name: 'International Space Station',
        norad_id: 25544,
        latitude: 42.3601,
        longitude: -71.0589,
        altitude_km: 408,
        velocity_kmh: 27600,
        visibility: 'visible',
        country: 'International'
      }
    ]
  }

  async getAllMissions(): Promise<Mission[]> {
    return this.searchMissions({ limit: 10 })
  }
}