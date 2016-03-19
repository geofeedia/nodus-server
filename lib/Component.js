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
    }
}

// ** Exports
module.exports = Component;
module.exports.Component = Component;