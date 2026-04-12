#!/usr/bin/env python3
"""
GitHub Metrics Collector for Investor Protector
Tracks commit velocity, contributor activity, repository health
"""

import os
import json
import requests
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
ORG_NAME = "bxthre3inc"  # Your GitHub org

if not GITHUB_TOKEN:
    raise RuntimeError("GITHUB_TOKEN not found. Set in Settings > Advanced > Secrets")

HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
}

def test_authentication():
    """Verify token is valid and get authenticated user info"""
    try:
        response = requests.get('https://api.github.com/user', headers=HEADERS)
        if response.status_code == 200:
            user_data = response.json()
            print(f"✓ Authenticated as: {user_data.get('login')}")
            print(f"  User type: {user_data.get('type')}")
            return user_data.get('login')
        elif response.status_code == 401:
            print("✗ Token invalid or expired")
            return None
        else:
            print(f"✗ Auth error: {response.status_code}")
            return None
    except Exception as e:
        print(f"✗ Auth test failed: {e}")
        return None

def get_user_repos(username):
    """Get repos for a specific user"""
    repos = []
    page = 1
    while True:
        url = f'https://api.github.com/users/{username}/repos?per_page=100&page={page}'
        try:
            response = requests.get(url, headers=HEADERS)
            if response.status_code == 404:
                print(f"✗ User/org '{username}' not found (404)")
                return None
            response.raise_for_status()
            page_repos = response.json()
            if not page_repos:
                break
            repos.extend(page_repos)
            page += 1
        except requests.exceptions.RequestException as e:
            print(f"✗ API error: {e}")
            return None
    return repos

def get_org_repos(org_name):
    """Get repos for an organization"""
    repos = []
    page = 1
    while True:
        url = f'https://api.github.com/orgs/{org_name}/repos?per_page=100&page={page}'
        try:
            response = requests.get(url, headers=HEADERS)
            if response.status_code == 404:
                return None  # Org not found or no access
            response.raise_for_status()
            page_repos = response.json()
            if not page_repos:
                break
            repos.extend(page_repos)
            page += 1
        except requests.exceptions.RequestException:
            return None
    return repos

def get_repo_commits(repo_full_name, since_date):
    """Get commits for a specific repo"""
    url = f'https://api.github.com/repos/{repo_full_name}/commits?since={since_date}&per_page=100'
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 409:
            return 0  # Empty repo
        response.raise_for_status()
        commits = response.json()
        return len(commits) if isinstance(commits, list) else 0
    except requests.exceptions.RequestException:
        return 0

def collect_github_metrics():
    """Main metrics collection with smart fallback"""
    metrics = {
        'collected_at': datetime.now(timezone.utc).isoformat(),
        'authenticated_user': None,
        'total_repos': 0,
        'total_commits_4_weeks': 0,
        'active_repos': [],
        'sources_checked': []
    }
    
    # Step 1: Test authentication and get username
    username = test_authentication()
    if not username:
        metrics['error'] = 'Authentication failed'
        return metrics
    
    metrics['authenticated_user'] = username
    all_repos = []
    
    # Step 2: Try user repos
    user_repos = get_user_repos(username)
    if user_repos is not None:
        all_repos.extend(user_repos)
        metrics['sources_checked'].append(f'user:{username}')
        print(f"✓ Found {len(user_repos)} repos for user {username}")
    
    # Step 3: Check for orgs the user belongs to
    try:
        orgs_response = requests.get(f'https://api.github.com/users/{username}/orgs', headers=HEADERS)
        if orgs_response.status_code == 200:
            orgs = orgs_response.json()
            for org in orgs:
                org_name = org.get('login')
                org_repos = get_org_repos(org_name)
                if org_repos:
                    all_repos.extend(org_repos)
                    metrics['sources_checked'].append(f'org:{org_name}')
                    print(f"✓ Found {len(org_repos)} repos for org {org_name}")
    except Exception as e:
        print(f"⚠ Could not fetch orgs: {e}")
    
    # Step 4: Also try common org names if they exist
    for org_name in ['bxthre3', 'bxthre3inc', 'Bxthre3-Inc']:
        org_repos = get_org_repos(org_name)
        if org_repos:
            all_repos.extend(org_repos)
            metrics['sources_checked'].append(f'org:{org_name}')
            print(f"✓ Found {len(org_repos)} repos for org {org_name}")
    
    # Deduplicate repos
    seen = set()
    unique_repos = []
    for repo in all_repos:
        repo_id = repo.get('full_name')
        if repo_id and repo_id not in seen:
            seen.add(repo_id)
            unique_repos.append(repo)
    
    metrics['total_repos'] = len(unique_repos)
    
    # Step 5: Collect commit metrics
    four_weeks_ago = (datetime.now(timezone.utc) - timedelta(weeks=4)).isoformat()
    
    for repo in unique_repos[:20]:  # Limit to 20 repos for rate limiting
        repo_name = repo.get('full_name')
        try:
            commit_count = get_repo_commits(repo_name, four_weeks_ago)
            metrics['total_commits_4_weeks'] += commit_count
            if commit_count > 0:
                metrics['active_repos'].append({
                    'name': repo_name,
                    'commits': commit_count
                })
        except Exception as e:
            print(f"⚠ Could not get commits for {repo_name}: {e}")
    
    return metrics

if __name__ == "__main__":
    print("Collecting GitHub metrics...")
    metrics = collect_github_metrics()
    
    if 'error' in metrics:
        print(f"✗ Failed: {metrics['error']}")
    else:
        print(f"\n✓ GitHub metrics collected successfully")
        print(f"  Authenticated user: {metrics['authenticated_user']}")
        print(f"  Sources checked: {', '.join(metrics['sources_checked'])}")
        print(f"  Total unique repos: {metrics['total_repos']}")
        print(f"  Commits (4 weeks): {metrics['total_commits_4_weeks']}")
        print(f"  Active repos: {len(metrics['active_repos'])}")
        
        # Save to file
        output_path = '/home/workspace/Bxthre3/projects/investor-protector/data/github_metrics.json'
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(metrics, f, indent=2)
        print(f"\n✓ Saved to {output_path}")
