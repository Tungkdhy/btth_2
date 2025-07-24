#!/bin/bash

# Check input parameters
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <username> <ip-server>"
  exit 1
fi

USERNAME=$1
IP_SERVER=$2
BUILD_DIR="dist"   # Angular build directory
TAR_FILE="demo1.tar.gz"
REMOTE_PATH="~"     # Remote user's home directory
REMOTE_RUN_SCRIPT="$REMOTE_PATH/run.sh"

# Step 1: Build production
echo "Building Angular project for production..."
if ng build --configuration=production; then
  echo "Build completed successfully!"
else
  echo "Error during the build process!"
  exit 1
fi

# Step 2: Compress build directory
echo "Compressing build directory..."
if tar -czf $TAR_FILE -C $BUILD_DIR .; then
  echo "Compression completed successfully!"
else
  echo "Error during the compression process!"
  exit 1
fi

# Step 3: Transfer compressed file to server
echo "Transferring compressed file to server..."
if scp $TAR_FILE ${USERNAME}@${IP_SERVER}:${REMOTE_PATH} 2>&1; then
  echo "File transferred successfully!"
else
  echo "Error during file transfer!"
  exit 1
fi

# Step 4: Execute run.sh on server
echo "Executing deployment script on server..."
if ssh ${USERNAME}@${IP_SERVER} "bash $REMOTE_RUN_SCRIPT" 2>&1; then
  echo "Deployment completed successfully!"
7
  # Delete compressed file after successful deployment
  echo "Deleting compressed file locally..."
  if rm -f $TAR_FILE; then
    echo "Compressed file deleted successfully!"
  else
    echo "Error while deleting compressed file!"
  fi

else
  echo "Error during the deployment process!"
  exit 1
fi
