#!/usr/bin/env bash

set -e

# pwd is the lib directory
cwd=$(pwd)

# dex binary
unameOut="$(uname -s)"
case "${unameOut}" in
	Linux*)     
        dex_bin=dex
		;;
	*)
        dex_bin=dex.exe
esac

echo "Downloading $dex_bin"
mkdir -p bin
cd bin
if [[ -f $dex_bin ]]
then
    echo "Already present, skip downloading"
else
    curl https://dex.exivity.com/v3/$dex_bin -O
    chmod +x $dex_bin
fi
cd $cwd
which git
whereis git
yarn
node test-which.js

echo "Running dex with arguments \"$@\""
cd "$GITHUB_WORKSPACE/$CWD"
git rev-parse --is-inside-work-tree
$cwd/bin/$dex_bin "$@"
