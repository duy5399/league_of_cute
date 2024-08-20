const server = require("../../server");
const uuid = require('uuid');
const MAX_HP = 20;
const LEVEL = 1;

class TacticianState{
    constructor(parent, roomId, tacticianInfo, nickname){
        this.parent = parent;
        this.networkId = uuid.v4();
        this.roomId = roomId;
        this.tacticianInfo = tacticianInfo;
        this.nickname = nickname;
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
            tacticianInfo : this.tacticianInfo,
            hp : this.hp,
            maxHP : this.maxHP,
            level : this.level,
            position : this.position,
            rotation : this.rotation,
            dead : this.dead,
        }
    }
}

module.exports = TacticianState