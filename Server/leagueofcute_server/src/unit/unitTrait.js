const server = require("../../server");
const { client } = require("../db/init.redis");

class UnitTrait{
    constructor(parent, trait){
        this.parent = parent;
    }

    
}

module.exports = { UnitTrait }