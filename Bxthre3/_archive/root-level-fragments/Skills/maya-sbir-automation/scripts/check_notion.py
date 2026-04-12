#!/usr/bin/env python3
"""Check Notion connection and guide re-auth if needed."""
import os
import sys

def check_notion():
    # Check if NOTION_TOKEN env var exists
    notion_token = os.environ.get('NOTION_TOKEN') or os.environ.get('NOTION_API_KEY')
    
    if not notion_token:
        print("🔴 NOTION_TOKEN not found in environment")
        print()
        print("To fix:")
        print("1. Go to Settings > Integrations > Notion")
        print("   URL: /?t=settings&s=integrations&d=connections:notion")
        print()
        print("2. Click 'Connect' to authorize Notion")
        print()
        print("3. After connecting, re-run: maya.py --full")
        return False
    else:
        print(f"✅ NOTION_TOKEN found: {notion_token[:8]}...")
        return True

if __name__ == '__main__':
    if not check_notion():
        sys.exit(1)
    print("Notion ready for Maya automation")