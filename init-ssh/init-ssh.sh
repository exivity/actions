#!/usr/bin/env bash

set -e

echo "Create ~/.ssh folder"
mkdir -p ~/.ssh

echo "Copy private key to ~/.ssh/id_rsa"
echo -e "$PRIVATE_KEY" > ~/.ssh/id_rsa

echo "Set proper permissions on ~/.ssh/id_rsa"
chmod og-rwx ~/.ssh/id_rsa

echo "Copy known_hosts to ~/.ssh"
cp known_hosts ~/.ssh
