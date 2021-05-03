#!/usr/bin/env bash

set -e

# pwd is the lib directory
cwd=$(pwd)

# dummy-data binary
unameOut="$(uname -s)"
case "${unameOut}" in
	Linux*)     
        dd_bin=dummy-data
        sudo -- sh -c "echo \"37.97.203.170 tools.exivity.com\" >> /etc/hosts"
		;;
	*)
        dd_bin=dummy-data.exe
        echo "37.97.203.170 tools.exivity.com" >> C:\\Windows\\System32\\drivers\\etc\\hosts
esac

echo "Downloading $dd_bin"
if [[ -f $dd_bin ]]
then
    echo "Already present, skip downloading"
else
    curl --insecure https://tools.exivity.com/$dd_bin -O
    chmod +x $dd_bin
fi

echo "Running dummy-data with arguments \"$@\""
$dd_bin "$@"
