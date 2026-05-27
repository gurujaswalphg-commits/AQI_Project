#!/usr/bin/env python3
"""
Upload AQI Project to GitHub repository
"""

import os
import sys
from git import Repo
from git.exc import GitCommandError, InvalidGitRepositoryError

# Project details
repo_url = 'https://github.com/gurujaswalphg-commits/AQI_Project.git'
local_path = os.getcwd()

print(f'Working directory: {local_path}')
print(f'Repository URL: {repo_url}')
print()

# Check if .git directory exists
git_dir = os.path.join(local_path, '.git')
if os.path.exists(git_dir):
    print('Git repository already exists, using existing repository...')
    repo = Repo(local_path)
    try:
        origin = repo.remote('origin')
    except ValueError:
        print('Remote "origin" not found, adding it...')
        origin = repo.create_remote('origin', repo_url)
else:
    print('Initializing new git repository...')
    repo = Repo.init(local_path)
    origin = repo.create_remote('origin', repo_url)
    print('Remote added successfully')

print()
print('Adding files...')

# Get list of files to add (exclude .git and script itself)
files_to_add = []
for item in os.listdir(local_path):
    item_path = os.path.join(local_path, item)
    if os.path.isfile(item_path) and item not in ['.gitignore', 'upload_to_github.py']:
        files_to_add.append(item)
        
if files_to_add:
    repo.index.add(files_to_add)
    print(f'Staged {len(files_to_add)} files for commit')
else:
    print('No files to add')

print()
print('Summary of files to be pushed:')
for file in sorted(files_to_add):
    size = os.path.getsize(os.path.join(local_path, file))
    if size > 1024*1024:
        size_str = f'{size / (1024*1024):.2f} MB'
    elif size > 1024:
        size_str = f'{size / 1024:.2f} KB'
    else:
        size_str = f'{size} bytes'
    print(f'  - {file} ({size_str})')

print()

# Create commit
try:
    if repo.index.diff("HEAD"):
        repo.index.commit('Upload AQI Project to GitHub - May 27, 2026')
        print('Commit created successfully')
    else:
        print('No changes to commit')
except GitCommandError as e:
    if 'no changes added to commit' in str(e):
        print('No changes to commit')
    else:
        print(f'Commit error: {e}')

print()
print('Git configuration:')
try:
    config = repo.config_reader()
    user_name = config.get_value('user', 'name')
    user_email = config.get_value('user', 'email')
    print(f'  User: {user_name} <{user_email}>')
except:
    print('  WARNING: Git user not configured!')
    print('  Run: git config --global user.name "Your Name"')
    print('  Run: git config --global user.email "your.email@example.com"')

print()
print('Repository status:')
print(f'  Current branch: {repo.active_branch.name}')
print()

# List remote
print('Remote repositories:')
for remote in repo.remotes:
    for url in remote.urls:
        print(f'  {remote.name}: {url}')

print()
print('Ready to push. Run: git push -u origin main')
print('Or use: git push -u origin master (if using master branch)')
