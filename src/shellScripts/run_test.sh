#!/bin/zsh

new_window() {
  if [ "$#" -eq "0" ]; then
    osascript -e 'tell application "iTerm2" to tell current window to set newWindow to (create window with default profile)'
  else
    a="$1"
    for ARG in "${@:2}"; do
      a="${a} && ${ARG}"
    done
    osascript -e 'tell application "iTerm2" to tell current window to set newWindow to (create window with default profile)' -e "tell application \"iTerm2\" to tell current session of newWindow to write text \"${a}\""
  fi
}

export BITRISE_GIT_BRANCH=$(git branch --show-current)
export GIT_HASH=$(git rev-parse ${BITRISE_GIT_BRANCH})

node runTest.js

echo "Variable: ${testSuite}"
ECHO_GREEN='\033[0;32m'
ECHO_RED='\033[0;31m'
ECHO_PURPLE='\033[0;35m'
ECHO_LIGHT_BLUE='\033[1;34m'
ECHO_ORANGE='\033[0;33m'
ECHO_NO_COLOR='\033[0m'

if [[ $PLATFORM == *"android"* ]]; then
  APP_PREFIX="app-release"
  APP_SUFFIX=".apk"
else
  APP_PREFIX="CtpIENativeApp"
  APP_SUFFIX="app.zip"
fi

APP_NAME=${APP_PREFIX}-$PLATFORM-${BITRISE_GIT_BRANCH}-${GIT_HASH}${APP_SUFFIX}

sc_storage_response=$(curl -s -u "${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}" --location --request GET "https://api.eu-central-1.saucelabs.com/v1/storage/files" -G -d "q=${APP_NAME}")

if [[ $sc_storage_response == *"\"total_items\": 0"* ]]; then
  echo -e "\n${ECHO_RED}Couldn't find app named:\n${ECHO_ORANGE}${APP_NAME}\n${ECHO_RED}Please build your app and retry!${ECHO_NO_COLOR}"
  exit 1
else
  echo "${ECHO_GREEN}App named:\n${ECHO_ORANGE}${APP_NAME}\n${ECHO_GREEN}exists on SauceLabs storage. Test will run soon...${ECHO_NO_COLOR}"
fi

sc_tunnel_response=$(curl -s -u "${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}" --location --request GET "https://api.eu-central-1.saucelabs.com/rest/v1/${SAUCE_USERNAME}/tunnels" --header 'Content-Type: application/json')

if [[ ${sc_tunnel_response} == "[]" ]]; then
  echo -e "\n${ECHO_PURPLE}Opening sauce tunnel${ECHO_NO_COLOR}"
  osascript -e "display notification \"Establishing Sauce Tunnel\" with title \"TUNNEL\""
  new_window "~/Project/sc-4.7.1-osx/bin/sc -u ${SAUCE_USERNAME} -k ${SAUCE_ACCESS_KEY} -x https://eu-central-1.saucelabs.com/rest/v1 -i ${TUNNEL_IDENTIFIER}"
  end=$((SECONDS + 120))
  while [[ ${SECONDS} -lt $end && ${sc_tunnel_response} == "[]" ]]; do
    echo -e "\n${ECHO_LIGHT_BLUE}Waiting for the tunnel to be established!${ECHO_NO_COLOR}"
    sleep 1
    sc_tunnel_response=$(curl -s -u "${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}" --location \
      --request GET "https://api.eu-central-1.saucelabs.com/rest/v1/${SAUCE_USERNAME}/tunnels" \
      --header 'Content-Type: application/json')
  done
  echo -e "\n${ECHO_GREEN}Sauce Labs tunnel established!${ECHO_NO_COLOR}"
  sleep 15
else
  echo -e "\n${ECHO_GREEN}SauceLabs tunnel is open${ECHO_NO_COLOR}"
fi

wiremock_response=$(curl -s --request GET "http://localhost:5040/services/translations/exporter.mobile.en.json")

if [[ ${wiremock_response} == "" ]]; then
  echo -e "\n${ECHO_PURPLE}Starting Wiremock${ECHO_NO_COLOR}"
  osascript -e "display notification \"Starting Wiremock\" with title \"WIREMOCK\""
  new_window "java -jar ~/Project/wiremock-standalone-2.25.1.jar --port 5040 --root-dir ~/Project/ie-native-app/docker-mocks/mocks --verbose --local-response-templating"
fi

echo -e "\n${ECHO_GREEN}Wiremock is running!${ECHO_NO_COLOR}"

FORMATTED_PLATFORM=${PLATFORM//[-]/.}

~/Project/ie-native-app/node_modules/.bin/wdio test/conf/wdio.${FORMATTED_PLATFORM}.sauce.conf.js --spec ${TEST}
