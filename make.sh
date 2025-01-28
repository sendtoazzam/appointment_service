#!/bin/bash

if [ -z "$1" ]; then
  echo "Error: Name parameter is required."
  exit 1
fi

NAME=$1

nest g mo app/$NAME
nest g co app/$NAME
nest g s app/$NAME

mkdir -p src/app/$NAME/dto
mkdir -p src/app/$NAME/exception
mkdir -p src/app/$NAME/query-filter

./node_modules/.bin/eslint src/app/$NAME/*.ts --fix

echo "Successfully created module, controller, and service for $NAME. Directories and ESLint fixes applied."
