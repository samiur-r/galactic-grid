#!/usr/bin/env node

/**
 * Test client for Galactic Grid MCP Server
 * Usage: node scripts/test-client.mjs [server-url]
 * Example: node scripts/test-client.mjs http://localhost:3000
 */

import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'

const SERVER_URL = process.argv[2] || 'http://localhost:3000'

console.log('🚀 Galactic Grid MCP Server Test Client')
console.log(`📡 Connecting to: ${SERVER_URL}/api/mcp/http`)
console.log('')

async function testMcpServer() {
  try {
    // Test 1: Get ISS Position
    console.log('🛰️ Testing ISS Position...')
    const issResponse = await fetch(`${SERVER_URL}/api/mcp/http`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      const issData = await issResponse.json()
      console.log('✅ ISS Position retrieved successfully')
      console.log('   Result:', issData.result?.content?.[0]?.text?.substring(0, 200) + '...')
    } else {
      console.log('❌ ISS Position test failed:', issResponse.status)
    }

    console.log('')

    // Test 2: Search Missions
    console.log('🔍 Testing Mission Search...')
    const searchResponse = await fetch(`${SERVER_URL}/api/mcp/http`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'searchMissions',
          arguments: {
            agency: 'SpaceX',
            limit: 3
          }
        }
      })
    })

    if (searchResponse.ok) {
      const searchData = await searchResponse.json()
      console.log('✅ Mission search completed successfully')
      console.log('   Result:', searchData.result?.content?.[0]?.text?.substring(0, 200) + '...')
    } else {
      console.log('❌ Mission search test failed:', searchResponse.status)
    }

    console.log('')

    // Test 3: Get Upcoming Launches
    console.log('🗓️ Testing Upcoming Launches...')
    const launchesResponse = await fetch(`${SERVER_URL}/api/mcp/http`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'getUpcomingLaunches',
          arguments: {
            days: 7,
            limit: 3
          }
        }
      })
    })

    if (launchesResponse.ok) {
      const launchesData = await launchesResponse.json()
      console.log('✅ Upcoming launches retrieved successfully')
      console.log('   Result:', launchesData.result?.content?.[0]?.text?.substring(0, 200) + '...')
    } else {
      console.log('❌ Upcoming launches test failed:', launchesResponse.status)
    }

    console.log('')

    // Test 4: Test Resources
    console.log('📊 Testing MCP Resources...')
    const resourcesResponse = await fetch(`${SERVER_URL}/api/mcp/http`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 4,
        method: 'resources/list'
      })
    })

    if (resourcesResponse.ok) {
      const resourcesData = await resourcesResponse.json()
      console.log('✅ Resources listed successfully')
      console.log('   Available resources:', resourcesData.result?.resources?.length || 0)
      if (resourcesData.result?.resources) {
        resourcesData.result.resources.forEach(resource => {
          console.log(`   - ${resource.uri}: ${resource.description}`)
        })
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