const server = require("../../server");
const { UnitBT } = require("../behaviourTree/unitBT");

//Cây hành vi cho các Giai đoạn vòng đấu
class MonsterBT extends UnitBT{
    constructor(parent){
        super(parent);
    }
}

module.exports = { MonsterBT }