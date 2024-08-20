const server = require("../../server");
const uuid = require('uuid');
const { UnitState } = require("../unit/unitState");
const { UnitStatus, OnArea, UnitTag, ItemType } = require("../enum/enum");

class MonsterState extends UnitState{
    constructor(roomId, unitInfo, parent){
        super(roomId, unitInfo, parent);
        this.tag = UnitTag.Monster;
        this.drop = null;
        // this.unselectable = false;
        this.itemInventory = null;
    }

    // toJSON(){     
    //     return  { ... 
    //     { 
    //         drop : this.drop,
    //     }, ...super.toJSON()};
    // }

    //Khi HP về 0
    async triggerDeath(killer)
	{
		super.triggerDeath(killer);
        if(!this.itemInventory){
            return;
        }
        //await this.itemInventory.dropItem(this.toJSON(), this.drop);
	}
}

module.exports = MonsterState;