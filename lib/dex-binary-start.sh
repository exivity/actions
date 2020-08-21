#!/usr/bin/env bash

set -e

# pwd is the lib directory
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
ls -la .
ls -la $cwd
ls -la $cwd/..
cd $cwd

echo "Running dex with arguments \"$@\""
cd "$GITHUB_WORKSPACE/$CWD"
$cwd/bin/dex "$@"
