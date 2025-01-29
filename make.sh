#!/bin/bash

# Exit script on error
set -e

# Ensure the NAME parameter is provided
if [ -z "$1" ]; then
  echo "❌ Error: Name parameter is required."
  echo "Usage: $0 <name> [--no-spec]"
  exit 1
fi

NAME=$1
NO_SPEC=""

# Function to check for --no-spec flag
check_no_spec_flag() {
  for arg in "$@"; do
    if [ "$arg" == "--no-spec" ]; then
      NO_SPEC="--no-spec"
      break
    fi
  done
}

# Check for optional --no-spec flag
check_no_spec_flag "$@"

echo "🚀 Generating NestJS module for: $NAME"

# Generate module, controller, and service
nest g mo app/$NAME
nest g co app/$NAME $NO_SPEC
nest g s app/$NAME $NO_SPEC

# Define directory structure
DIRS=(
  "src/app/$NAME/dto/request"
  "src/app/$NAME/dto/response"
  "src/app/$NAME/exception"
  "src/app/$NAME/query-filter"
  "src/app/$NAME/enum"
)

# Create necessary directories
mkdir -p "${DIRS[@]}"

# Run ESLint on the generated files
echo "🔍 Running ESLint..."
./node_modules/.bin/eslint src/app/$NAME/*.ts --fix || echo "⚠️ ESLint encountered issues."

echo "✅ Successfully created module, controller, and service for $NAME."
echo "📂 Directories created and ESLint fixes applied."
