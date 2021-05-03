#!/usr/bin/env bash

set -e

# pwd is the lib directory
cwd=$(pwd)

# dummy-data binary
unameOut="$(uname -s)"
case "${unameOut}" in
	Linux*)     
        dd_bin=dummy-data
		;;
	*)
        dd_bin=dummy-data.exe
esac

echo "Downloading $dd_bin"
mkdir -p bin
cd bin
if [[ -f $dd_bin ]]
then
    echo "Already present, skip downloading"
else
    curl https://tools.exivity.com/$dd_bin -O
    chmod +x $dd_bin
fi

echo "Running dummy-data with arguments \"$@\""
$cwd/bin/$dd_bin "$@"
