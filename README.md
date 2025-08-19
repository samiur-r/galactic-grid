# 🚀 Galactic Grid

**AI-Powered Space Mission Tracking Platform with Model Context Protocol**

Galactic Grid is a **fully functional MCP-powered space application** where you can chat with an AI assistant that has access to real-time space data. Ask about the International Space Station, space missions, and rocket launches - the AI uses live MCP tools to provide accurate, up-to-date information from NASA, SpaceX, and other space agencies.

🌟 **Complete MCP Implementation** - Demonstrates production-ready MCP server and client integration with the Vercel AI SDK.

✨ **Chat with Live Space Data** - Ask "Where is the ISS?" and get real-time NASA tracking data through MCP tools!

## ✨ Current Features

### 🤖 **AI-Powered Space Chat with Live MCP Data**
- **GPT-4 + MCP Integration**: Ask questions and get real-time space data through MCP tools
- **Live Space Information**: AI accesses live ISS position, mission details, and launch schedules
- **Streaming Responses**: Real-time chat with space-themed AI assistant
- **Smart Tool Usage**: AI automatically chooses the right MCP tools for your questions
- **Example Queries**: "Where is the ISS?", "Tell me about SpaceX missions", "What launches are coming up?"

### 🛰️ **Live ISS Tracking**
- **Real-time Position**: Current International Space Station coordinates
- **Auto-refresh**: Updates every 10 seconds automatically
- **Orbital Data**: Altitude, speed, and orbital period information
- **Manual Controls**: Toggle auto-refresh and update on demand

### 🚀 **Live Space Mission Data via MCP**
- **Active MCP Tools**: 3 working tools integrated with AI chat
- **Real NASA Data**: Live ISS position from NASA APIs
- **Mission Intelligence**: SpaceX and NASA mission information through MCP
- **Launch Tracking**: Upcoming rocket launches with countdown timers
- **Tool Integration**: AI automatically calls appropriate MCP tools based on your questions

### 🎨 **Space-Themed UI**
- **Dark Theme**: Beautiful space-inspired design with gradients
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Real-time Status**: Live connection indicators and loading states
- **Smooth Animations**: Engaging user interface with space aesthetics

## 🏗️ MCP Architecture - Live Implementation

Galactic Grid features a **fully working MCP implementation** with real-time data flow:

```
┌─────────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React UI          │◄──►│   AI SDK Chat    │◄──►│  Galactic Grid  │
│   - ISS Tracker     │    │   - GPT-4        │ ✅ │   MCP Server    │
│   - Chat Interface  │    │   - MCP Client   │    │   - 3 Tools     │
│   - Space Theme     │    │   - Streaming    │    │   - 1 Resource  │
└─────────────────────┘    └──────────────────┘    └─────────────────┘
                                   ▲                      │
                                   │ experimental_        ▼
                                   │ createMCPClient   ┌─────────────────┐
                                   │                   │  Live Space APIs│
                                   │                   │  - NASA ISS ✅  │
                                   └───────────────────│  - SpaceX       │
                                     StreamableHTTP    │  - Launch Lib   │
                                     Transport         └─────────────────┘
```

### **🎯 Active MCP Components:**
- ✅ **MCP Server**: Production `/api/mcp` endpoint with tools and resources
- ✅ **MCP Client**: Vercel AI SDK `experimental_createMCPClient` integration
- ✅ **AI Integration**: GPT-4 chat automatically calls MCP tools
- ✅ **Live Data**: Real NASA ISS position data flowing through MCP

### **🔧 Implementation Details:**

1. **MCP Server (`/api/mcp`)** - Production-ready server:
   - ✅ **3 Active Tools**: `getMissionDetails`, `getISSPosition`, `getUpcomingLaunches`
   - ✅ **1 Live Resource**: `space://iss/current` with real NASA data
   - ✅ **SSE Transport**: Event-stream responses for MCP protocol
   - ✅ **Type Safety**: Zod schemas for all space data validation

2. **MCP Client Integration** - Vercel AI SDK connection:
   - ✅ **StreamableHTTPClientTransport**: Official MCP SDK transport
   - ✅ **Tool Discovery**: Dynamic tool loading from MCP server  
   - ✅ **AI SDK Integration**: `experimental_createMCPClient` in chat API
   - ✅ **Error Handling**: Proper connection management and cleanup

3. **AI Chat (`/api/chat`)** - GPT-4 with live MCP tools:
   - ✅ **Tool Calling**: AI automatically invokes MCP tools
   - ✅ **Streaming Responses**: Real-time chat with live space data
   - ✅ **Context Awareness**: AI knows when to use which space tool
   - ✅ **Live Data**: Real NASA ISS position in chat responses

4. **Frontend Components** - React space UI:
   - ✅ **Chat Interface**: MCP-powered AI conversations
   - ✅ **ISS Tracker**: Independent real-time position tracking
   - ✅ **Loading States**: MCP-specific status indicators

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

### 🧪 Test the MCP Integration

**Run the comprehensive test script:**
```bash
# Test all MCP tools and resources
node scripts/test-client.mjs http://localhost:3000
```

**Test individual MCP endpoints:**
```bash
# Get MCP server capabilities
curl http://localhost:3000/api/mcp

# Test live ISS position tool
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "getISSPosition", "arguments": {"include_passes": true}}}'
```

**Test AI Chat with MCP Tools:**
```bash
# Ask the AI about ISS location (will use MCP tools)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Where is the ISS right now?"}]}'
```

### 🎯 Example Chat Queries

Try these questions in the chat interface to see MCP tools in action:

- **"Where is the ISS right now?"** → Triggers `getISSPosition` tool
- **"Tell me about SpaceX missions"** → Triggers `getMissionDetails` tool  
- **"What rockets are launching soon?"** → Triggers `getUpcomingLaunches` tool
- **"Show me ISS orbital data"** → Uses MCP resource `space://iss/current`

## 🛠️ Technology Stack

### Core Technologies
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vercel AI SDK** - AI chat and streaming
- **Model Context Protocol (MCP)** - AI tool integration

### MCP Implementation (Active)
- **mcp-handler** - MCP server framework powering `/api/mcp`
- **@modelcontextprotocol/sdk** - Official MCP TypeScript SDK with StreamableHTTPClientTransport
- **experimental_createMCPClient** - Vercel AI SDK MCP client integration
- **Zod** - Schema validation for all space data types

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

| Resource URI | Description | Status |
|--------------|-------------|---------|
| `space://iss/current` | Live ISS position and orbital data from NASA | ✅ Active |

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
│   │   │   ├── chat/route.ts          # AI chat with MCP tools ✅
│   │   │   └── mcp/route.ts           # Production MCP server ✅
│   │   ├── layout.tsx                 # App layout
│   │   └── page.tsx                   # Homepage with chat & ISS tracker
│   ├── components/space/
│   │   ├── chat-interface.tsx         # MCP-powered AI chat UI ✅
│   │   └── iss-tracker.tsx           # Real-time ISS position
│   ├── lib/
│   │   ├── mcp/
│   │   │   ├── client.ts             # MCP client with AI SDK ✅
│   │   │   └── hooks.ts              # React MCP hooks
│   │   └── space-apis/
│   │       └── space-api-service.ts  # Live NASA API integration ✅
│   └── types/
│       ├── env.ts                    # Environment configuration
│       └── space.ts                  # Space data Zod schemas
├── scripts/
│   └── test-client.mjs               # MCP testing script ✅
├── .env.example                      # Environment template
├── CLAUDE.md                         # Development guidelines
└── package.json                      # Dependencies with MCP SDK
```

## 🗺️ Implementation Status

### ✅ **Fully Implemented**
- **🤖 MCP-Powered AI Chat**: GPT-4 chat with live MCP tool integration
- **🛰️ MCP Server**: Production-ready with 3 tools and 1 resource  
- **📡 Live Space Data**: Real NASA ISS position through MCP tools
- **🔄 Tool Automation**: AI automatically chooses appropriate MCP tools
- **⚡ Streaming**: Real-time responses with MCP data integration
- **🎨 Space UI**: Beautiful responsive design with MCP status indicators
- **🧪 Testing**: Complete MCP validation with working test script
- **🔒 Type Safety**: Full TypeScript with Zod schemas

### 🚀 **Ready for Enhancement**
- **🌍 Deployment**: Deploy to Vercel for public MCP demo
- **📈 More APIs**: Expand to include more space agencies
- **🗺️ Visualization**: Add 3D ISS orbit visualization  
- **👥 Multi-user**: Add authentication and personalized space tracking

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

_Galactic Grid - Where MCP brings the cosmos to AI_ 🚀🌌

> **Try it now**: Ask the AI "Where is the ISS?" and watch MCP tools provide live NASA data! 🛰️✨

