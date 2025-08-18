import { z } from 'zod'

// Space Mission Types
export const MissionStatusSchema = z.enum([
  'upcoming',
  'in_flight',
  'success',
  'failure',
  'partial_failure',
  'cancelled'
])

export const SpaceAgencySchema = z.enum([
  'SpaceX',
  'NASA',
  'ESA',
  'ISRO',
  'CNSA',
  'Roscosmos',
  'JAXA',
  'Blue Origin',
  'Virgin Galactic',
  'Other'
])

export const MissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  agency: SpaceAgencySchema,
  status: MissionStatusSchema,
  launch_date: z.string().datetime().optional(),
  mission_type: z.string().optional(),
  destination: z.string().optional(),
  rocket: z.string().optional(),
  payload: z.string().optional(),
  cost: z.number().optional(),
  crew_size: z.number().optional(),
  success_rate: z.number().min(0).max(100).optional(),
  live_stream_url: z.string().url().optional(),
  details_url: z.string().url().optional()
})

// Launch Types
export const LaunchSchema = z.object({
  id: z.string(),
  mission_id: z.string(),
  name: z.string(),
  agency: SpaceAgencySchema,
  rocket: z.string(),
  launch_date: z.string().datetime(),
  launch_time_utc: z.string().datetime(),
  launch_site: z.string(),
  status: z.enum(['scheduled', 'go', 'hold', 'scrubbed', 'launched', 'failed']),
  countdown_seconds: z.number().optional(),
  live_stream_url: z.string().url().optional(),
  weather_conditions: z.object({
    condition: z.string(),
    temperature: z.number(),
    wind_speed: z.number(),
    precipitation: z.number()
  }).optional()
})

// ISS Position Types
export const ISSPositionSchema = z.object({
  timestamp: z.number(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  altitude_km: z.number(),
  velocity_kmh: z.number(),
  orbital_period_minutes: z.number(),
  next_passes: z.array(z.object({
    rise_time: z.string().datetime(),
    set_time: z.string().datetime(),
    duration_seconds: z.number()
  })).optional()
})

// Satellite Types
export const SatelliteSchema = z.object({
  id: z.string(),
  name: z.string(),
  norad_id: z.number(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  altitude_km: z.number(),
  velocity_kmh: z.number(),
  visibility: z.enum(['visible', 'eclipsed', 'daylight']),
  country: z.string(),
  launch_date: z.string().datetime().optional()
})

// Search Parameters
export const MissionSearchSchema = z.object({
  query: z.string().optional(),
  agency: SpaceAgencySchema.optional(),
  status: MissionStatusSchema.optional(),
  mission_type: z.string().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
})

export const LaunchSearchSchema = z.object({
  days: z.number().min(1).max(365).default(30),
  agency: SpaceAgencySchema.optional(),
  rocket: z.string().optional(),
  limit: z.number().min(1).max(100).default(20)
})

// MCP Tool Schemas
export const GetMissionDetailsSchema = z.object({
  missionId: z.string().describe('The unique identifier of the mission')
})

export const SearchMissionsSchema = MissionSearchSchema

export const GetUpcomingLaunchesSchema = LaunchSearchSchema

export const GetISSPositionSchema = z.object({
  include_passes: z.boolean().default(false).describe('Include next ISS passes over Earth')
})

export const GetSatelliteDataSchema = z.object({
  satelliteId: z.string().optional().describe('Specific satellite ID, if not provided returns multiple satellites'),
  category: z.enum(['active', 'inactive', 'debris']).default('active').describe('Satellite category to filter by'),
  limit: z.number().min(1).max(50).default(10).describe('Maximum number of satellites to return')
})

// Type exports
export type Mission = z.infer<typeof MissionSchema>
export type Launch = z.infer<typeof LaunchSchema>
export type ISSPosition = z.infer<typeof ISSPositionSchema>
export type Satellite = z.infer<typeof SatelliteSchema>
export type MissionSearch = z.infer<typeof MissionSearchSchema>
export type LaunchSearch = z.infer<typeof LaunchSearchSchema>
export type SpaceAgency = z.infer<typeof SpaceAgencySchema>
export type MissionStatus = z.infer<typeof MissionStatusSchema>