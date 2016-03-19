#!/usr/bin/env node
'use strict';

// ** Dependencies
const _ = require('underscore');
const chalk = require('chalk');
const util = require('util');
const path = require('path');

// ** Libraries
const Server = require('../lib/Server.js');

// ** Platform
const logger = require('nodus-framework').logging.createLogger();
const cli = require('nodus-framework').cli;
const files = require('nodus-framework').files;

// ** Load CLI options and arguments
const options = cli.options();
logger.debug('OPTIONS:', options);

// ** Keep track of register interface providers
const __interfaces = {};
function create_interface(type, options, config) {
    // ** Check if we have already loaded this provider
    if (!__interfaces[type]) {
        __interfaces[type] = require(`../${type}`);
    }

    return new __interfaces[type](options, config);
}

// ** Create a new server
const server = new Server(options);

function shutdown() {
    logger.info('Shutting down server...');

    server.stop();
    process.exit();
}

function init() {
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
}

// ** Load the server configuration
function load() {
    // ** We were passed the server configuration (json|js)
    const filepath = options._[0];
    logger.debug('FILE:', filepath);
    if (!filepath) {
        // TODO: Show yargs help here
        console.log(chalk.red('Please specifiy a server module to load.'));
        process.exit();
    }

    // ** server.json
    const extension = path.extname(filepath);
    logger.debug('EXTENSION:', extension);

    const config = files.requireFile(filepath);

    logger.info('CONFIG:', config);

    // ** Load Interfaces
    _.forEach(config.interfaces, (def, name) => {
        logger.debug('Loading interface:', {name: name}, def);

        const type = def.type;
        const options = def.options;
        const config = def.config;
        const _interface = create_interface(type, options, config);

        server.loadInterface(_interface)
    });

    // ** Load Services
    const services = config.services;
    // _.forEach(config.services, s => server.loadService(s));

}

function start() {
    // ** Start the server
    server.start();

    // ** Start reading from stdin so we don't exit.
    process.stdin.resume();
    process.stdin.on('end', () => {
        logger.warn('**** EOF RECEIVED. ****');
        shutdown();
    });
}

function stop() {
    server.stop();
}

init();
load();
start();