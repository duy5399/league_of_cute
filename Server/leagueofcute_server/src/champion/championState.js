const server = require("../../server");
const uuid = require('uuid');
const { UnitState } = require("../unit/unitState");
const { UnitStatus, OnArea, UnitTag } = require("../enum/enum");

class ChampionState extends UnitState{
    constructor(roomId, unitInfo, parent){
        super(roomId, unitInfo, parent);
        this.classes = unitInfo.classes;
        this.origins = unitInfo.origins;
        this.buyPrice = unitInfo.buyPrice;
        this.sellPrice = unitInfo.sellPrice[this.level];
        this.tag = UnitTag.Champion;
    }

    toJSON(){     
        return  { ... 
        { 
            classes : this.classes,
            origins : this.origins,
            buyPrice : this.buyPrice,
            sellPrice : this.sellPrice,
        }, ...super.toJSON()};
    }
}

module.exports = { ChampionState };