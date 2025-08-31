import {
  type Mission,
  type Launch,
  type ISSPosition,
  type Satellite,
  type MissionSearch,
  type LaunchSearch,
  type MissionStatus,
} from "@/types/space";
import { type AppConfig } from "@/types/env";

/** ---------- External API Types (minimal fields we use) ---------- */

/** SpaceX v4 Launch (subset) */
interface SpaceXLinks {
  webcast?: string | null;
}

interface SpaceXPayload {
  name?: string;
  type?: string;
}

interface SpaceXRocketRef {
  name?: string;
}

interface SpaceXLaunch {
  id: string;
  name: string;
  details?: string | null;
  date_utc: string;
  success: boolean | null;
  payloads?: SpaceXPayload[];
  rocket?: SpaceXRocketRef;
  links?: SpaceXLinks;
}

/** Launch Library 2 (subset) */
interface LLStatus {
  name?: string;
}

interface LLMission {
  id?: number | string;
  name?: string;
  type?: string;
  description?: string;
}

interface LLRocketConfiguration {
  name?: string;
  full_name?: string;
}

interface LLRocket {
  configuration?: LLRocketConfiguration;
}

interface LLProvider {
  name?: string;
}

interface LLPadLocation {
  name?: string;
}

interface LLPad {
  name?: string;
  location?: LLPadLocation;
}

interface LLVidURL {
  url?: string;
}

interface LLLaunch {
  id: number | string;
  name: string;
  status?: LLStatus;
  mission?: LLMission;
  rocket?: LLRocket;
  pad?: LLPad;
  net: string; // ISO date
  launch_service_provider?: LLProvider;
  vidURLs?: LLVidURL[];
  weather_summary?: string;
}

/** Launch Library list envelope (subset) */
interface LLList<T> {
  results?: T[];
}

/** Open Notify ISS-now (subset) */
interface OpenNotifyISSNow {
  timestamp: number;
  iss_position: {
    latitude: string;
    longitude: string;
  };
}

/** N2YO positions (subset) */
interface N2YOPositions {
  info?: { satname?: string };
  positions?: Array<{
    satlatitude: number;
    satlongitude: number;
    sataltitude: number;
    elevation?: number;
  }>;
}

/** ---------- Helpers ---------- */

type Agency = Mission["agency"]; // "SpaceX" | "NASA" | ... | "Other"

function normalizeAgency(raw?: string): Agency {
  if (!raw) return "Other";
  const n = raw.toLowerCase();

  if (n.includes("spacex") || n.includes("space exploration technologies"))
    return "SpaceX";
  if (n.includes("nasa") || n.includes("national aeronautics")) return "NASA";
  if (n.includes("esa") || n.includes("european space agency")) return "ESA";
  if (n.includes("isro") || n.includes("indian space research")) return "ISRO";
  if (n.includes("cnsa") || n.includes("china national space")) return "CNSA";
  if (n.includes("roscosmos")) return "Roscosmos";
  if (n.includes("jaxa") || n.includes("japan aerospace")) return "JAXA";
  if (n.includes("blue origin")) return "Blue Origin";
  if (n.includes("virgin galactic")) return "Virgin Galactic";

  return "Other";
}

/** ---------- Service ---------- */

export class SpaceApiService {
  constructor(private config: AppConfig) {}

  private mapSpaceXLaunchToMission(spacexData: SpaceXLaunch): Mission {
    return {
      id: spacexData.id,
      name: spacexData.name,
      description: spacexData.details || "SpaceX mission",
      agency: "SpaceX",
      status:
        spacexData.success === null
          ? "upcoming"
          : spacexData.success
          ? "success"
          : "failure",
      launch_date: spacexData.date_utc,
      mission_type: spacexData.payloads?.[0]?.type || "Unknown",
      rocket: spacexData.rocket?.name || "Falcon 9",
      payload:
        spacexData.payloads
          ?.map((p) => p.name)
          .filter((n): n is string => Boolean(n && n.length > 0))
          .join(", ") || "Unknown",
      live_stream_url: spacexData.links?.webcast || undefined,
    };
  }

  private mapLaunchLibraryToMission(llData: LLLaunch): Mission {
    return {
      id: String(llData.id),
      name: llData.name,
      description: llData.mission?.description || llData.name,
      agency: normalizeAgency(llData.launch_service_provider?.name),
      status: this.mapLaunchLibraryStatus(llData.status?.name ?? "TBD"),
      launch_date: llData.net,
      mission_type: llData.mission?.type || "Unknown",
      rocket: llData.rocket?.configuration?.name || "Unknown",
      payload: llData.mission?.name || "Unknown",
      live_stream_url: llData.vidURLs?.[0]?.url,
    };
  }

  private mapLaunchLibraryStatus(status: string): MissionStatus {
    const statusMap: Record<string, MissionStatus> = {
      "Go for Launch": "upcoming",
      TBD: "upcoming",
      Success: "success",
      Failure: "failure",
      "Partial Failure": "partial_failure",
      "In Flight": "in_flight",
    };
    return statusMap[status] || "upcoming";
  }

  private mapLaunchLibraryToLaunch(llData: LLLaunch): Launch {
    const launchStatus = llData.status?.name || "TBD";
    const statusMap: Record<string, Launch["status"]> = {
      "Go for Launch": "go",
      TBD: "scheduled",
      "To Be Determined": "scheduled",
      Success: "launched",
      Failure: "failed",
      "Partial Failure": "failed",
      "In Flight": "launched",
      Hold: "hold",
      Scrubbed: "scrubbed",
    };

    return {
      id: String(llData.id),
      mission_id:
        (llData.mission?.id != null ? String(llData.mission.id) : undefined) ||
        String(llData.id),
      name: llData.name,
      agency: normalizeAgency(llData.launch_service_provider?.name),
      rocket: llData.rocket?.configuration?.full_name || "Unknown",
      launch_date: llData.net,
      launch_time_utc: llData.net,
      launch_site: llData.pad?.name || llData.pad?.location?.name || "Unknown",
      status: statusMap[launchStatus] || "scheduled",
      live_stream_url: llData.vidURLs?.[0]?.url,
      weather_conditions: llData.weather_summary
        ? {
            condition: llData.weather_summary,
            temperature: 0,
            wind_speed: 0,
            precipitation: 0,
          }
        : undefined,
    };
  }

  async getMissionDetails(missionId: string): Promise<Mission> {
    try {
      // Try SpaceX API first
      const spacexResponse = await fetch(
        `${this.config.SPACEX_API_URL}/launches/${missionId}`
      );

      if (spacexResponse.ok) {
        const spacexData = (await spacexResponse.json()) as SpaceXLaunch;
        return this.mapSpaceXLaunchToMission(spacexData);
      }

      // Fallback to Launch Library API
      const llResponse = await fetch(
        `${this.config.LAUNCH_LIBRARY_API_URL}/launch/${missionId}/`
      );

      if (llResponse.ok) {
        const llData = (await llResponse.json()) as LLLaunch;
        return this.mapLaunchLibraryToMission(llData);
      }

      throw new Error("Mission not found in any API");
    } catch (error) {
      // Fallback to demo data if APIs fail
      // eslint-disable-next-line no-console
      console.warn(
        `Failed to fetch mission ${missionId}, using fallback:`,
        error
      );
      return {
        id: missionId,
        name: "SpaceX Falcon 9 Mission",
        description: "Commercial satellite deployment mission",
        agency: "SpaceX",
        status: "upcoming",
        launch_date: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        mission_type: "Commercial",
        rocket: "Falcon 9 Block 5",
        payload: "Commercial Satellites",
      };
    }
  }

  async searchMissions(params: MissionSearch): Promise<Mission[]> {
    try {
      const {
        limit = 20,
        offset = 0,
        agency,
        status,
        query,
        start_date,
        end_date,
      } = params;

      // First try Launch Library API for recent missions
      let llUrl = `${this.config.LAUNCH_LIBRARY_API_URL}/launch/?limit=${limit}&offset=${offset}`;

      if (start_date) llUrl += `&net__gte=${start_date}`;
      if (end_date) llUrl += `&net__lte=${end_date}`;
      if (agency)
        llUrl += `&launch_service_provider__name=${encodeURIComponent(agency)}`;
      if (query) llUrl += `&search=${encodeURIComponent(query)}`;

      const llResponse = await fetch(llUrl);
      const missions: Mission[] = [];

      if (llResponse.ok) {
        const llData = (await llResponse.json()) as LLList<LLLaunch>;
        const llMissions =
          llData.results?.map((launch) =>
            this.mapLaunchLibraryToMission(launch)
          ) || [];
        missions.push(...llMissions);
      }

      // Also try SpaceX API for SpaceX missions
      if (!agency || agency === "SpaceX") {
        const spacexUrl = `${
          this.config.SPACEX_API_URL
        }/launches?limit=${Math.min(limit, 100)}`;
        const spacexResponse = await fetch(spacexUrl);

        if (spacexResponse.ok) {
          const spacexData = (await spacexResponse.json()) as SpaceXLaunch[];
          let spacexMissions = spacexData.map((launch) =>
            this.mapSpaceXLaunchToMission(launch)
          );

          // Apply filters
          if (status) {
            spacexMissions = spacexMissions.filter((m) => m.status === status);
          }
          if (query) {
            const q = query.toLowerCase();
            spacexMissions = spacexMissions.filter((m) => {
              const name = m.name.toLowerCase();
              const desc = m.description?.toLowerCase() ?? "";
              return name.includes(q) || desc.includes(q);
            });
          }
          if (start_date || end_date) {
            const start = start_date ? new Date(start_date) : null;
            const end = end_date ? new Date(end_date) : null;
            spacexMissions = spacexMissions.filter((m) => {
              if (!m.launch_date) return false;
              const d = new Date(m.launch_date);
              if (start && d < start) return false;
              if (end && d > end) return false;
              return true;
            });
          }

          missions.push(...spacexMissions.slice(offset, offset + limit));
        }
      }

      // Remove duplicates and limit results
      const uniqueMissions = missions
        .filter(
          (mission, index, self) =>
            index === self.findIndex((m) => m.id === mission.id)
        )
        .slice(0, limit);

      return uniqueMissions;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Failed to search missions, using fallback:", error);
      // Fallback data
      return [
        {
          id: "fallback-spacex-1",
          name: "Falcon 9 Commercial Mission",
          description: "Commercial satellite deployment",
          agency: "SpaceX",
          status: "upcoming",
          launch_date: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          rocket: "Falcon 9 Block 5",
          payload: "Commercial Satellites",
        },
        {
          id: "fallback-nasa-1",
          name: "NASA Science Mission",
          description: "Scientific research mission",
          agency: "NASA",
          status: "upcoming",
          launch_date: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toISOString(),
          rocket: "Atlas V",
          payload: "Science Payload",
        },
      ];
    }
  }

  async getUpcomingLaunches(params: LaunchSearch): Promise<Launch[]> {
    try {
      const { days = 30, limit = 20, agency, rocket } = params;

      // Calculate date range
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      let url = `${
        this.config.LAUNCH_LIBRARY_API_URL
      }/launch/upcoming/?limit=${limit}&net__gte=${now.toISOString()}&net__lte=${futureDate.toISOString()}`;

      // Add filters if specified
      if (agency) {
        url += `&launch_service_provider__name=${encodeURIComponent(agency)}`;
      }
      if (rocket) {
        url += `&rocket__configuration__name=${encodeURIComponent(rocket)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Launch Library API error: ${response.status}`);
      }

      const data = (await response.json()) as LLList<LLLaunch>;

      return (
        data.results?.map((launch) => this.mapLaunchLibraryToLaunch(launch)) ||
        []
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Failed to fetch launches, using fallback:", error);
      // Fallback data
      return [
        {
          id: "fallback-1",
          mission_id: "unknown",
          name: "Upcoming Falcon 9 Mission",
          agency: "SpaceX",
          rocket: "Falcon 9 Block 5",
          launch_date: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          launch_time_utc: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          launch_site: "Kennedy Space Center",
          status: "scheduled",
        },
      ];
    }
  }

  async getISSPosition(includePasses: boolean = false): Promise<ISSPosition> {
    // Real ISS API call for testing
    try {
      const response = await fetch("http://api.open-notify.org/iss-now.json");
      const data = (await response.json()) as OpenNotifyISSNow;

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
              rise_time: "2024-02-15T20:30:00Z",
              set_time: "2024-02-15T20:36:00Z",
              duration_seconds: 360,
            },
          ],
        }),
      };
    } catch (error) {
      throw new Error(`Failed to fetch ISS position: ${String(error)}`);
    }
  }

  async getSatelliteData(params: {
    satelliteId?: string;
    category?: "active" | "inactive" | "debris";
    limit?: number;
  }): Promise<Satellite[]> {
    try {
      const { satelliteId, category = "active", limit = 10 } = params;
      void category; // currently unused, keep for future filtering

      // If specific satellite requested, try to get its data
      if (satelliteId) {
        if (satelliteId.toLowerCase() === "iss" || satelliteId === "25544") {
          // Get ISS data
          const issData = await this.getISSPosition(false);
          return [
            {
              id: "iss",
              name: "International Space Station",
              norad_id: 25544,
              latitude: issData.latitude,
              longitude: issData.longitude,
              altitude_km: issData.altitude_km,
              velocity_kmh: issData.velocity_kmh,
              visibility: "visible",
              country: "International",
            },
          ];
        }

        // For other satellites, use N2YO API if available
        if (this.config.N2YO_API_KEY) {
          try {
            const response = await fetch(
              `${this.config.N2YO_API_URL}/positions/${satelliteId}/0/0/0/1/?apiKey=${this.config.N2YO_API_KEY}`
            );
            if (response.ok) {
              const data = (await response.json()) as N2YOPositions;
              const first = data.positions?.[0];
              if (first) {
                return [
                  {
                    id: satelliteId,
                    name: data.info?.satname || `Satellite ${satelliteId}`,
                    norad_id: Number.parseInt(satelliteId, 10),
                    latitude: first.satlatitude,
                    longitude: first.satlongitude,
                    altitude_km: first.sataltitude,
                    velocity_kmh: 0, // N2YO doesn't provide velocity directly
                    visibility:
                      (first.elevation ?? 0) > 0 ? "visible" : "eclipsed",
                    country: "Unknown",
                  },
                ];
              }
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn("N2YO API error:", error);
          }
        }
      }

      // Return popular satellites as fallback
      const popularSatellites: Satellite[] = [
        {
          id: "iss",
          name: "International Space Station",
          norad_id: 25544,
          latitude: 0,
          longitude: 0,
          altitude_km: 408,
          velocity_kmh: 27600,
          visibility: "visible",
          country: "International",
        },
        {
          id: "hubble",
          name: "Hubble Space Telescope",
          norad_id: 20580,
          latitude: 0,
          longitude: 0,
          altitude_km: 547,
          velocity_kmh: 27400,
          visibility: "visible",
          country: "USA",
        },
        {
          id: "starlink",
          name: "Starlink Satellites",
          norad_id: 44713,
          latitude: 0,
          longitude: 0,
          altitude_km: 550,
          velocity_kmh: 27000,
          visibility: "visible",
          country: "USA",
        },
      ];

      return popularSatellites.slice(0, limit);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Failed to fetch satellite data, using fallback:", error);
      // Fallback to ISS data
      return [
        {
          id: "iss",
          name: "International Space Station",
          norad_id: 25544,
          latitude: 0,
          longitude: 0,
          altitude_km: 408,
          velocity_kmh: 27600,
          visibility: "visible",
          country: "International",
        },
      ];
    }
  }

  async getAllMissions(): Promise<Mission[]> {
    return this.searchMissions({ limit: 10, offset: 0 });
  }
}
