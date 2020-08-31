#!/usr/bin/env bash

(ssh git@github.com 2>&1 | grep $USERNAME) || ssh -vvv git@github.com
