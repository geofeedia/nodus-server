'use strict';

// ** Libraries
const EventEmitter = require('events');

// ** Platform
const _ = require('underscore');
const errors = require('nodus-framework').errors;
const logger = require('nodus-framework').logging.createLogger();

class Server extends EventEmitter {
    constructor(options) {
        super();

        this._services = {};
        this._interfaces = {};

        this.isStarted = false;
    }

    loadService(service) {
        // ** TODO: Attach request/response hooks
        const name = service.name;

        if (this._services[name])
            throw errors('SERVICE_LOADED', name, 'An interface with the same name is already loaded.');

        this._services[name] = service;

        // ** Listen for REQUEST made from the service
        service.on('request', req => {
            logger.info(`[${service.name}] => REQUEST:`, req);

            throw errors('NOT_IMPLEMENTED', 'Services making requests is not implemented.');
        });

        // ** Log Stop/Start events from the service
        service.on('started', () => logger.info('Started Service:', name));
        service.on('stopped', () => logger.info('Stopped Service:', name));
    }

    loadInterface(name, _interface) {
        if (this._interfaces[name])
            throw errors('INTERFACE_LOADED', name, 'An interface with the same name is already loaded.');

        this._interfaces[name] = _interface;
    }

    interface(name) {
        return this._interfaces[name];
    }

    start() {
        // ** Start all loaded services
        logger.info("Starting services...");
        _.forEach(this._services, service => service.start());

        // ** Start all loaded services
        logger.info("Starting interfaces...");
        _.forEach(this._interfaces, _interface => _interface.start());

        this.emit('started');
    }

    stop() {
        // ** Stop all loaded interfaces
        logger.info("Stopping interfaces...");
        _.forEach(this._interfaces, _interface => _interface.stop());

        // ** Stop all services
        logger.info("Stopping services...");
        _.forEach(this._services, service => service.stop());


        this.emit('stopped');
    }
}

// ** Exports
module.exports = Server;
module.exports.Server = Server;