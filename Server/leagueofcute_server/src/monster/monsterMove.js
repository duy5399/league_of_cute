const server = require("../../server");
const uuid = require('uuid');
const { UnitMove } = require("../unit/unitMove");



class MonsterMove extends UnitMove{
    constructor(parent){
        super(parent);
    }

}

module.exports = { MonsterMove };