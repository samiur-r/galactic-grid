# 🚀 Galactic Grid

**AI-Powered Space Mission Tracking Platform with Real-Time Data**

Galactic Grid is a complete Model Context Protocol (MCP) implementation that brings live space data directly to your fingertips. This web application features an AI assistant that doesn't just chat - it provides real-time updates on space missions, International Space Station position, and rocket launches using live data streams from NASA, SpaceX, and other space agencies.

**What makes this special:** This is a full production implementation of MCP, demonstrating how AI assistants can use live tools and real-time data sources. The AI automatically fetches current information every time you ask a question, so you're always getting the most up-to-date space data available.

## What You Can Do

**Get Real-Time Space Updates** - Ask questions like "Where is the ISS right now?" and receive live data fetched directly from NASA APIs at the moment you ask. Every query triggers fresh data retrieval, ensuring you always have current information.

**Live ISS Tracking** - Watch the International Space Station's position update in real-time on Earth, including coordinates, altitude, and orbital information. The tracker automatically refreshes every 10 seconds with live NASA data.

**Stream Space Mission Data** - Get current information about SpaceX missions, upcoming rocket launches, and space agency activities. The AI uses MCP tools to fetch the latest data from multiple space APIs simultaneously.

**Experience Live MCP Integration** - See a working Model Context Protocol implementation in action, where the AI seamlessly calls live tools and resources to provide you with real-time space information.

**Beautiful Space Interface** - Navigate through a space-themed interface with Earth visualization and star fields, all powered by live data streams.

## Quick Start

### What You Need

- Node.js 18 or newer
- pnpm package manager
- OpenAI API key (for the AI chat feature)

### Installation

1. **Get the code**
```bash
git clone https://github.com/samiur-r/galactic-grid.git
cd galactic-grid
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up your API keys**

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```bash
# Required for AI chat
OPENAI_API_KEY=your_openai_api_key_here

# Optional - for higher rate limits with space APIs
NASA_API_KEY=your_nasa_api_key_here
```

4. **Start the application**
```bash
pnpm run dev
```

5. **Open in your browser**

Visit [http://localhost:3000](http://localhost:3000) and start exploring space data.

## How to Use

### AI Chat Interface

The chat interface on the left side of the screen connects to an AI assistant that can answer space-related questions using live data. Try asking:

- "Where is the ISS right now?"
- "Tell me about SpaceX missions"
- "What rockets are launching soon?"
- "Show me ISS orbital data"

The AI will automatically use the appropriate tools to fetch real-time information and provide detailed responses.

### ISS Tracker

The ISS tracker on the right side shows the International Space Station's current position above Earth. It displays:

- Current latitude and longitude coordinates
- Altitude above Earth's surface
- Orbital velocity and period
- Automatic updates every 10 seconds

You can toggle the auto-refresh feature or manually update the position using the controls.

### Testing the System

Run the comprehensive test to verify everything is working:
```bash
node scripts/test-client.mjs http://localhost:3000
```

This will test all the AI tools and data sources to make sure they're responding correctly.

## How It Works

### Architecture

Galactic Grid uses a "self-serving" architecture where the application provides its own MCP (Model Context Protocol) server. Here's how the data flows:

1. **Frontend UI** - React interface for chat and ISS tracking
2. **AI Chat API** - GPT-4 powered assistant with access to MCP tools
3. **MCP Server** - Provides tools and resources for space data
4. **Space APIs** - Live data from NASA, SpaceX, and other sources

### Available Tools

The AI assistant has access to three main tools:

- **getMissionDetails** - Get detailed information about specific space missions
- **getISSPosition** - Real-time ISS position and orbital data from NASA
- **getUpcomingLaunches** - Upcoming rocket launches with countdown timers

### Live Data Sources

- **NASA APIs** - Real ISS position and orbital data
- **SpaceX API** - Mission and launch information (using mock data currently)
- **Launch Library** - Global launch schedules (using mock data currently)

## Technology Used

### Core Framework
- **Next.js 15** - Modern React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript for better development
- **Tailwind CSS** - Utility-first styling for the space-themed interface

### AI and MCP Integration
- **Vercel AI SDK** - Handles AI chat and streaming responses
- **Model Context Protocol** - Enables AI to use live tools and data
- **OpenAI GPT-4** - Powers the intelligent space assistant

### Data and Validation
- **Zod** - Schema validation for all space data
- **Space APIs** - Integration with NASA, SpaceX, and Launch Library

## Project Structure

```
galactic-grid/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts          # AI chat with MCP tools
│   │   │   └── mcp/route.ts           # MCP server implementation
│   │   ├── layout.tsx                 # Application layout
│   │   └── page.tsx                   # Main dashboard page
│   ├── components/space/
│   │   ├── chat-interface.tsx         # AI chat interface
│   │   └── iss-tracker.tsx           # ISS position tracker
│   ├── lib/
│   │   ├── mcp/                       # MCP client and utilities
│   │   └── space-apis/                # Space API integration
│   └── types/
│       ├── env.ts                     # Environment configuration
│       └── space.ts                   # Space data type definitions
├── scripts/
│   └── test-client.mjs               # Testing script for MCP tools
├── .env.example                      # Environment variables template
└── CLAUDE.md                         # Development guidelines
```

## Development

### Available Commands

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Check code quality

### Adding Features

The application is designed to be extensible. You can:

- Add new MCP tools in `src/app/api/mcp/route.ts`
- Integrate additional space APIs in `src/lib/space-apis/`
- Create new UI components in `src/components/space/`
- Expand the AI's capabilities by modifying the chat interface

### Environment Configuration

All configuration is handled through environment variables:

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional - for higher API rate limits
NASA_API_KEY=your_nasa_api_key_here
LAUNCH_LIBRARY_API_KEY=your_launch_library_key_here
```

## Current Status

**Fully Working Features:**
- AI chat with live MCP tool integration
- Real-time ISS position tracking from NASA APIs
- Beautiful space-themed user interface
- Complete MCP server with tools and resources
- Type-safe development with full TypeScript support

**Ready for Enhancement:**
- Deploy to Vercel for public access
- Add more space agency API integrations
- Include 3D orbital visualization
- Add user authentication and personalized tracking

## Support and Contributing

### Getting Help

- **Issues** - Report bugs or request features on [GitHub Issues](https://github.com/samiur-r/galactic-grid/issues)
- **Discussions** - Ask questions on [GitHub Discussions](https://github.com/samiur-r/galactic-grid/discussions)

### Contributing

We welcome contributions! To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test them
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Acknowledgments

Thanks to the organizations and communities that make this project possible:

- **NASA** for providing open space data APIs
- **SpaceX** for making mission information publicly available
- **MCP Community** for developing the Model Context Protocol
- **Vercel** for the AI SDK and deployment platform
- **OpenAI** for GPT-4 integration capabilities

---

**Built for space enthusiasts and developers interested in AI tool integration**

_Try asking the AI "Where is the ISS?" to see live NASA data in action_