#!/usr/bin/env node
'use strict';

// ** Dependencies
const _ = require('underscore');
const chalk = require('chalk');
const util = require('util');
const path = require('path');

// ** Libraries
const Command = require('../lib/Command');
const Service = require('../lib/Service');
const Server = require('../lib/Server');

// ** Platform
const errors = require('nodus-framework').errors;
const logger = require('nodus-framework').logging.createLogger();
const cli = require('nodus-framework').cli;
const files = require('nodus-framework').files;
const functions = require('nodus-framework').functions;

// ** Load CLI options and arguments
const options = cli.options();
logger.debug('OPTIONS:', options);

// ** Keep track of register interface providers
const __interfaces = {};
function create_interface(args, options, config) {
    const type = args.type;
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

    const dir = path.relative(process.cwd(), filepath);
    logger.info('DIR:', dir);


    if (!filepath) {
        console.log(chalk.red('Please specify a server module to load.'));
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
        const _interface = create_interface({
            type: type
        }, options, config);

        server.loadInterface(name, _interface)
    });

    logger.info('INTERFACES:', server._interfaces);

    // ** Load Services
    _.forEach(config.services, (service_options, service_name) => {
        logger.info('Loading service:', {name: service_name}, service_options);

        // ** If the def is a string, then assume it is a service exported from JS code
        let service;
        if (util.isString(service_options)) {
            const provider_file = path.join(dir, service_options);
            logger.info('FILE:', provider_file);

            const provider = files.requireFile(provider_file);

            service = new provider(service_name, service_options);
        } else {
            // ** Dynamically build the service from it's command definitions.
            service = new Service(service_name, service_options);
        }

        // ** Load the commands
        _.forEach(service_options.commands, (command_options, command_name) => {
            logger.info('Loading command:', {name: command_name}, command_options);

            const provider_file = path.join(dir, command_options.provider);
            logger.info('FILE:', provider_file);

            // ** Load the provider for this command
            const provider = files.requireFile(provider_file);
            if (!provider)
                throw errors('PROVIDER_LOAD_ERROR', {provider: command_options.provider},
                    'Failed to load the provider for the command.');

            // ** Add the command to the service
            const command = new Command(command_name, command_options, provider);
            service.addCommand(command);
        });

        if (!service)
            throw errors('SERVICE_LOAD_FAILURE', {service: service_name},
                'Failed to load the service.');

        server.loadService(service);
    });

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