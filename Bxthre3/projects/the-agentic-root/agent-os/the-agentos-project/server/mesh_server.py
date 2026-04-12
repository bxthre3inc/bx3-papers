"""
AMP Mesh Server - Zo.host compatible
UDP discovery + HTTP API
"""
import asyncio
import json
from datetime import datetime
from typing import Dict, Callable, Any
from aiohttp import web

from amp_types import AMPNode, NodeRole, NodeCapability, NodeHealth, TaskPriority

# Task storage
TASKS: Dict[str, dict] = {}

class AMPMeshServer:
    """
    Server node in Agentic federated mesh.
    Always-online tertiary node with persistent storage.
    """
    
    def __init__(self, node_id: int = 0, name: str = "zo-server"):
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
        self.peers: Dict[int, AMPNode] = {}
        self.handlers: Dict[str, Callable] = {}
        
    def register_handler(self, task_type: str, handler: Callable):
        self.handlers[task_type] = handler
        
    async def start(self, udp_port: int = 7777, http_port: int = 8080):
        """Start UDP mesh + HTTP API"""
        # HTTP server first
        await self._http_server(http_port)
        
    async def _http_server(self, port: int):
        routes = web.RouteTableDef()
        
        @routes.get('/health')
        async def health(req):
            return web.json_response({
                'node': self.node.to_dict(),
                'peers': len(self.peers),
                'timestamp': datetime.utcnow().isoformat()
            })
            
        @routes.post('/command')
        async def command(req):
            data = await req.json()
            text = data.get('text', '').lower().strip()
            if 'status' in text:
                return web.json_response({
                    'peers': [p.to_dict() for p in self.peers.values()]
                })
            return web.json_response({'received': text})
        
        @routes.post('/task/offer')
        async def task_offer(req):
            data = await req.json()
            import uuid
            task_id = str(uuid.uuid4())
            task = {
                'id': task_id,
                'type': data.get('type', 'unknown'),
                'payload': data.get('payload', {}),
                'priority': data.get('priority', 1),
                'target_node': data.get('target_node'),
                'source_node': 'Server',
                'status': 'OFFERED',
                'created_at': datetime.utcnow().isoformat()
            }
            TASKS[task_id] = task
            print(f"[AMP] Task {task_id} offered to node {data.get('target_node')}")
            return web.json_response({
                'task_id': task_id,
                'status': 'OFFERED',
                'created_at': task['created_at']
            })
        
        @routes.post('/task/accept')
        async def task_accept(req):
            data = await req.json()
            task_id = data.get('task_id')
            
            if task_id not in TASKS:
                return web.json_response({'error': 'task not found'}, status=404)
            
            task = TASKS[task_id]
            if task['status'] != 'OFFERED':
                return web.json_response({'error': 'task not offered'}, status=400)
            
            task['status'] = 'ACCEPTED'
            task['accepted_at'] = datetime.utcnow().isoformat()
            task['accepted_by'] = data.get('node_id')
            
            print(f"[AMP] Task {task_id} ACCEPTED by node {data.get('node_id')}")
            
            return web.json_response({
                'task_id': task_id,
                'status': 'ACCEPTED',
                'accepted_at': task['accepted_at'],
                'next_step': 'execute_and_complete'
            })
        
        @routes.post('/task/reject')
        async def task_reject(req):
            data = await req.json()
            task_id = data.get('task_id')
            
            if task_id not in TASKS:
                return web.json_response({'error': 'task not found'}, status=404)
            
            task = TASKS[task_id]
            if task['status'] != 'OFFERED':
                return web.json_response({'error': 'task not offered'}, status=400)
            
            task['status'] = 'REJECTED'
            task['rejected_at'] = datetime.utcnow().isoformat()
            
            print(f"[AMP] Task {task_id} REJECTED")
            
            return web.json_response({
                'task_id': task_id,
                'status': 'REJECTED',
                'rejected_at': task['rejected_at']
            })
        
        @routes.post('/task/complete')
        async def task_complete(req):
            data = await req.json()
            task_id = data.get('task_id')
            
            if task_id not in TASKS:
                return web.json_response({'error': 'task not found'}, status=404)
            
            task = TASKS[task_id]
            if task['status'] != 'ACCEPTED':
                return web.json_response({'error': 'task not accepted'}, status=400)
            
            task['status'] = 'COMPLETED'
            task['completed_at'] = datetime.utcnow().isoformat()
            task['result'] = data.get('result', {})
            
            print(f"[AMP] Task {task_id} COMPLETED")
            
            return web.json_response({
                'task_id': task_id,
                'status': 'COMPLETED',
                'completed_at': task['completed_at']
            })
        
        @routes.get('/tasks')
        async def list_tasks(req):
            node_id = req.query.get('node_id')
            tasks = []
            for task_id, task in TASKS.items():
                if not node_id or task.get('target_node') == node_id or task.get('accepted_by') == node_id:
                    tasks.append(task)
            return web.json_response({'tasks': tasks})
        
        @routes.get('/tasks/pending')
        async def pending_tasks(req):
            node_id = req.query.get('node_id')
            if node_id:
                # Handle both string and int comparisons
                try:
                    node_id_int = int(node_id)
                except (ValueError, TypeError):
                    node_id_int = None
            else:
                node_id_int = None
                
            pending = [
                task for task in TASKS.values()
                if task['status'] == 'OFFERED'
                and (not node_id or task.get('target_node') == node_id_int or str(task.get('target_node')) == node_id)
            ]
            return web.json_response({
                'pending': pending,
                'count': len(pending)
            })
        
        app = web.Application()
        app.add_routes(routes)
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, '0.0.0.0', port)
        print(f"HTTP API on port {port}")
        await site.start()
        
        # Keep running
        while True:
            await asyncio.sleep(3600)

if __name__ == '__main__':
    server = AMPMeshServer()
    asyncio.run(server.start())
