const server = require("../../server");
const { client } = require("../db/init.redis");
const { TraitId } = require("../enum/enum");
const { randomDouble } = require("../formula/formula");
const { SS_Buff, SS_Mascot, SS_Duelist, SS_Hextech, SS_Yordle, SS_Nightbringer, SS_Dawnbringer, SS_Skirmisher, SS_Brawler } = require("../unit/skillSpawner");

class TraitBase{
    constructor(traitInfo){
        this.traitInfo = traitInfo;
        this.champion = [];
        this.currBreakpoint = 0;
        this.buff = [];
    }

    addTrait(unit){
        if(!unit || this.champion.some(x => x === unit)){
            return;
        }
        this.champion.push(unit);
        //Kiểm tra có bị trùng lặp đơn vị hay không (VD: Arhi + Ahri = 1 mốc, Darius + Darius + Darius = 1 mốc)
        //Nếu không thì tăng mốc kích hoạt
        if(!this.champion.some(x => x !== unit && x.state.unitId === unit.state.unitId)){
            this.currBreakpoint += 1;
            //Nếu có thể kích hoạt mốc mới
            if(this.traitInfo.breakpoint.some(x => x === this.currBreakpoint)){
                this.onChange();
            }
        }
        return true;
    }

    removeTrait(unit){
        if(!unit || !this.champion.some(x => x === unit)){
            return;
        }
        //Kiểm tra có bị trùng lặp đơn vị hay không (VD: Arhi + Ahri = 1 mốc, Darius + Darius + Darius = 1 mốc)
        //Nếu không thì giảm mốc kích hoạt
        if(!this.champion.some(x => x !== unit && x.state.unitId === unit.state.unitId)){
            this.currBreakpoint -= 1;
            //Nếu kích hoạt mốc mới
            if(this.traitInfo.breakpoint.some(x => x === this.currBreakpoint) || this.currBreakpoint < this.traitInfo.breakpoint[0]){
                this.onChange(unit);
            }
        }
        this.champion = this.champion.filter(x => x !== unit);
        return true;
    }

    onChange(unit = null){
        //số lượng đơn vị yêu cầu không đủ mốc => gỡ buff trên tất cả dơn vị nhận buff 
        //Xóa buff hiện có trên đơn vị
        for(let i = 0; i < this.buff.length; i++){
            this.buff[i].onStop();
        }
        this.buff = [];
        if (this.currBreakpoint < this.traitInfo.breakpoint[0])
        {
            return;
        }

        //Lấy thông tin buff mới
        let buff = this.traitInfo.traitBuff[this.currBreakpoint];
        if(!buff){
            return;
        }
        for(let i = 0; i < buff.length; i++){
            for(let j = 0; j < this.champion.length; j++){
                if((unit !== null && this.champion[j] === unit) || this.champion[j].buff.hasBuff(buff[i].buffId)){
                    continue;
                }
                if(randomDouble(0,1) > buff[i].buffRate){
                    continue;
                }
                let spawner = null;
                if(this.traitInfo.traitId === TraitId.Brawler){
                    spawner = new SS_Brawler();
                }
                else if(this.traitInfo.traitId === TraitId.Skirmisher){
                    spawner = new SS_Skirmisher();
                }
                else if(this.traitInfo.traitId === TraitId.Mascot){
                    spawner = new SS_Mascot();
                }
                else if(this.traitInfo.traitId === TraitId.Hextech){
                    spawner = new SS_Hextech();
                }
                else if(this.traitInfo.traitId === TraitId.Yordle){
                    spawner = new SS_Yordle();
                }
                else if(this.traitInfo.traitId === TraitId.Nightbringer){
                    spawner = new SS_Nightbringer();
                }
                else if(this.traitInfo.traitId === TraitId.Dawnbringer){
                    spawner = new SS_Dawnbringer();
                }
                else if(this.traitInfo.traitId === TraitId.Duelist){
                    spawner = new SS_Duelist();
                }
                else{
                    spawner = new SS_Buff();
                }
                spawner.skill = buff[i];
                spawner.caster = this.champion[j];
                spawner.target = this.champion[j];
                spawner.spawnInfo = buff[i];
                spawner.launch();
                this.buff.push(spawner);
            }
        }
    }

    active(){
        for(let i = 0; i < this.buff.length; i++){
            this.buff[i].whenActive();
        }
    }

    inactive(){
        for(let i = 0; i < this.buff.length; i++){
            this.buff[i].whenInactive();
        }
    }
}

module.exports = { TraitBase }