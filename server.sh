#!/usr/bin/env bash

PORT=3000
HOST="0.0.0.0"

set -e

bin/server.js $@ \
| node_modules/bunyan/bin/bunyan