# 🚀 Galactic Grid

**AI-Powered Space Mission Tracking Platform with Model Context Protocol**

Galactic Grid is a production-ready space mission tracking application that demonstrates the power of Model Context Protocol (MCP). Chat with an AI assistant about space missions, track the International Space Station in real-time, and explore rocket launches from agencies worldwide including SpaceX and NASA.

🌟 **Built as an MCP Learning Project** - Perfect for understanding how to implement MCP servers and clients in real-world applications.

## ✨ Current Features

### 🤖 **AI-Powered Space Chat**
- **GPT-4 Integration**: Ask questions about space missions, ISS location, and rocket launches
- **Real-time Responses**: Streaming AI chat with space-themed personality
- **Quick Questions**: Pre-built queries for instant space facts
- **Smart Context**: AI understands space terminology and provides detailed answers

### 🛰️ **Live ISS Tracking**
- **Real-time Position**: Current International Space Station coordinates
- **Auto-refresh**: Updates every 10 seconds automatically
- **Orbital Data**: Altitude, speed, and orbital period information
- **Manual Controls**: Toggle auto-refresh and update on demand

### 🚀 **Space Mission Data**
- **MCP Tools**: Direct access to space APIs through MCP protocol
- **Mission Details**: Information about SpaceX, NASA, and other space missions
- **Launch Schedules**: Upcoming rocket launches with countdown timers
- **Live API Integration**: Real NASA ISS position API

### 🎨 **Space-Themed UI**
- **Dark Theme**: Beautiful space-inspired design with gradients
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Real-time Status**: Live connection indicators and loading states
- **Smooth Animations**: Engaging user interface with space aesthetics

## 🏗️ MCP Architecture

Galactic Grid demonstrates a complete MCP implementation with both server and client components:

```
┌─────────────────────┐    ┌────────────────┐    ┌─────────────────┐
│   React UI          │◄──►│   AI SDK       │◄──►│  Galactic Grid  │
│   - ISS Tracker     │    │   Chat API     │    │   MCP Server    │
│   - Chat Interface  │    │   - GPT-4      │    │   - Tools       │
│   - Space Theme     │    │   - Streaming  │    │   - Resources   │
└─────────────────────┘    └────────────────┘    └─────────────────┘
                                   │                      │
                                   │                      ▼
                                   │               ┌─────────────────┐
                                   │               │  Space APIs     │
                                   │               │  - NASA ISS     │
                                   │               │  - SpaceX       │
                                   │               │  - Launch Lib   │
                                   │               └─────────────────┘
                                   ▼
                          ┌─────────────────┐
                          │    Frontend     │
                          │  Direct Calls   │
                          │  (Fallback)     │
                          └─────────────────┘
```

### **Implementation Details:**

1. **MCP Server (`/api/mcp`)** - Production-ready MCP server with:
   - ✅ **MCP Tools**: `getMissionDetails`, `getISSPosition`, `getUpcomingLaunches`
   - ✅ **MCP Resources**: `space://iss/current`, `space://missions/upcoming`
   - ✅ **Real APIs**: NASA ISS position, SpaceX mission data
   - ✅ **Type Safety**: Zod schemas for all space data

2. **AI Chat (`/api/chat`)** - Vercel AI SDK integration:
   - ✅ **GPT-4 Integration**: Space-themed AI assistant
   - ✅ **Streaming Responses**: Real-time chat experience
   - ✅ **MCP Ready**: Architecture supports MCP tool calling

3. **Frontend Components** - React-based space UI:
   - ✅ **ISS Tracker**: Live position with auto-refresh
   - ✅ **Chat Interface**: AI-powered space conversations
   - ✅ **Responsive Design**: Mobile-friendly space theme

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (Required for Next.js 15)
- **pnpm** (Package manager)
- **OpenAI API Key** (For AI chat functionality)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/samiur-r/galactic-grid.git
cd galactic-grid
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```bash
# Required for AI chat
OPENAI_API_KEY=your_openai_api_key_here

# Optional - for higher rate limits
NASA_API_KEY=your_nasa_api_key_here
```

4. **Start the development server**

```bash
pnpm run dev
```

5. **Open the application**

Visit [http://localhost:3000](http://localhost:3000) and start exploring!

### Test the MCP Server

```bash
# Test MCP tools directly
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'

# Get live ISS position
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "getISSPosition", "arguments": {"include_passes": true}}}'
```

## 🛠️ Technology Stack

### Core Technologies
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vercel AI SDK** - AI chat and streaming
- **Model Context Protocol (MCP)** - AI tool integration

### MCP Implementation
- **mcp-handler** - MCP server framework
- **@modelcontextprotocol/sdk** - Official MCP TypeScript SDK
- **Zod** - Schema validation for space data

### Space APIs
- **NASA Open Data API** - Real ISS position data
- **SpaceX API** - Mission and launch information
- **Launch Library** - Global launch schedules

## 🧪 MCP Tools Available

| Tool | Description | Parameters |
|------|-------------|------------|
| `getMissionDetails` | Get detailed space mission information | `missionId: string` |
| `getISSPosition` | Real-time ISS position and orbital data | `include_passes?: boolean` |
| `getUpcomingLaunches` | Upcoming rocket launches with countdowns | `days?: number` |

## 📊 MCP Resources Available

| Resource URI | Description |
|--------------|-------------|
| `space://iss/current` | Current ISS position and orbital data |
| `space://missions/upcoming` | Database of upcoming space missions |

## 🔧 Configuration

All configuration is handled through environment variables in `.env.local`:

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional - for higher rate limits  
NASA_API_KEY=your_nasa_api_key_here
LAUNCH_LIBRARY_API_KEY=your_launch_library_key_here
```

## 📂 Project Structure

```
galactic-grid/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts          # AI chat endpoint
│   │   │   └── mcp/route.ts           # MCP server endpoint
│   │   ├── layout.tsx                 # App layout
│   │   └── page.tsx                   # Homepage
│   ├── components/space/
│   │   ├── chat-interface.tsx         # AI chat UI
│   │   └── iss-tracker.tsx           # ISS position tracker
│   ├── lib/
│   │   ├── mcp/
│   │   │   ├── client.ts             # MCP client utilities
│   │   │   └── hooks.ts              # React MCP hooks
│   │   └── space-apis/
│   │       └── space-api-service.ts  # Space API integrations
│   └── types/
│       ├── env.ts                    # Environment types
│       └── space.ts                  # Space data schemas
├── scripts/
│   └── test-client.mjs               # MCP testing script
├── .env.example                      # Environment template
└── package.json                      # Dependencies
```

## 🗺️ Current Status

### ✅ **Completed Features**
- **MCP Server**: Production-ready with 3 tools and 2 resources
- **AI Chat**: GPT-4 integration with streaming responses
- **ISS Tracking**: Real-time position with auto-refresh
- **Space UI**: Beautiful responsive design
- **Type Safety**: Full TypeScript with Zod validation

### 🚧 **Next Steps**
- **Enhanced MCP**: Add proper discovery endpoints and CORS
- **Tool Integration**: Connect AI chat directly to MCP tools
- **More APIs**: Expand to include more space agencies
- **Deployment**: Deploy to Vercel for public access

## 📞 Support & Contributing

- **Issues**: [GitHub Issues](https://github.com/samiur-r/galactic-grid/issues)
- **Discussions**: [GitHub Discussions](https://github.com/samiur-r/galactic-grid/discussions)

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- **SpaceX** for providing free API access
- **NASA** for open data initiatives  
- **MCP Community** for protocol development
- **Vercel** for AI SDK and deployment platform
- **OpenAI** for GPT-4 integration

**Built with ❤️ for the space community and MCP developers**

_Galactic Grid - Where MCP meets the cosmos_ 🚀🌌

