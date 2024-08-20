const server = require("../../server");
const { UnitAim } = require("../unit/unitAnim");

class ChampionAim extends UnitAim
{
    constructor(parent){
        super(parent);
    }
}

module.exports = { ChampionAim }