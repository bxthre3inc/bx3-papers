"""
AMP Mesh Server - WSGI Entry Point for Zo Space
"""
import asyncio
import json
import os
from datetime import datetime
from typing import Dict, Callable, Any
from aiohttp import web

from amp_types import AMPNode, NodeRole, NodeCapability, NodeHealth, TaskPriority

# Track mesh peers and their health
MESH_PEERS: Dict[int, AMPNode] = {}
MESH_HEALTH: Dict[int, dict] = {}
SERVER_START_TIME = datetime.utcnow()

class AMPMeshServer:
    """
    Server node in Agentic federated mesh.
    Always-online tertiary node with persistent storage.
    """
    
    def __init__(self, node_id: int = 3, name: str = "zo-server"):
        self.node = AMPNode(
            node_id=node_id,
            name=name,
            role=NodeRole.TERTIARY,
            capabilities={
                NodeCapability.COMPUTE_HEAVY.value,
                NodeCapability.STORAGE_PERSISTENT.value,
                NodeCapability.EMAIL_GATEWAY.value,
                NodeCapability.SMS_GATEWAY.value,
            }
        )
        self.handlers: Dict[str, Callable] = {}
        
    def register_handler(self, task_type: str, handler: Callable):
        self.handlers[task_type] = handler
        
    async def start_http(self, port: int = 8080):
        """Start HTTP API only (UDP handled separately if needed)"""
        await self._http_server(port)
        
    async def _http_server(self, port: int):
        routes = web.RouteTableDef()
        
        @routes.get('/health')
        async def health(req):
            return web.json_response({
                'node': self.node.to_dict(),
                'peers': len(MESH_PEERS),
                'peers_detail': [p.to_dict() for p in MESH_PEERS.values()],
                'uptime_seconds': (datetime.utcnow() - SERVER_START_TIME).total_seconds(),
                'status': 'operational'
            })
            
        @routes.get('/status')
        async def status(req):
            """Get mesh status for all nodes"""
            return web.json_response({
                'server': self.node.to_dict(),
                'peers': [p.to_dict() for p in MESH_PEERS.values()],
                'timestamp': datetime.utcnow().isoformat()
            })
        
        @routes.post('/register')
        async def register(req):
            """Register a peer node"""
            data = await req.json()
            node_id = data.get('node_id')
            
            if node_id:
                MESH_PEERS[node_id] = AMPNode(
                    node_id=node_id,
                    name=data.get('name', f'node-{node_id}'),
                    role=NodeRole(data.get('role', 'PRIMARY')),
                    address=data.get('address'),
                    capabilities=set(data.get('capabilities', []))
                )
                MESH_HEALTH[node_id] = {
                    'last_seen': datetime.utcnow().isoformat(),
                    'battery': data.get('battery', 100),
                    'load': data.get('load', 0)
                }
                print(f"Registered peer: {node_id}")
            
            return web.json_response({'registered': True, 'node_id': node_id})
        
        @routes.post('/heartbeat')
        async def heartbeat(req):
            """Receive heartbeat from peer"""
            data = await req.json()
            sender_id = data.get('sender_id')
            
            if sender_id:
                MESH_HEALTH[sender_id] = {
                    'last_seen': datetime.utcnow().isoformat(),
                    'battery': data.get('battery', 100),
                    'load': data.get('load', 0),
                    'active_tasks': data.get('active_tasks', 0)
                }
                
                # Update peer if exists, or create stub
                if sender_id not in MESH_PEERS:
                    MESH_PEERS[sender_id] = AMPNode(
                        node_id=sender_id,
                        name=data.get('name', f'node-{sender_id}'),
                        role=NodeRole(data.get('role', 'PRIMARY')),
                        address=req.remote,
                        capabilities=set(data.get('caps', []))
                    )
            
            return web.json_response({
                'received': True,
                'server_time': datetime.utcnow().isoformat(),
                'peers_known': len(MESH_PEERS)
            })
            
        @routes.post('/command')
        async def command(req):
            data = await req.json()
            text = data.get('text', '').lower().strip()
            if 'status' in text:
                return web.json_response({
                    'peers': [p.to_dict() for p in MESH_PEERS.values()]
                })
            if 'peers' in text:
                return web.json_response({
                    'peers': list(MESH_PEERS.keys()),
                    'health': MESH_HEALTH
                })
            return web.json_response({'received': text})
        
        @routes.post('/tasks/assign')
        async def assign_task(req):
            """Assign task to best available node"""
            data = await req.json()
            required_caps = set(data.get('required_caps', []))
            
            # Find best node with required capabilities
            best_node = None
            best_score = -1
            
            for node_id, node in MESH_PEERS.items():
                if required_caps.issubset(node.capabilities):
                    health = MESH_HEALTH.get(node_id, {})
                    # Score: lower load + higher battery = better
                    score = (100 - health.get('load', 50)) + (health.get('battery', 50) / 2)
                    if score > best_score:
                        best_score = score
                        best_node = node
            
            if best_node:
                return web.json_response({
                    'assigned': True,
                    'node_id': best_node.node_id,
                    'node_name': best_node.name
                })
            else:
                # Queue for later
                return web.json_response({
                    'assigned': False,
                    'queued': True,
                    'reason': 'no_capable_nodes'
                })
        
        @routes.post('/tasks/result')
        async def task_result(req):
            """Receive task execution result"""
            data = await req.json()
            task_id = data.get('task_id')
            success = data.get('success', False)
            result = data.get('result')
            
            print(f"Task {task_id} completed: {success}")
            
            return web.json_response({'received': True})
        
        app = web.Application()
        app.add_routes(routes)
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, '0.0.0.0', port)
        print(f"AMP Mesh HTTP API on port {port}")
        await site.start()
        
        # Keep alive
        while True:
            await asyncio.sleep(3600)

# Create server instance
server = AMPMeshServer()

async def main():
    await server.start_http(port=int(os.environ.get('PORT', 8080)))

if __name__ == '__main__':
    asyncio.run(main())
