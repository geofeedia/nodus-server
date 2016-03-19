'use strict';

// ** Libraries
const Service = require('./Service');

// ** Platform
const _ = require('underscore');
const errors = require('nodus-framework').errors;
const logger = require('nodus-framework').logging.createLogger();

class Server extends Service {
    constructor(args, options, config) {
        super(args, options, config);

        this._services = [];
        this._interfaces = {};
    }

    loadService(service) {
        // ** TODO: Attach request/response hooks

        this._services.push(service);
    }

    loadInterface(_interface) {
        const name = _interface.name;

        if (this.interfaces[name])
            throw errors('INTERFACE_LOADED', {interface: name}, 'An interface with the same name is already loaded.');

        this.interfaces[name] = _interface;
    }

    start() {
        // ** Start all loaded services
        logger.debug("Starting services...");
        _.forEach(this._services, service => service.start());

        // ** Start all loaded services
        logger.debug("Starting interfaces...");
        _.forEach(this._interface, _interface => _interface.start());

        super.start();
    }

    stop() {
        logger.debug("Stopping services...");
        _.forEach(this._services, service => service.stop());

        // ** Start all loaded services
        logger.debug("Stopping interfaces...");
        _.forEach(this._services, _interface => _interface.start());

        super.stop();
    }
}

// ** Exports
module.exports = Server;
module.exports.Server = Server;