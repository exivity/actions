#!/usr/bin/env bash

# Local vars
component=$(cut -d "/" -f 2 <<< $GITHUB_REPOSITORY)
data="{\
  \"accountName\":\"exivity\",\
  \"projectSlug\":\"scaffold\",\
  \"branch\":\"$BRANCH\",\
  \"environmentVariables\":{\
    \"CUSTOM_COMMIT_${component^^}\":\"$GITHUB_SHA\",\
    \"GITHUB_PINGBACK\":\"${GITHUB_REPOSITORY}/statuses/${GITHUB_SHA}\"\
  }\
}"

# Request new scaffold build
echo "Calling AppVeyor API to trigger new build"
curl \
  -H "Authorization: Bearer $APPVEYOR_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST \
  --data $data https://ci.appveyor.com/api/builds
