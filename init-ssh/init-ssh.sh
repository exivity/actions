#!/usr/bin/env bash
set -e

echo "Create ~/.ssh folder"
mkdir -p ~/.ssh

echo "Copy private key to ~/.ssh/id_rsa"
# Use printf to correctly write the private key with proper newlines
printf "%s\n" "$PRIVATE_KEY" > ~/.ssh/id_rsa

echo "Set proper permissions on ~/.ssh/id_rsa"
chmod og-rwx ~/.ssh/id_rsa

echo "Copy known_hosts to ~/.ssh"
cp known_hosts ~/.ssh

echo "Starting SSH-agent"
eval "$(ssh-agent -s)"
echo "SSH_AUTH_SOCK=$SSH_AUTH_SOCK"
echo "SSH_AGENT_PID=$SSH_AGENT_PID"

echo "Add private key to SSH-agent"
ssh-add ~/.ssh/id_rsa
