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
    if (!filepath) {
        // TODO: Show yargs help here
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
    _.forEach(config.services, (def, name) => {
        logger.info('Loading service:', {name: name}, def);
        const service = new Service({name: name});

        // ** Load the commands
        _.forEach(def.commands, (options, command_name) => {
            logger.info('Loading command:', {name: command_name}, options);

            const dir = path.relative(process.cwd(), filepath);
            logger.info('DIR:', dir);
            const provider_file = path.join(dir, options.provider);
            logger.info('FILE:', provider_file);

            // ** Load the provider for this command
            const provider = files.requireFile(provider_file);
            if (!provider)
                throw errors('PROVIDER_LOAD_ERROR', {provider: options.provider},
                    'Failed to load the provider for the command.');

            // ** Add the command to the service
            const command = new Command(_.extend({name: command_name}, options), provider);
            service.addCommand(command);

            //
            //
            // // ** Load the command
            // const command = functions.command(provider);
            //
            // // ** Register the command with it's interfaces
            // const basePath = service.name;
            // _.forEach(options.interfaces, (options, name) => {
            //     const inter = server.interface(name);
            //
            //     if (!inter) throw errors('INTERFACE_NOT_FOUND', {name: name});
            //
            //     const path = basePath + '/' + (options.path || command_name);
            //
            //     logger.info('REGISTER:', {command: command_name, interface: name});
            //     inter.registerEndpoint(path, options, (args, options) => command(args, options));
            // });
        });

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