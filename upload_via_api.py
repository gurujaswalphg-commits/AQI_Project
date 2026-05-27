#!/usr/bin/env python3
"""
Upload files to GitHub using the GitHub API
"""

import os
import base64
import requests
import json
from pathlib import Path

# GitHub configuration
GITHUB_API_URL = "https://api.github.com"
REPO_OWNER = "gurujaswalphg-commits"
REPO_NAME = "AQI_Project"
BRANCH = "main"

# You'll need to provide your GitHub token
# Generate one at https://github.com/settings/tokens
# Make sure it has 'repo' and 'user' scopes

def get_github_token():
    """Get GitHub token from environment or user input"""
    token = os.getenv('GITHUB_TOKEN')
    if not token:
        print("=" * 70)
        print("GitHub Personal Access Token Required")
        print("=" * 70)
        print()
        print("To upload files, you need a GitHub Personal Access Token.")
        print()
        print("1. Go to: https://github.com/settings/tokens/new")
        print("2. Select scopes: 'repo' (full control of private repositories)")
        print("3. Click 'Generate token'")
        print("4. Copy the token and paste it below")
        print()
        token = input("Enter your GitHub Personal Access Token: ").strip()
    return token

def file_exists_on_github(headers, file_path):
    """Check if file already exists on GitHub"""
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/contents/{file_path}"
    response = requests.get(url, headers=headers)
    return response.status_code == 200, response

def upload_file(file_path, github_path, token):
    """Upload a single file to GitHub"""
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "AQI-Project-Uploader"
    }
    
    # Read file content
    with open(file_path, 'rb') as f:
        content = f.read()
    
    # Encode to base64
    encoded_content = base64.b64encode(content).decode('utf-8')
    
    # Check if file exists
    exists, existing_response = file_exists_on_github(headers, github_path)
    
    # Prepare upload data
    upload_data = {
        "message": f"Upload {github_path}",
        "content": encoded_content
    }
    
    # Add SHA if file exists (needed for updates)
    if exists:
        existing_file = existing_response.json()
        upload_data["sha"] = existing_file.get("sha", "")
        print(f"  Updating: {github_path}")
    else:
        print(f"  Creating: {github_path}")
    
    # Upload
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/contents/{github_path}"
    response = requests.put(url, json=upload_data, headers=headers)
    
    return response.status_code in [201, 200], response

def main():
    """Main upload function"""
    print("=" * 70)
    print(f"GitHub Repository Uploader")
    print("=" * 70)
    print(f"Repository: {REPO_OWNER}/{REPO_NAME}")
    print(f"Branch: {BRANCH}")
    print()
    
    # Get token
    token = get_github_token()
    
    if not token:
        print("ERROR: No token provided")
        return False
    
    print()
    print("Testing GitHub credentials...")
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "AQI-Project-Uploader"
    }
    
    # Test API access
    test_url = f"{GITHUB_API_URL}/user"
    response = requests.get(test_url, headers=headers)
    if response.status_code != 200:
        print(f"ERROR: Failed to authenticate. Status: {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    user_data = response.json()
    print(f"✓ Authenticated as: {user_data.get('login')}")
    print()
    
    # Get current directory
    current_dir = os.getcwd()
    
    # List files to upload
    files_to_upload = []
    for item in os.listdir(current_dir):
        item_path = os.path.join(current_dir, item)
        if os.path.isfile(item_path) and not item.startswith('.'):
            files_to_upload.append((item_path, item))
    
    if not files_to_upload:
        print("No files to upload")
        return False
    
    print(f"Files to upload ({len(files_to_upload)}):")
    print()
    
    for file_path, file_name in files_to_upload:
        size = os.path.getsize(file_path)
        if size > 1024*1024:
            size_str = f"{size / (1024*1024):.2f} MB"
        elif size > 1024:
            size_str = f"{size / 1024:.2f} KB"
        else:
            size_str = f"{size} bytes"
        print(f"  - {file_name} ({size_str})")
    
    print()
    confirm = input("Proceed with upload? (yes/no): ").strip().lower()
    
    if confirm not in ['yes', 'y']:
        print("Upload cancelled")
        return False
    
    print()
    print("Uploading files...")
    print()
    
    success_count = 0
    failed_count = 0
    
    for file_path, file_name in files_to_upload:
        success, response = upload_file(file_path, file_name, token)
        
        if success:
            success_count += 1
            print(f"  ✓ {file_name}")
        else:
            failed_count += 1
            print(f"  ✗ {file_name}")
            print(f"    Error: {response.status_code}")
            if response.status_code == 413:
                print(f"    File too large (GitHub API limit: 100MB)")
            else:
                print(f"    Response: {response.text[:200]}")
    
    print()
    print("=" * 70)
    print(f"Upload Summary:")
    print(f"  Successful: {success_count}")
    print(f"  Failed: {failed_count}")
    print()
    
    if failed_count == 0:
        print("✓ All files uploaded successfully!")
        print()
        print(f"View your repository: https://github.com/{REPO_OWNER}/{REPO_NAME}")
        return True
    else:
        print("⚠ Some files failed to upload. Check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
