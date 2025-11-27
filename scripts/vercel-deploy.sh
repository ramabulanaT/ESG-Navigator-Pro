#!/bin/bash
# Vercel Deployment Script for ESG Navigator Pro
# Usage: ./scripts/vercel-deploy.sh [--prod]

set -e

# Configuration
APP_DIR="esg-navigator/apps/web"
PROJECT_NAME="${VERCEL_PROJECT_NAME:-esg-navigator-pro-2nyf}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

die() {
    echo -e "${RED}ERROR: $*${NC}" >&2
    exit 1
}

info() {
    echo -e "${GREEN}INFO: $*${NC}"
}

warn() {
    echo -e "${YELLOW}WARN: $*${NC}"
}

# Ensure we're inside a git repo
git rev-parse --show-toplevel >/dev/null 2>&1 || die "Run this from your repo root"

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# Validate app directory exists
if [[ ! -d "$APP_DIR" ]]; then
    die "App directory '$APP_DIR' not found. Expected Next.js app at: $REPO_ROOT/$APP_DIR"
fi

info "Using app directory: $APP_DIR"

# Validate VERCEL_TOKEN
if [[ -z "$VERCEL_TOKEN" ]]; then
    die "VERCEL_TOKEN environment variable is not set.

To fix this:
1. Go to https://vercel.com/account/tokens
2. Create a new token
3. Set it in your environment:
   export VERCEL_TOKEN='your-actual-token-here'

Or add it to your shell profile (~/.bashrc or ~/.zshrc)"
fi

# Check for placeholder values in VERCEL_TOKEN
if [[ "$VERCEL_TOKEN" == *"<"* ]] || [[ "$VERCEL_TOKEN" == *">"* ]]; then
    die "VERCEL_TOKEN contains < or >. Use the raw token string, not a placeholder.

Current value starts with: ${VERCEL_TOKEN:0:10}..."
fi

# Check if vercel CLI is available
if ! command -v vercel &> /dev/null; then
    die "Vercel CLI not found. Install it with: npm install -g vercel"
fi

info "VERCEL_TOKEN is configured correctly"

# Navigate to app directory
cd "$APP_DIR"

# Check for package.json
if [[ ! -f "package.json" ]]; then
    die "No package.json found in $APP_DIR"
fi

# Parse arguments
PROD_FLAG=""
if [[ "$1" == "--prod" ]] || [[ "$1" == "-p" ]]; then
    PROD_FLAG="--prod"
    info "Deploying to PRODUCTION"
else
    info "Deploying to PREVIEW (use --prod for production)"
fi

# Run the deployment
info "Starting Vercel deployment..."
vercel deploy $PROD_FLAG --token="$VERCEL_TOKEN" --yes

info "Deployment complete!"
