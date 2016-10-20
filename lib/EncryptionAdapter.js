'use strict'

class EncryptionAdapter{
    constructor(configs){
        this.configs = configs || {};
    }
    decode(data){
        return data;
    }
    encode(response){
        return response;
    }
}


module.exports = EncryptionAdapter;