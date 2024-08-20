const server = require("../../server");
const { UnitAim } = require("../unit/unitAnim");

class MonsterAim extends UnitAim
{
    constructor(parent){
        super(parent);
    }
}

module.exports = { MonsterAim }