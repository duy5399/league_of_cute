const server = require("../../server");
const uuid = require('uuid');
const { UnitStatus, CastStatus, SkillType, MoveState } = require("../enum/enum");
const { SS_FollowTarget, SkillSpawner } = require("./skillSpawner");
const { lookRotation } = require("../formula/formula");

class UnitSkill{
    constructor(parent){
        this.parent = parent;
        this.locked = false;
        this.currentCasting = null;

        this.castSkillTimeId = null;
        this.nowState = CastStatus.None;
        this.nowStateLeftTime = 0;
    }

    isSkillAvailable(skill)
    {
        //TH: kỹ năng không xác định, unit không đủ sp, kỹ năng đang được thi triển, kỹ năng bị cấm triển khai khi bị câm lặng, unit ở trạng thái không thể tấn công, kỹ năng không thể thi triển khi đang di chuyển
        if (!skill || (skill.hasOwnProperty('sp') && skill.sp < this.parent.state.sp) || skill.isActive || (skill.canBeSilenced && this.parent.state.silenced) || this.parent.state.attackDisable || (!skill.canMoveWhenCast && this.parent.move.moveState === MoveState.MovingToTarget)){
            return false;
        }
        return true;
    }

    resetSkillManager(){
        this.locked = false;
        this.currentCasting = null;
    }

    //------------------------------------------------------------

    async triggerSkill(skill, skillLevel, target)
    {
        // if (this.locked || (this.currentCasting.isNormalAttack && this.parent.state.attackDisable) || (this.currentCasting.canBeSilenced && this.parent.state.silenced))
		// {
		// 	return;
		// }
        if(this.locked || this.currentCasting || !skill || (skillLevel < 0 && skillLevel > 2) || !target){
            return false;
        }
        if(!this.isSkillAvailable(skill)){
            return false;
        }

        this.locked = true;
        this.currentCasting = skill;
        this.nowState = CastStatus.None;
        this.nowStateLeftTime = 0;
        await this.changeCastStatus();
        if (!this.currentCasting.canMoveWhenCast)
        {
        	this.parent.move.locked = true;
            this.parent.move.moveState = MoveState.Standing;
        }
    }

    //cast skill chia làm 3 giai đoạn
    //CastHead: bắt đầu -> chuẩn bị tung kỹ năng
    //Casting: tung kỹ năng
    //CastBack: thu tay về -> kết thúc
    async changeCastStatus()
    {
        this.castSkillTimeId = setTimeout(async () => {
            switch (this.nowState){
                case CastStatus.None:
                    this.nowState = CastStatus.CastHead;
                    this.nowStateLeftTime = this.currentCasting.castHeadTime / this.animSpeed();
                    this.onCastHead();
                    break;
                case CastStatus.CastHead:
                    this.nowState = CastStatus.Casting;
                    this.nowStateLeftTime = this.currentCasting.castingTime / this.animSpeed();
                    await this.onCasting();
                    break;
                case CastStatus.Casting:
                    this.nowState = CastStatus.CastBack;
                    this.nowStateLeftTime = this.currentCasting.castBackTime / this.animSpeed();
                    this.onCastBack();
                    break;
                case CastStatus.CastBack:
                    this.nowState = CastStatus.End;
                    this.onCastEnd();
                    break;
            }
            if (this.nowState !== CastStatus.End)
            {
                await this.changeCastStatus();
            }
        }, this.nowStateLeftTime * 1000);
    }

    //Kích hoạt animantion
    onCastHead()
    {
        //Nếu có hiệu ứng kỹ năng
        let animEffects = [];
        // if(Array.isArray(this.currentCasting.animEffect) && this.currentCasting.animEffect.length > 0){
        //     animEffects = this.currentCasting.animEffect;
        //     for(let i = 0; i < animEffects.length; i++){
        //         if(this.currentCasting.skill_target_type !== SkillTargetType.Self && this.currentCasting.isNormalAttack !== true){
        //             animEffects[i].offset = this.target.info.data_position;
        //         }
        //         if(this.currentCasting.scale_animSpeed){
        //             animEffects[i].scaleAnimSpeed = true;
        //             animEffects[i].animSpeed = this.animSpeed();
        //         }
        //     }
        // }
        let forward = [this.parent.state.target.state.position[0] - this.parent.state.position[0],this.parent.state.target.state.position[1] - this.parent.state.position[1],this.parent.state.target.state.position[2] - this.parent.state.position[2]];
        let rotation = lookRotation(forward);
        if(JSON.stringify(rotation) !== JSON.stringify([0,0,0,0])){
            this.parent.state.rotation = rotation;
            server.socketIO.in(this.parent.state.roomId).emit('unit_move_success', JSON.stringify(this.parent.state.toJSON()));
        }
        this.parent.anim.triggerAnim(this.currentCasting.animName, this.animSpeed(), true, animEffects);
    }

    //Kích hoạt kỹ năng thành công, tiến hành xử lý kỹ năng
    async onCasting()
    {
        //Nếu là đòn tấn công cơ bản => cộng thêm sp và kích hoạt buff (nếu có): sử dụng đòn đánh thường tăng xx% sát thương, sử dụng kỹ năng nhận yy buff,...
        if (this.currentCasting.skillType === SkillType.NormalAttack)
        {
            this.parent.buff.onNormalAttack(this.currentCasting, this.target)
            if(this.parent.state.ability && !this.parent.state.recoverSpDisable){
                this.parent.state.triggerSpDelta(10);
            }
        }
        //Nếu là kỹ năng đặc biệt => trừ sp
        else if (this.currentCasting.skillType === SkillType.Active)
        {
            this.parent.state.triggerSpDelta(-this.parent.state.maxSP);
            this.parent.buff.onAbility(this.currentCasting, this.target);
        }
        await this.triggerSpawn(this.currentCasting, this.skillLevel, this.target);
    }

    onCastBack()
    {
    }

    //Kết thúc kỹ năng, bắt đầu tính Thời gian hồi K/N, reset skill để có thể sử dụng K/N tiếp theo
    onCastEnd(){
        // if (base.moveState)
        // {
        // 	base.moveState.locked = false;
        // }
        // if (base.anim)
        // {
        // 	if (isInterrupt && this.skill.can_interrupt)
        // 		{
        // 			base.anim.TriggerAnimEx("forceIdle", animSpeed);
        // 		}
        // 		else
        // 		{
        // 			base.anim.TriggerIdle();
        // 		}
        // }
        if (this.currentCasting && !this.currentCasting.canMoveWhenCast)
        {
        	this.parent.move.locked = false;
        }
        this.locked = false;
        this.currentCasting = null;
        this.nowState = CastStatus.End;
    }

    //Ngắt việc thi triển kỹ năng
    interrupt(isForce = false)
	{
		switch (this.nowState)
		{
            //Nếu ở đang ở trạng thái chuẩn bị tung kỹ năng
            case CastStatus.CastHead:
                //Kỹ năng không thể ngắt trong giai đoạn này
                if (!this.currentCasting.canInterruptOnHeadTime)
                {
                    return;
                }
                if ((this.currentCasting.skillType === SkillType.NormalAttack || this.currentCasting.skillType === SkillType.Active) && isForce)
                {
                    return;
                }
                break;
            case CastStatus.Casting:
                if (!this.currentCasting.canInterrupt)
                {
                    return;
                }
                break;
		}
		this.onCastEnd();
	}

    //Tốc độ hoạt ảnh có thể tăng, giảm nếu scaleAnimSpeed = true
    animSpeed(){
        if(this.currentCasting.scaleAnimSpeed){
            return this.parent.state.aspd;
        }
        return 1;
    }

    //Xử lý thông tin kỹ năng: gây ST, buff, debuff,...
    async triggerSpawn(skill, level, target){
        //Vị trí của kỹ năng sau khi thi triển
        // const skillPosition = target.info.data_position;
        // //Tính toán vị trí kỹ năng, tìm kiếm các đối tượng có thể bị ảnh hưởng bởi kỹ năng, kích hoạt hiệu ứng kỹ năng (gây ST hoặc Buff), tính toán việc lặp lại sau 1 thời gian nhất định (nếu có)
        // let count = 0
        // let intervalId = setInterval(async ()=>{
        //     count += 1;
        //     switch(skill.skill_logic.logic){
        //         //ST đơn mục tiêu
        //         case Logic.Single:
        //             this.triggerDamage(skill, level, target);
        //             this.triggerBuff(skill, level, target);
        //             break;
        //         //ST đa mục tiêu
        //         case Logic.Range:
        //             let getCharacterInRange = [];
        //             //Target: Vị trí của kỹ năng thay đổi theo vị trí mục tiêu
        //             if(skill.skill_pos === SkillPos.Target){
        //                 //console.log('skill.skill_pos === SkillPos.Target');
        //                 getCharacterInRange = await this.getCharacterInRange(skill, target.info.data_position);
        //             }
        //             //TargetPos: Vị trí kỹ năng cố định từ đầu
        //             else if (skill.skill_pos === SkillPos.TargetPos){
        //                 //console.log('skill.skill_pos === SkillPos.TargetPos');
        //                 getCharacterInRange = await this.getCharacterInRange(skill, skillPosition);
        //             }
        //             for(let i = 0; i < getCharacterInRange.length; i++){
        //                 // ' + getCharacterInRange[i].info.uid);
        //                 this.triggerDamage(skill, level, getCharacterInRange[i]);
        //                 this.triggerBuff(skill, level, getCharacterInRange[i]);
        //             }
        //             break;
        //     }

        //     if(count == skill.skill_logic.count){
        //         clearInterval(intervalId);
        //     }
        // }, skill.skill_logic.interval * 1000);

        let skillSpawner = new SkillSpawner();
        skillSpawner.caster = this.parent;
        skillSpawner.target = this.parent.state.target;
        skillSpawner.skill = this.currentCasting;
        skillSpawner.spawnInfo = this.currentCasting[this.parent.state.level];
        skillSpawner.spawn();
    }
}

module.exports = { UnitSkill };