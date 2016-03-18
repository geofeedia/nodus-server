'use strict';

// ** Dependencies
const EventEmitter = require('events');

class Component extends EventEmitter {
    constructor(args, options) {
        super();

        // ** Argument Defaults
        args = args || {};
        options = options || {};

        // ** Required Arguments
        this._id = args.id;
        this._name = args.name;

        this._status = 'created';
    }

    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value.toLowerCase();
        this.emit('status', this._status);
    }

    load() {
        // ** Emit the load event
        this.emit('load');

        // ** Set the status to loaded
        this.status = 'loaded';

        // ** Fire a loaded event
        this.emit('loaded');
    }

    unload() {
        // ** Emit the load event
        this.emit('unload');

        // ** Set the status to loaded
        this.status = 'unloaded';

        // ** Fire a loaded event
        this.emit('unloaded');
    }
}