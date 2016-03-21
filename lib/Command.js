'use strict';

// ** Libraries
const Component = require('./Component');

// ** Platform
const errors = require('nodus-framework').errors;

class Parameter {
    constructor(name, options) {

        this.name = name;
        this.type = options.type;
        this.description = options.description;
        this.required = Boolean(options.required);
    }
}

class Command extends Component {
    constructor(options, provider) {
        super(args);

        this._parameters = {};
    }

    addParameter(name, options) {
        if (this._parameters[name])
            throw errors('PARAMETER_EXISTS', {name: name}, `A parameter named ${name} already exists`);

        const parameter = new Parameter(name, options);
        this._parameters[name] = parameter;

        return parameter;
    }

    parameter(name) {
        return this._parameters[name];
    }
}

module.exports = Command;
module.exports.Command = Command;