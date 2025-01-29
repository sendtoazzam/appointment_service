#!/bin/bash

# Exit immediately if any command fails
set -e

# Function to display the help menu
show_help() {
  echo ""
  echo "🌟 NestJS Module Generator Script 🌟"
  echo "==================================="
  echo "This script helps you quickly generate a NestJS module along with its controller and service."
  echo ""
  echo "🔹 Usage:"
  echo "  $0 <module-name> [--no-spec]"
  echo ""
  echo "🔹 Arguments:"
  echo "  <module-name>   (Required) The name of the module you want to create."
  echo "  --no-spec       (Optional) Prevents the creation of test (.spec.ts) files."
  echo "  --help          Displays this help message."
  echo ""
  echo "🔹 Examples:"
  echo "  👉 To create a module named 'users':"
  echo "     $0 users"
  echo ""
  echo "  👉 To create a module without test files:"
  echo "     $0 users --no-spec"
  echo ""
  echo "📢 Note: Ensure you run this script inside a NestJS project directory!"
  echo ""
  exit 0
}

# Ensure at least one argument is provided
if [ -z "$1" ]; then
  echo "❌ Error: Module name is required."
  echo "💡 Run '$0 --help' for usage instructions."
  exit 1
fi

# Handle the --help flag
if [[ "$1" == "--help" ]]; then
  show_help
fi

# Store the module name
NAME=$1
NO_SPEC=""

# Check if --no-spec flag is provided
for arg in "$@"; do
  if [ "$arg" == "--no-spec" ]; then
    NO_SPEC="--no-spec"
  fi
done

# Display what the script will do
echo ""
echo "🚀 Starting NestJS module generation..."
echo "======================================="
echo "📌 Module Name: $NAME"
if [ "$NO_SPEC" == "--no-spec" ]; then
  echo "📌 Test Files: Skipped (--no-spec applied)"
else
  echo "📌 Test Files: Included (default)"
fi
echo ""

# Step 1: Generate NestJS module, controller, and service
echo "🔨 Generating NestJS components..."
nest g mo app/$NAME
nest g co app/$NAME $NO_SPEC
nest g s app/$NAME $NO_SPEC
echo "✅ Module, controller, and service created successfully!"
echo ""

# Step 2: Define and create the required directories
DIRS=(
  "src/app/$NAME/dto/request"
  "src/app/$NAME/dto/response"
  "src/app/$NAME/exception"
  "src/app/$NAME/query-filter"
  "src/app/$NAME/enum"
)

echo "📂 Setting up project structure..."
mkdir -p "${DIRS[@]}"
echo "✅ Directories created successfully!"
echo ""

# Step 3: Run ESLint to fix formatting
echo "🔍 Running ESLint for code formatting..."
./node_modules/.bin/eslint src/app/$NAME/*.ts --fix || echo "⚠️ ESLint encountered some issues, but the script continued."
echo "✅ ESLint fixes applied!"
echo ""

# Final Success Message
echo "🎉 All done! Your NestJS module '$NAME' is ready."
echo "👉 Path: src/app/$NAME/"
echo "📂 Directories and files are structured properly."
echo "✅ Happy coding! 🚀"
echo ""
