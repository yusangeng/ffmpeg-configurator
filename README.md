# FFmpeg Configurator

GUI configurator and CMD generator of ffmpeg.

## Development Setup

To push changes to GitHub, you need to set up authentication with a GitHub Personal Access Token.

### Storing Your GitHub Token

For security, the GitHub Personal Access Token is stored in a local file that is ignored by Git:

1. The token is stored in `secrets/github_token.txt`
2. This file is ignored by Git via the `.gitignore` file
3. Never commit this file to the repository

### Pushing Changes

To push changes to GitHub, use the provided script:

```bash
./scripts/push_with_token.sh
```

This script will:
1. Temporarily configure Git to use the token from `secrets/github_token.txt`
2. Set up the SOCKS5 proxy for network connectivity
3. Push the changes to GitHub
4. Clean up the temporary configuration

### Creating a New Token

If you need to create a new token:
1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate a new token with the `repo` scope
3. Copy the token and paste it into `secrets/github_token.txt`