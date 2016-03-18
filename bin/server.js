#!/usr/bin/env node
'use strict';

// ** Platform
const logger = require('nodus-framework').logging.createLogger();
const cli = require('nodus-framework').cli;

// ** Load CLI options and arguments
const options = cli.options();
const args = cli.arguments();

logger.info({
    args: args,
    options: options,
    host: host,
    port: port
});