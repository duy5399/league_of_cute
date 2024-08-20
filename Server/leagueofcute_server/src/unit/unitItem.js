const server = require("../../server");
const { client } = require("../db/init.redis");
const { AnimStatus, BuffRemoveType } = require("../enum/enum");

const MAX_ITEM = 3;

class UnitItem{
    constructor(parent){
        this.parent = parent;
        this.itemLst = [];
    }

    get attackDamage(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('attackDamage') ? this.itemLst[i].itemInfo.itemStats.attackDamage : 0;
        }
        return num; 
    }

    get aspd(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('aspd') ? this.itemLst[i].itemInfo.itemStats.aspd : 0;
        }
        return num; 
    }

    get abilityPower(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('abilityPower') ? this.itemLst[i].itemInfo.itemStats.abilityPower : 0;
        }
        return num; 
    }

    get critRate(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('critRate') ? this.itemLst[i].itemInfo.itemStats.critRate : 0;
        }
        return num; 
    }

    get critDamage(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('critDamage') ? this.itemLst[i].itemInfo.itemStats.critDamage : 0;
        }
        return num; 
    }

    get arPen(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('arPen') ? this.itemLst[i].itemInfo.itemStats.arPen : 0;
        }
        return num; 
    }

    get arPenPer(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('arPenPer') ? this.itemLst[i].itemInfo.itemStats.arPenPer : 0;
        }
        return num; 
    }

    get mrPen(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('mrPen') ? this.itemLst[i].itemInfo.itemStats.mrPen : 0;
        }
        return num; 
    }

    get mrPenPer(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('mrPenPer') ? this.itemLst[i].itemInfo.itemStats.mrPenPer : 0;
        }
        return num; 
    }

    get maxHP(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('maxHP') ? this.itemLst[i].itemInfo.itemStats.maxHP : 0;
        }
        return num; 
    }

    get sp(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('sp') ? this.itemLst[i].itemInfo.itemStats.sp : 0;
        }
        return num; 
    }

    get moveSpd(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('moveSpd') ? this.itemLst[i].itemInfo.itemStats.moveSpd : 0;
        }
        return num; 
    }

    get ar(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('ar') ? this.itemLst[i].itemInfo.itemStats.ar : 0;
        }
        return num; 
    }

    get mr(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('mr') ? this.itemLst[i].itemInfo.itemStats.mr : 0;
        }
        return num; 
    }

    get physicalVamp(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('physicalVamp') ? this.itemLst[i].itemInfo.itemStats.physicalVamp : 0;
        }
        return num; 
    }

    get spellVamp(){ 
        let num = 0;
        for(let i = 0; i < this.itemLst.length; i++){
            num += this.itemLst[i].itemInfo.itemStats.hasOwnProperty('spellVamp') ? this.itemLst[i].itemInfo.itemStats.spellVamp : 0;
        }
        return num; 
    }

    equipItem(item){
        //Nếu không đủ vị trí trống yêu cầu
        if(item.itemInfo.slotRequired > MAX_ITEM - this.itemLst.map(x => x.itemInfo.slotRequired).reduce((a, b) => { return a + b; }, 0)){
            return null;
        }
        //Nếu đã có trang bị cùng loại
        if(item.itemInfo.isUnique && this.itemLst.some(x => x.itemInfo.itemId === item.itemInfo.itemId)){
            return null;
        }
        this.itemLst.push(item);
        item.equipped = this.parent;
        item.onEquip();
        server.socketIO.in(this.parent.state.roomId).emit('equip_item_success', JSON.stringify(this.parent.state.toJSON()), JSON.stringify(item.toJSON()));
        return item;
    }

    unequipItem(item){
        //Nếu không có trang bị
        if(!this.itemLst.find(x => x === item)){
            return;
        }
        item.equipped = null;
        this.itemLst = this.itemLst.filter(x => x !== item);
        server.socketIO.in(this.parent.state.roomId).emit('unequip_item_success', JSON.stringify(this.parent.state.toJSON()), JSON.stringify(item.toJSON()));
        return item;
    }

    active(){
        for(let i = 0; i < this.itemLst.length; i++){
            this.itemLst[i].whenActive();
        }
    }

    inactive(){
        for(let i = 0; i < this.itemLst.length; i++){
            this.itemLst[i].whenInactive();
        }
    }
}

module.exports = { UnitItem }