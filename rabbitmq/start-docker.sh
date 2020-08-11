#!/usr/bin/env bash

# https://gist.github.com/sj26/88e1c6584397bb7c13bd11108a579746
function retry {
  local retries=$1
  shift

  local count=0
  until "$@"; do
    exit=$?
    wait=$((2 ** $count))
    count=$(($count + 1))
    if [ $count -lt $retries ]; then
      echo "Retry $count/$retries exited $exit, retrying in $wait seconds..."
      sleep $wait
    else
      echo "Retry $count/$retries exited $exit, no more retries left."
      return $exit
    fi
  done
  return 0
}

function health {
  docker inspect --format='{{json .State.Health.Status}}' rabbitmq
}

function test {
  status=`health`

  echo "Got status $status"

  [ $status = "\"healthy\"" ]
}

set -e

docker run \
    --rm \
    --detach \
    -p 4369:4369 \
    -p 5671:5671 \
    -p 5672:5672 \
    -p 15672:15672 \
    --name rabbitmq \
    $DOCKER_IMAGE

retry 10 test
