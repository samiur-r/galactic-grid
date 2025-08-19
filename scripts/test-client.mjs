#!/usr/bin/env node

/**
 * Test client for Galactic Grid MCP Server
 * Usage: node scripts/test-client.mjs [server-url]
 * Example: node scripts/test-client.mjs http://localhost:3000
 */

const SERVER_URL = process.argv[2] || 'http://localhost:3000'

console.log('🚀 Galactic Grid MCP Server Test Client')
console.log(`📡 Connecting to: ${SERVER_URL}/api/mcp`)
console.log('')

async function testMcpServer() {
  try {
    // Test 1: Get ISS Position
    console.log('🛰️ Testing ISS Position...')
    const issResponse = await fetch(`${SERVER_URL}/api/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'getISSPosition',
          arguments: {
            include_passes: true
          }
        }
      })
    })

    if (issResponse.ok) {
      const text = await issResponse.text()
      // Parse SSE response
      const lines = text.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6))
          if (data.result?.content?.[0]?.text) {
            console.log('✅ ISS Position retrieved successfully')
            console.log('   Result:', data.result.content[0].text.substring(0, 200) + '...')
            break
          }
        }
      }
    } else {
      console.log('❌ ISS Position test failed:', issResponse.status)
    }

    console.log('')

    // Test 2: Get Mission Details
    console.log('🔍 Testing Mission Details...')
    const missionResponse = await fetch(`${SERVER_URL}/api/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'getMissionDetails',
          arguments: {
            missionId: 'falcon-heavy-demo'
          }
        }
      })
    })

    if (missionResponse.ok) {
      const text = await missionResponse.text()
      // Parse SSE response
      const lines = text.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6))
          if (data.result?.content?.[0]?.text) {
            console.log('✅ Mission details retrieved successfully')
            console.log('   Result:', data.result.content[0].text.substring(0, 200) + '...')
            break
          }
        }
      }
    } else {
      console.log('❌ Mission details test failed:', missionResponse.status)
    }

    console.log('')

    // Test 3: Get Upcoming Launches
    console.log('🗓️ Testing Upcoming Launches...')
    const launchesResponse = await fetch(`${SERVER_URL}/api/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'getUpcomingLaunches',
          arguments: {
            days: 7
          }
        }
      })
    })

    if (launchesResponse.ok) {
      const text = await launchesResponse.text()
      // Parse SSE response
      const lines = text.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6))
          if (data.result?.content?.[0]?.text) {
            console.log('✅ Upcoming launches retrieved successfully')
            console.log('   Result:', data.result.content[0].text.substring(0, 200) + '...')
            break
          }
        }
      }
    } else {
      console.log('❌ Upcoming launches test failed:', launchesResponse.status)
    }

    console.log('')

    // Test 4: Test Resources
    console.log('📊 Testing MCP Resources...')
    const resourcesResponse = await fetch(`${SERVER_URL}/api/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 4,
        method: 'resources/list'
      })
    })

    if (resourcesResponse.ok) {
      const text = await resourcesResponse.text()
      // Parse SSE response
      const lines = text.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6))
          if (data.result?.resources) {
            console.log('✅ Resources listed successfully')
            console.log('   Available resources:', data.result.resources.length || 0)
            data.result.resources.forEach(resource => {
              console.log(`   - ${resource.uri}: ${resource.description}`)
            })
            break
          }
        }
      }
    } else {
      console.log('❌ Resources test failed:', resourcesResponse.status)
    }

    console.log('')
    console.log('🎉 MCP Server testing completed!')

  } catch (error) {
    console.error('❌ Test client error:', error.message)
    process.exit(1)
  }
}

// Run tests
testMcpServer().catch(console.error)