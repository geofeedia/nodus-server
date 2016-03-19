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

// ** Shutdown the server on SIGINT, SIGTERM
['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, () => {
        logger.info(`**** ${signal} RECEIVED **** `);
        logger.info('Shutting down server...');

        server.stop();
        process.exit();
    });
});

// ** Load when the server is started and stopped
server.on('started', () => logger.info('Server started.'));
server.on('stopped', () => logger.info('Server stopped.'));

// ** Start the server
server.start();