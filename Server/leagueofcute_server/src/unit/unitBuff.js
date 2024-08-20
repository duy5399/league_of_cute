const server = require("../../server");
const { AnimStatus, BuffRemoveType } = require("../enum/enum");

class UnitBuff{
    constructor(parent){
        this.parent = parent;
        this.buffLst = {};
    }

    //Thêm buff vào danh sách
    addBuff(buff)
    {
        if(!this.buffLst.hasOwnProperty(buff.buffInfo.buffId)){
            this.buffLst[buff.buffInfo.buffId] = [];
        }
        this.buffLst[buff.buffInfo.buffId].push(buff);
        server.socketIO.in(this.parent.state.roomId).emit('add_buff', JSON.stringify(this.parent.state.toJSON()), JSON.stringify(buff.buffInfo));
    }

    //Xóa buff khỏi danh sách
    removeBuff(buff){
        if(!this.buffLst.hasOwnProperty(buff.buffInfo.buffId)){
            return;
        }
        //TH xóa hết các buff (3 stack => 0 stack)
        if(buff.buffInfo.buffRemoveType == BuffRemoveType.All){
            this.buffLst[buff.buffInfo.buffId] = this.buffLst[buff.buffInfo.buffId].filter(x => x !== buff);
            //server.socketIO.in(this.parent.state.roomId).emit('destroy_buff', JSON.stringify(this.parent.state.toJSON(), JSON.stringify(buff.buffInfo)));
        }
        //TH xóa từ lớp buff (giảm dần 3 stack => 2 stack => 1 stack)
        else{
            //Xóa lớp buff đầu tiên
            let shift = this.buffLst[buff.buffInfo.buffId][0];
            this.buffLst[buff.buffInfo.buffId] = this.buffLst[buff.buffInfo.buffId].filter(x => x !== shift);          
            //Cập nhật lại thời gian cho các buff còn lại
            for(let i = 0; i < this.buffLst[buff.buffInfo.buffId].length; i++){
                clearTimeout(this.buffLst[buff.buffInfo.buffId][i].timeoutId);
                this.buffLst[buff.buffInfo.buffId][i].onStart();
            }
            //server.socketIO.in(this.parent.state.roomId).emit('remove_buff', JSON.stringify(this.parent.state.toJSON(), JSON.stringify(buff.buffInfo)));
        }
        if(this.buffLst[buff.buffInfo.buffId].length === 0){
            delete this.buffLst[buff.buffInfo.buffId];
        }
    }

    //Kiểm tra xem có buff này hay chưa
    hasBuff(buffId)
	{
		return this.buffLst.hasOwnProperty(buffId) && this.buffLst[buffId].length > 0;
	}

    //Lấy danh sách thông tin của buff
    getBuffs(buffId)
	{
		return this.buffLst.hasOwnProperty(buffId) ? this.buffLst[buffId] : [];
	}

    //Lấy thông tin tất cả các buff hiện có
    getAllBuffs()
	{
        let allBuffs = [];
		for (const [key, value] of Object.entries(this.buffLst)) {
            //allBuffs = [...value];
            allBuffs = allBuffs.concat(value);
        }
        return allBuffs;
	}

    //Dừng và xóa tất cả các buff
    removeAllBuffs()
    {
        this.getAllBuffs().forEach((x) => {
            if(x.buffInfo.hasOwnProperty('removeWhenEndBattle') && x.buffInfo.removeWhenEndBattle){
                x.onStop();
            }
        });
    }

    //Dừng và xóa tất cả các buff
    destoryAllBuffs()
    {
        this.getAllBuffs().forEach((x) => {
            x.onStop();
        });
        for (const [key, value] of Object.entries(this.buffLst)) {
        }
        //this.buffLst = {};
    }

    //Khi bắt đầu trận chiến
	onStartBattle()
	{
        this.getAllBuffs().forEach((x) => {
            x.onStartBattle();
        });
	}

    //Khi sử dụng thành công đánh thường
	onNormalAttack(skill, target)
	{
        this.getAllBuffs().forEach((x) => {
            x.onNormalAttack(skill, target);
        });
	}

     //Khi sử dụng thành công kỹ năng
    onAbility(skill, target)
	{
        this.getAllBuffs().forEach((x) => {
            x.onAbility(skill, target);
        });
	}

    //Khi gây ST cho đơn vị khác
	onHit(target, skill, damage, isCritical)
	{
		this.getAllBuffs().forEach((x) => {
            x.onHit(target, skill, damage, isCritical);
        });
	}

    //Khi gây ST từ đánh thường lên đơn vị khác
	onNormalAttackTarget(target, skill, damage, isCritical)
	{
        this.getAllBuffs().forEach((x) => {
            x.onNormalAttackTarget(target, skill, damage, isCritical);
        });
	}

    //Khi gây ST từ kỹ năng lên đơn vị khác
	onAbilityTarget(caster, skill, damage, isCritical)
	{
        this.getAllBuffs().forEach((x) => {
            x.onAbilityTarget(caster, skill, damage, isCritical);
        });
	}

    //Khi nhận ST từ đơn vị khác
    onBeHitted(caster, skill, damage, isCritical)
	{
		this.getAllBuffs().forEach((x) => {
            x.onBeHitted(caster, skill, damage, isCritical);
        });
	}

    //Khi nhận ST từ đánh thường
	onBeHittedByNormalAttack(caster, damageInfo, damage, isCritical)
	{
        this.getAllBuffs().forEach((x) => {
            x.onBeHittedByNormalAttack(caster, damageInfo, damage, isCritical);
        });
	}

    //Khi nhận ST từ kỹ năng
	onBeHittedByAbility(caster, damageInfo, damage, isCritical)
	{
        this.getAllBuffs().forEach((x) => {
            x.onBeHittedByAbility(caster, damageInfo, damage, isCritical);
        });
	}

    //Trước khi gây ST lên đơn vị khác
    onBeforeDamageOnTarget(target, damage)
	{
        let boostDamage = 0;
		this.getAllBuffs().forEach((x) => {
            boostDamage += x.onBeforeDamageOnTarget(target, damage);
        });
        return damage + boostDamage;
	}

    //Trước khi nhận ST từ đơn vị khác
	onBeforeDamageOnSelf(caster, damageInfo, damage, isCritical)
	{
        let reduceDamage = 0;
		this.getAllBuffs().forEach((x) => {
            reduceDamage += x.onBeforeDamageOnSelf(caster, damageInfo, damage, isCritical);
        });
        return damage - reduceDamage;
	}

    //Trước khi nhận hồi phục HP
	onBeforeHeal(caster, damageInfo, damage, isCritical)
	{
        this.getAllBuffs().forEach((x) => {
            x.onBeforeHeal(caster, damageInfo, damage, isCritical);
        });
	}

    //Khi bị trúng kỹ năng khống chế
	onBeControl(caster, damageInfo, damage, isCritical)
	{
        this.getAllBuffs().forEach((x) => {
            x.onBeControl(caster, damageInfo, damage, isCritical);
        });
	}

    //Trước khi chết: VD kích hoạt giáp thiên thần 
	onBeforeDeath(killer)
	{
		
	}

    //Sau khi chết: VD tạo 1 vụ nổ xung quanh
	onAfterDeath(killer)
	{
		
	}

    //Khi tham gia hạ gục đơn vị khác
	onAssist(skill, target)
	{
        this.getAllBuffs().forEach((x) => {
            x.onAssist(skill, target);
        });
	}

    //Khi hạ gục đơn vị khác
	onKill(skill, target)
	{
        this.getAllBuffs().forEach((x) => {
            x.onKill(skill, target);
        });
	}
}

module.exports = { UnitBuff }