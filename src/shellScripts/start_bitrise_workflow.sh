#!/bin/zsh
WORKFLOW=$1
SKIP_TESTS=$2
BITRISE_GIT_BRANCH=$(git branch --show-current)

case "${WORKFLOW}" in
android) WORKFLOW_TO_BE_TRIGGERED=Workflow_Android;;
android-edge) WORKFLOW_TO_BE_TRIGGERED=Workflow_Android_Edge;;
ios) WORKFLOW_TO_BE_TRIGGERED=Workflow_IOS;;
ios-edge) WORKFLOW_TO_BE_TRIGGERED=Workflow_IOS_Edge;;
*)
  echo "Valid inputs are android, android-edge, ios, ios-edge"
  exit 1
esac

if [[ $SKIP_TESTS == "skip-tests" ]]; then
  echo -e "Build will skip tests"
  SKIP_TESTS="true"
elif [[ $SKIP_TESTS == "" ]]; then
  echo -e "Build will not skip tests"
else
  echo -e "Second parameter should be skip-tests or nothing"
  exit 1
fi


payload="{
              \"hook_info\":{
                  \"type\":\"bitrise\"
              },
              \"build_params\":{
                  \"branch\":\"${BITRISE_GIT_BRANCH}\",
                  \"workflow_id\":\"${WORKFLOW_TO_BE_TRIGGERED}\",
                  \"base_repository_url\":\"https://github.com/camelotls/ie-native-app\",
                  \"environments\": [
                                      {
                                        \"is_expand\": true,
                                        \"mapped_to\": \"SKIP_TESTS\",
                                        \"value\": \"${SKIP_TESTS}\"
                                      }
                                    ]
              }
           }"

curl -X POST -H "Authorization: ${ACCESS_TOKEN}" "https://api.bitrise.io/v0.1/apps/af50b4926a122ad0/builds" -d \
  ${payload}
