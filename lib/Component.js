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

        this.isLoaded = false;
    }

    load() {
        // ** Emit the load event
        this.emit('load');

        // ** Set the status to loaded
        this.isLoaded = true;

        // ** Fire a loaded event
        this.emit('loaded');
    }

    unload() {
        // ** Emit the load event
        this.emit('unload');

        // ** Set the status to false
        this.isLoaded = false;

        // ** Fire a loaded event
        this.emit('unloaded');
    }
}

// ** Exports
module.exports = Component;
module.exports.Component = Component;