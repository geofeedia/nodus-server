'use strict';

// ** Dependencies
const uuid = require('uuid');

// ** Libraries
const EventEmitter = require('events');
const Component = require('./Component');

// ** Platform
const errors = require('nodus-framework').errors;
const logger = require('nodus-framework').logging.createLogger();

/**
 * Constainer class for a request
 */
class PendingRequest extends EventEmitter {
    constructor(req, options, callback) {
        super();

        this.req = req;
        this.options = options; // TODO: Add timeout support
        this.callback = callback;
    }

    fail(err) {
        this.callback(err);
    }

    complete(response) {
        this.callback(null, response)
    }
}

class Service extends Component {
    constructor(args, options) {
        super(args, options);

        this.isStarted = false;
        this._pendingRequests = {};

        this.on('response', res => this._response);
    }

    _response(res) {
        const id = res.id;
        const req = this._pendingRequests[id];

        if (!req)
            throw errors('NO_PENDING_REQUEST', {response: res}, 'A pending request could not be found for this response.');

        // ** Remove this pending request as resolved
        delete this._pendingRequests[id];

        // ** Check for errors
        if (res.error)
            return req.fail(res.error);

        // ** Request completed successfully
        req.complete(res.result);
    }

    _send_request(req, options, callback) {
        // ** Create a new pending request
        const pending_request = new PendingRequest(req, options, callback);
        this._pendingRequests.push(pending_request);

        // ** Emit the request
        this.emit('request', req);
    }

    /**
     * Issues a request to the host to call another service
     * @param service
     * @param command
     * @param args
     * @param options
     */
    request(service, command, args, options, data) {

        // ** Create a new request mesage
        const req = {
            id: uuid.v4(),
            service: service,
            command: command,
            args: args,
            options: options,
            data: data
        };

        // ** Wait for a response
        return new Promise((reject, resolve) => {
            this._send_request(req, options, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        });
    }

    start() {
        if (this.isStarted) {
            logger.warn('SERVICE_STARTED', {service: this.name});
            return;
        }

        this.emit('start');
        this.isStarted = true;
        this.emit('started');
    }

    stop() {
        if (!this.isStarted) {
            logger.warn('SERVICE_STOPPED', {name: this.name});
            return;
        }

        this.emit('stop');
        this.isStarted = false;
        this.emit('stopped');
    }
}

// ** Exports
module.exports = Service;
module.exports.Service = Service;