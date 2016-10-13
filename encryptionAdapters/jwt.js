'use strict'

const EncryptionAdapter = require('../lib/EncryptionAdapter');
const jwt = require('jsonwebtoken');
const errors = require('nodus-framework').errors;

class JWT extends EncryptionAdapter{
    constructor(configs){
        super(configs);
        this.privateKey = this.configs.privateKey;
        this.queryStringField = 'jwt';
    }
    _isString(value){
        return typeof value === 'string' || value instanceof String;
    }
    decode(data){
        var decoded;
        try {
            decoded = jwt.verify(data, this.privateKey);
        }
        catch(err){
            console.log(data);
            throw errors(401, 'invalid jwt', err);
        }
        return decoded;
    }
    decodeQueryString(args){
        const value = args[this.queryStringField];
        if (!this._isString(value)){
            throw errors(400, 'invalid jwt format');
        }
        return this.decode(value);
    }
    decodeBody(body){
        if (!this._isString(body)){
            throw errors(400, 'invalid jwt format');
        }
        return this.decode(body);
    }
    encode(response){
        // TODO: DETERMINE WHY THE ENCODED VALUE INCLUDES QUOTES
        return jwt.sign(response, this.privateKey);
    }
}

module.exports = JWT;