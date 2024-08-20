const server = require("../../server");
const uuid = require('uuid');
const MAX_HP = 20;
const LEVEL = 1;

class Tactician{
    constructor(roomId, tacticianEquip){
        this.roomId = roomId;
        this.networkId = uuid.v4();
        this.tacticianId = tacticianEquip.itemId;
        this.tacticianName = tacticianEquip.name;
        this.tacticianBackground = tacticianEquip.background;
        this.hp = MAX_HP;
        this.maxHP = MAX_HP;
        this.level = LEVEL;
        this.position = [0,0,0];
        this.rotation = [0,0,0,1];
        this.dead = false;
    }

    toJSON(){
        return {
            networkId : this.networkId,
            tacticianId : this.tacticianId,
            tacticianName : this.tacticianName,
            tacticianBackground : this.tacticianBackground,
            hp : this.hp,
            maxHP : this.maxHP,
            level : this.level,
            position : this.position,
            rotation : this.rotation,
            dead : this.dead,
        }
    }
}

module.exports = Tactician