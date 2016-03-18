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
        this._interfaces = [];
    }

    loadService(service) {
        return this._services.push(service);
    }

    loadInterface(interf) {
        return this._interfaces.push(interf);
    }

    start() {
        // ** Start all loaded services
        logger.debug("Loading services...");
        _.forEach(this._services, service => service.start());

        super.start();
    }

    stop() {
        logger.debug("Stopping services...");
        _.forEach(this._services, service => service.stop());

        super.stop();
    }
}

// ** Exports
module.exports = Server;
module.exports.Server = Server;