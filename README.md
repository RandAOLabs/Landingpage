# Site Deployer

This repository automates the process of downloading a website and deploying it to Permaweb.

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the following secrets in your GitHub repository:
   - `DEPLOY_ANT_PROCESS`: Your Permaweb ANT process key

## Usage

1. Go to the "Actions" tab in your GitHub repository
2. Click on "Download and Deploy Site"
3. Click "Run workflow"
4. Enter the URL of the site you want to download
5. Click "Run workflow"

The action will:
1. Download the specified site
2. Build the project
3. Deploy it to Permaweb using your configured ANT process

## Local Development

To test locally:
1. Set the SITE_URL environment variable
2. Run `npm run download` to download the site
3. Run `npm run deploy` to deploy to Permaweb

## Scripts

- `npm run download`: Downloads the site specified in SITE_URL
- `npm run build`: Builds the project
- `npm run deploy`: Deploys the built site to Permaweb
