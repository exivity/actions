#!/usr/bin/env bash

set -e

cwd=$(pwd)

echo "Downloading dex binary"
mkdir -p bin
cd bin
if [[ -f dex.exe || -f dex ]]
then
    echo "Already present, skip downloading"
else
    curl https://dex.exivity.com/v3/dex.exe -O
fi
cd $cwd

echo "Running dex with arguments \"$@\""
cd "$GITHUB_WORKSPACE/$CWD"
$cwd/bin/dex "$@"
