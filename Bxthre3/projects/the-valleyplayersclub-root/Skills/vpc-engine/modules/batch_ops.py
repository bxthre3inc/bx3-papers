#!/usr/bin/env python3
"""Batch Operations - Multi-pack generation and validation"""
import json
from pathlib import Path
from typing import List, Dict
from datetime import datetime

class BatchOps:
    """Batch operations for multiple game packs"""
    
    def __init__(self, root_dir: str):
        self.root = Path(root_dir)
        self.spec_dir = self.root / "Assets" / ".specs"
        self.packages_dir = self.root / "Skills" / "vpc-engine" / "packages"
        
    def batch_create(self, packs: List[Dict]) -> Dict:
        """Create multiple game packs at once"""
        results = {"created": [], "failed": []}
        
        for pack in packs:
            try:
                pack_id = f"{pack['name'].lower().replace(' ', '-')}-{pack['theme']}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
                
                spec = {
                    "pack_id": pack_id,
                    "name": pack['name'],
                    "game_type": pack['type'],
                    "theme": pack['theme'],
                    "status": "pending",
                    "created": datetime.now().isoformat(),
                    "params": pack.get('params', {}),
                    "assets_2d": {},
                    "assets_3d": {},
                    "audio": {},
                    "batch_id": f"batch-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
                }
                
                spec_path = self.spec_dir / f"{pack_id}.json"
                spec_path.write_text(json.dumps(spec, indent=2))
                results["created"].append({"id": pack_id, "name": pack['name']})
                
            except Exception as e:
                results["failed"].append({"name": pack.get('name'), "error": str(e)})
                
        return results
    
    def batch_approve(self, pack_ids: List[str]) -> Dict:
        """Approve multiple packs"""
        results = {"approved": [], "failed": []}
        
        for pid in pack_ids:
            spec_path = self.spec_dir / f"{pid}.json"
            if not spec_path.exists():
                results["failed"].append({"id": pid, "error": "spec not found"})
                continue
                
            try:
                spec = json.loads(spec_path.read_text())
                spec["status"] = "approved"
                spec["approved_at"] = datetime.now().isoformat()
                spec_path.write_text(json.dumps(spec, indent=2))
                results["approved"].append(pid)
            except Exception as e:
                results["failed"].append({"id": pid, "error": str(e)})
                
        return results
    
    def batch_package(self, pack_ids: List[str]) -> Dict:
        """Package multiple approved packs into ZIPs"""
        import zipfile
        
        results = {"packaged": [], "failed": []}
        
        for pid in pack_ids:
            pack_dir = self.root / "unity-vpc" / "Assets" / "GamePacks" / pid
            if not pack_dir.exists():
                results["failed"].append({"id": pid, "error": "pack not built"})
                continue
                
            try:
                zip_path = self.packages_dir / f"{pid}.zip"
                with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
                    for file in pack_dir.rglob("*"):
                        if file.is_file():
                            arcname = str(file.relative_to(pack_dir))
                            zf.write(file, arcname)
                
                results["packaged"].append({
                    "id": pid,
                    "zip": str(zip_path),
                    "size_kb": zip_path.stat().st_size / 1024
                })
            except Exception as e:
                results["failed"].append({"id": pid, "error": str(e)})
                
        return results
    
    def generate_batch_report(self) -> Dict:
        """Generate report of all packs"""
        specs = []
        for spec_file in self.spec_dir.glob("*.json"):
            try:
                spec = json.loads(spec_file.read_text())
                specs.append({
                    "id": spec.get("pack_id"),
                    "name": spec.get("name"),
                    "type": spec.get("game_type"),
                    "theme": spec.get("theme"),
                    "status": spec.get("status"),
                    "created": spec.get("created")
                })
            except:
                pass
                
        by_status = {}
        for s in specs:
            status = s.get("status", "unknown")
            by_status[status] = by_status.get(status, 0) + 1
            
        return {
            "total_packs": len(specs),
            "by_status": by_status,
            "by_type": self._group_by(specs, "type"),
            "by_theme": self._group_by(specs, "theme"),
            "packs": specs
        }
    
    def _group_by(self, items: List[Dict], key: str) -> Dict:
        result = {}
        for item in items:
            val = item.get(key, "unknown")
            result[val] = result.get(val, 0) + 1
        return result
    
    def compare_packs(self, pack_id_1: str, pack_id_2: str) -> Dict:
        """Compare two packs for consistency"""
        
        spec1 = json.loads((self.spec_dir / f"{pack_id_1}.json").read_text())
        spec2 = json.loads((self.spec_dir / f"{pack_id_2}.json").read_text())
        
        return {
            "same_theme": spec1.get("theme") == spec2.get("theme"),
            "same_type": spec1.get("game_type") == spec2.get("game_type"),
            "asset_count_1": spec1.get("asset_counts", {}).get("total", 0),
            "asset_count_2": spec2.get("asset_counts", {}).get("total", 0),
            "can_bundle": spec1.get("theme") == spec2.get("theme")
        }

if __name__ == "__main__":
    batch = BatchOps("/home/workspace/Bxthre3/projects/the-valleyplayersclub-project")
    print(json.dumps(batch.generate_batch_report(), indent=2))
