#!/usr/bin/env bash

set -e

echo "Downloading dex binary"
if [[ -f dex.exe || -f dex ]]
then
    echo "Already present, skip downloading"
else
    curl https://dex.exivity.com/v3/dex.exe -O
fi

echo "Moving to working directory"
cd "$GITHUB_WORKSPACE/$CWD"

echo "Running dex with arguments \"$@\""
dex "$@"
