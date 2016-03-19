#!/usr/bin/env node
'use strict';

// ** Libraries
const Server = require('../lib/Server.js');

// ** Platform
const logger = require('nodus-framework').logging.createLogger();
const cli = require('nodus-framework').cli;

// ** Load CLI options and arguments
const options = cli.options();
const args = cli.arguments();
const config = options.config;

const server = new Server(args, options, config);

function shutdown() {
    logger.info('Shutting down server...');

    server.stop();
    process.exit();
}

// ** Shutdown the server on SIGINT, SIGTERM
['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, () => {
        logger.warn(`**** ${signal} RECEIVED **** `);

        shutdown();
    });
});

// ** Load when the server is started and stopped
server.on('started', () => logger.info('Server started.'));
server.on('stopped', () => logger.info('Server stopped.'));

// ** Start the server
server.start();

// ** Start reading from stdin so we don't exit.
process.stdin.resume();
process.stdin.on('end', () => {
    logger.warn('**** EOF RECEIVED. ****');
    shutdown();
});