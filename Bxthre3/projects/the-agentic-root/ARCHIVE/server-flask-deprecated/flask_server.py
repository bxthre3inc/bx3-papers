#!/usr/bin/env python3
"""
AMP Mesh Server - Simple Flask API
Compatible with register_user_service
"""
import json
import os
import uuid
from datetime import datetime
from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory state (resets on restart)
PEERS = {}
HEALTH = {}
TASKS = {}  # task_id -> task dict
SERVER_START = datetime.utcnow()

NODE_NAMES = {1: "FOXXD", 2: "Chromebook", 3: "Server"}

def get_node_name(node_id):
    return NODE_NAMES.get(node_id, f"Node-{node_id}")

@app.route('/health')
def health():
    """Server health and peer status"""
    return jsonify({
        'status': 'operational',
        'node_id': 3,
        'name': 'zo-server',
        'role': 'TERTIARY',
        'peers': len(PEERS),
        'peers_detail': list(PEERS.values()),
        'uptime_seconds': (datetime.utcnow() - SERVER_START).total_seconds(),
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/status')
def status():
    """Full mesh status"""
    peer_list = []
    for pid, peer in PEERS.items():
        health_data = HEALTH.get(pid, {})
        peer_list.append({
            **peer,
            'health': health_data
        })
    
    return jsonify({
        'server': {
            'id': 3,
            'name': 'zo-server',
            'role': 'TERTIARY',
            'capabilities': ['COMPUTE_HEAVY', 'STORAGE_PERSISTENT', 'EMAIL_GATEWAY', 'SMS_GATEWAY'],
            'started': SERVER_START.isoformat()
        },
        'peers': peer_list,
        'peer_count': len(peer_list),
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/register', methods=['POST'])
def register():
    """Register a peer node"""
    data = request.get_json() or {}
    node_id = data.get('node_id')
    
    if not node_id:
        return jsonify({'error': 'node_id required'}), 400
    
    PEERS[node_id] = {
        'id': node_id,
        'name': data.get('name', f'node-{node_id}'),
        'role': data.get('role', 'PRIMARY'),
        'address': data.get('address') or request.remote_addr,
        'capabilities': data.get('capabilities', []),
        'registered_at': datetime.utcnow().isoformat()
    }
    
    HEALTH[node_id] = {
        'last_seen': datetime.utcnow().isoformat(),
        'battery': data.get('battery', 100),
        'load': data.get('load', 0)
    }
    
    print(f"[AMP] Registered: {get_node_name(node_id)} (ID: {node_id})")
    
    return jsonify({
        'registered': True,
        'node_id': node_id,
        'server_capabilities': ['COMPUTE_HEAVY', 'STORAGE_PERSISTENT', 'EMAIL_GATEWAY', 'SMS_GATEWAY']
    })

@app.route('/heartbeat', methods=['POST'])
def heartbeat():
    """Receive heartbeat from peer"""
    data = request.get_json() or {}
    sender_id = data.get('sender_id')
    
    if not sender_id:
        return jsonify({'error': 'sender_id required'}), 400
    
    # Update health
    HEALTH[sender_id] = {
        'last_seen': datetime.utcnow().isoformat(),
        'battery': data.get('battery', 100),
        'load': data.get('load', 0),
        'active_tasks': data.get('active_tasks', 0)
    }
    
    # Create peer entry if new
    if sender_id not in PEERS:
        PEERS[sender_id] = {
            'id': sender_id,
            'name': data.get('name', f'node-{sender_id}'),
            'role': data.get('role', 'PRIMARY'),
            'capabilities': data.get('caps', []),
            'first_seen': datetime.utcnow().isoformat()
        }
        print(f"[AMP] New peer: {get_node_name(sender_id)} (ID: {sender_id})")
    
    PEERS[sender_id]['last_heartbeat'] = datetime.utcnow().isoformat()
    
    print(f"[AMP] Heartbeat from {get_node_name(sender_id)}: {data.get('battery', 100)}% battery, {data.get('load', 0)}% load")
    
    return jsonify({
        'received': True,
        'server_time': datetime.utcnow().isoformat(),
        'peers_known': len(PEERS),
        'uptime_seconds': int((datetime.utcnow() - SERVER_START).total_seconds())
    })

@app.route('/command', methods=['POST'])
def command():
    """Simple command interface"""
    data = request.get_json() or {}
    text = data.get('text', '').lower().strip()
    
    if 'status' in text or 'peers' in text:
        return jsonify({
            'peers': list(PEERS.keys()),
            'health': HEALTH
        })
    
    return jsonify({'received': text})

@app.route('/tasks/assign', methods=['POST'])
def assign_task():
    """Assign task to best available node"""
    data = request.get_json() or {}
    required_caps = set(data.get('required_caps', []))
    
    # Find best node with required capabilities
    best_node = None
    best_score = -1
    
    for node_id, peer in PEERS.items():
        peer_caps = set(peer.get('capabilities', []))
        if required_caps.issubset(peer_caps):
            health = HEALTH.get(node_id, {})
            score = (100 - health.get('load', 50)) + (health.get('battery', 50) / 2)
            if score > best_score:
                best_score = score
                best_node = peer
    
    if best_node:
        return jsonify({
            'assigned': True,
            'node_id': best_node['id'],
            'node_name': best_node['name']
        })
    else:
        return jsonify({
            'assigned': False,
            'queued': True,
            'reason': 'no_capable_nodes'
        })

@app.route('/tasks/result', methods=['POST'])
def task_result():
    """Receive task execution result"""
    data = request.get_json() or {}
    task_id = data.get('task_id')
    success = data.get('success', False)
    
    print(f"[AMP] Task {task_id} completed: {success}")
    
    return jsonify({'received': True})

@app.route('/task/offer', methods=['POST'])
def task_offer():
    """Server offers task to node"""
    data = request.get_json() or {}
    task_id = str(uuid.uuid4())
    task = {
        'id': task_id,
        'type': data.get('type', 'unknown'),
        'payload': data.get('payload', {}),
        'priority': data.get('priority', 1),
        'target_node': data.get('target_node'),
        'status': 'OFFERED',
        'created_at': datetime.utcnow().isoformat()
    }
    TASKS[task_id] = task
    return jsonify({
        'task_id': task_id,
        'status': 'OFFERED',
        'created_at': task['created_at']
    })

@app.route('/task/accept', methods=['POST'])
def task_accept():
    """Node accepts task"""
    data = request.get_json() or {}
    task_id = data.get('task_id')
    if task_id in TASKS:
        task = TASKS[task_id]
        if task['status'] == 'OFFERED':
            task['status'] = 'ACCEPTED'
            task['accepted_at'] = datetime.utcnow().isoformat()
            return jsonify({
                'task_id': task_id,
                'status': 'ACCEPTED',
                'accepted_at': task['accepted_at']
            })
        else:
            return jsonify({'error': 'task not offered'}), 400
    else:
        return jsonify({'error': 'task not found'}), 404

@app.route('/task/reject', methods=['POST'])
def task_reject():
    """Node rejects task"""
    data = request.get_json() or {}
    task_id = data.get('task_id')
    if task_id in TASKS:
        task = TASKS[task_id]
        if task['status'] == 'OFFERED':
            task['status'] = 'REJECTED'
            task['rejected_at'] = datetime.utcnow().isoformat()
            return jsonify({
                'task_id': task_id,
                'status': 'REJECTED',
                'rejected_at': task['rejected_at']
            })
        else:
            return jsonify({'error': 'task not offered'}), 400
    else:
        return jsonify({'error': 'task not found'}), 404

@app.route('/task/complete', methods=['POST'])
def task_complete():
    """Node reports completion"""
    data = request.get_json() or {}
    task_id = data.get('task_id')
    if task_id in TASKS:
        task = TASKS[task_id]
        if task['status'] == 'ACCEPTED':
            task['status'] = 'COMPLETED'
            task['completed_at'] = datetime.utcnow().isoformat()
            return jsonify({
                'task_id': task_id,
                'status': 'COMPLETED',
                'completed_at': task['completed_at']
            })
        else:
            return jsonify({'error': 'task not accepted'}), 400
    else:
        return jsonify({'error': 'task not found'}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 7778))
    app.run(host='0.0.0.0', port=port, debug=False)
