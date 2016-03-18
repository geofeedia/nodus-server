#!/usr/bin/env bash

PORT=3000
HOST="0.0.0.0"

set -e

#bin/server.js $@
bin/server.js examples/helloworld \
    --rest.port="${PORT}" \
    --rest.host="${HOST}" \
    $@ \
| bunyan