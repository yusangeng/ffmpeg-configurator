#!/bin/bash

# Script to push changes to GitHub using the stored token and proxy

# Check if the token file exists
if [ ! -f "secrets/github_token.txt" ]; then
    echo "Error: secrets/github_token.txt not found"
    echo "Please create this file with your GitHub Personal Access Token"
    exit 1
fi

# Read the token from the file
TOKEN=$(cat secrets/github_token.txt)

# Set up the Git configuration for this push
git config --local http.proxy socks5://127.0.0.1:7890
git remote set-url origin https://oauth2:$TOKEN@github.com/yusangeng/ffmpeg-configurator.git

# Perform the push
echo "Pushing changes to GitHub..."
git push "$@"

# Store the exit code
EXIT_CODE=$?

# Clean up the Git configuration
git remote set-url origin https://github.com/yusangeng/ffmpeg-configurator.git
git config --local --unset http.proxy

# Exit with the same code as git push
exit $EXIT_CODE