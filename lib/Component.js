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
        this._description = args.description || '';
    }

    get id () {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    toString() {
        return `[${id}] ${name}`;
    }
}

// ** Exports
module.exports = Component;
module.exports.Component = Component;