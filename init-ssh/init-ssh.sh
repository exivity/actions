#!/usr/bin/env bash

mkdir -p ~/.ssh
echo -e "$PRIVATE_KEY" > ~/.ssh/id_rsa
chmod og-rwx ~/.ssh/id_rsa
cp known_hosts ~/.ssh

# debug
ls -la ~/.ssh
