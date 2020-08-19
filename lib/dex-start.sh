#!/usr/bin/env bash

set -e

echo "Running Docker image exivity/dex:$TAG with name dex"

unameOut="$(uname -s)"
case "${unameOut}" in
	Linux*)     
		MOUNT="--mount type=bind,source=\"$GITHUB_WORKSPACE/$CWD\",target=/home"
		;;
	*)
		MOUNT="--mount type=bind,source=\"$GITHUB_WORKSPACE\\$CWD\",target=C:\\home"
esac

cmd="docker run \
    --rm \
    --name dex \
    $MOUNT \
    $ENV \
    exivity/dex:$TAG \
    \"$@\""

echo cmd

docker run \
    --rm \
    --name dex \
    $MOUNT \
    $ENV \
    exivity/dex:$TAG \
    "$@"
