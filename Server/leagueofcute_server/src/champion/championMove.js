const server = require("../../server");
const uuid = require('uuid');
const { UnitMove } = require("../unit/unitMove");

class ChampionMove extends UnitMove{
    constructor(parent){
        super(parent);
    }

}

module.exports = { ChampionMove };