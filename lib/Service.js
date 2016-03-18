'use strict';

// ** Dependencies
const Component = require('./Component');

class Service extends Component {
    constructor(args, options) {
        super(args, options);

        this.isStarted = false;
    }

    start() {
        if (!this.isLoaded)
            throw errors('NOT_LOADED', 'The service must be loaded before it can be started.');

        if (this.isStarted)
            throw errors('ALREADY_STARTED', 'The service is already started');

        this.emit('start');
        this.isStarted = true;
        this.emit('started');
    }

    stop() {
        if (!this.isStarted)
            throw errors('NOT_STARTED', 'The service is not started.');

        this.emit('stop');
        this.isStarted = false;
        this.emit('stopped');
    }
}

// ** Exports
module.exports = Service;
module.exports.Service = Service;