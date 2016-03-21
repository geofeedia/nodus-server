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

        // ** Listen for REQUEST made from the service
        _interface.on('request', req => {
            logger.info(`[${_interface.name}] => REQUEST:`, req);

            // ** Route the request appropriately
            const id = req.id;
            const service_name = req.service;
            const command_name = req.command;
            const args = req.args;
            const options = req.options;

            // ** Find the first service that will accept this request
            const services = _.values(this._services);

            // ** Find a service that will accept this type of request
            let service, receipt;
            for (let lcv = 0; lcv < services.length; lcv++) {
                service = services[lcv];
                receipt = service.handle_request(req);
                if (receipt.accepted) {
                    logger.info('FOUND HANDLER:', service.name);

                    // ** Formulate a response message
                    const response = {
                        id: id
                    };

                    // ** Run the command and send the response to the service
                    // and return.
                    return receipt
                        .result
                        .then(result => {
                            logger.info('RESULT:', result);
                            response.result = result;
                            _interface.emit('response', response);
                            // this.on_response(response);
                        })
                        .catch(err => {
                            logger.error(err);
                            response.error = err;
                            // this.on_response(response);
                            _interface.emit('response', response);
                        })
                }
            }

            throw errors('NOT_SUPPORTED', 'Unhandled messages not supported at the moment.');
        });
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