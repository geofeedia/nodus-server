'use strict';

// ** Dependencies
const Component = require('./Component');

// ** Platform
const logger = require('nodus-framework').logging.createLogger();

class Service extends Component {
    constructor(args, options) {
        super(args, options);

        this.isStarted = false;
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
        if (this.isStarted) {
            logger.warn('SERVICE_STOPPED', {service: this.name});
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