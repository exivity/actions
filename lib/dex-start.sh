#!/usr/bin/env bash

set -e

echo "Running Docker image exivity/dex:$TAG with name dex"

unameOut="$(uname -s)"
case "${unameOut}" in
	Linux*)     
        FROM="$GITHUB_WORKSPACE/$CWD"
        TO=/home
		;;
	*)
        FROM="$GITHUB_WORKSPACE\\$CWD"
        TO="C:\\home"
esac

docker run \
    --rm \
    --name dex \
    --mount "type=bind,source=$FROM,target=$TO" \
    $ENV \
    exivity/dex:$TAG \
    "$@"
