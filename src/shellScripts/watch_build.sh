#!/bin/zsh
BITRISE_GIT_BRANCH=$1

if [[ ${BITRISE_GIT_BRANCH} == "" ]]; then
  BITRISE_GIT_BRANCH=$(git branch --show-current)
  if [[ ${BITRISE_GIT_BRANCH} == "" ]]; then
    echo "No branch was specified"
    exit 1
  fi
fi

echo "Getting builds running on Bitrise of ${BITRISE_GIT_BRANCH} currently running"

response=$(curl -s -X GET -H "Authorization: ${ACCESS_TOKEN}" "https://api.bitrise.io/v0.1/apps/${APP_SLUG}/builds?branch=${BITRISE_GIT_BRANCH}&status=0")
if [[ ${BUILDS_RESPONSE} == *"\"total_item_count\":0"* ]]; then
  echo "No builds are running on Bitrise"
  exit 0
fi

while [[ ${response} != *"\"total_item_count\":0"* ]]; do
  if [[ ${response} != *"\"total_item_count\":1"* ]]; then
    echo 'Build still in progress'
  else
    echo 'Builds still in progress'
  fi
  sleep 60
  response=$(curl -s -X GET -H "Authorization: ${ACCESS_TOKEN}" "https://api.bitrise.io/v0.1/apps/${APP_SLUG}/builds?branch=${BITRISE_GIT_BRANCH}&status=0")
done

echo "Builds finished!"
osascript -e "display notification \"Build finished!\" with title \"BITRISE BUILD ${BITRISE_GIT_BRANCH}\""