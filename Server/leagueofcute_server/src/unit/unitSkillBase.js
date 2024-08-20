const server = require("../../server");
const uuid = require('uuid');
const { UnitStatus, CastStatus } = require("../enum/enum");
    
class UnitSkillBase{
    constructor(skill, skillLevel, caster, target) {
        this.skill = skill;
        this.skillLevel = skillLevel;
        this.caster = caster;
        this.target = target;
        this.nowState = CastStatus.None;
        this.nowStateLeftTime = 0;
    }

    async trigger()
    {
        if(!this.skill || this.skillLevel === 0 || !this.caster || this.target){
            return;
        }
        // if (base.info.category != ChInfo._Categories.Structure && target != null)
        // {
        // 	base.me.transform.LookAt(SpaceTools.PosOnGround(target.position, base.me.transform.position.y));
        // }
        // if (component && component.info && component.info.role != base.info.role)
        // {
        // 	socket.data.currentState.lastHeatTime = Time.time;
        // }
        // if (!this.skill.can_move_when_casting)
        // {
        // 	//socket.data.moveState.State = MoveState._State.StandStill;
        // 	socket.data.moveState.locked = true;
        // }
        this.caster.skill.locked = true;
        this.caster.skill.currentCasting = skill;
        await this.changeCastStatus();
    }

    //cast skill chia làm 3 giai đoạn
    //CastHead: bắt đầu -> chuẩn bị tung kỹ năng
    //Casting: tung kỹ năng
    //CastBack: thu tay về -> kết thúc
    async changeCastStatus()
    {
        let timeoutID = setTimeout(async () => {
            switch (this.nowState){
                case CastStatus.None:
                    this.nowState = CastStatus.CastHead;
                    this.nowStateLeftTime = this.skill.castHeadTime / this.animSpeed();
                    this.onCastHead();
                    break;
                case CastStatus.CastHead:
                    this.nowState = CastStatus.Casting;
                    this.nowStateLeftTime = this.skill.casting_time / this.animSpeed();
                    await this.onCasting();
                    break;
                case CastStatus.Casting:
                    this.nowState = CastStatus.CastBack;
                    this.nowStateLeftTime = this.skill.cast_back_time / this.animSpeed();
                    //inCD = true;
                    this.onCastBack();
                    break;
                case CastStatus.CastBack:
                    this.nowState = CastStatus.End;
                    this.onCastEnd();
                    break;
            }
            if (this.nowState != CastStatus.End)
            {
                await this.changeCastStatus();
            }
        }, this.nowStateLeftTime);
    }

    //Kích hoạt animantion
    onCastHead()
    {
        //Nếu có hiệu ứng kỹ năng: có đang sử dụng thú cưỡi và tốc độ hoạt ảnh có thay đổi không? => thay đổi hoạt ảnh và tốc độ phát Particle System cho phù hợp
        let animEffects = [];
        if(Array.isArray(this.skill.anim_effect) && this.skill.anim_effect.length > 0){
            animEffects = this.skill.anim_effect;
            if(this.info.mount != ""){
                animEffects = animEffects.filter(x => x.mount == true);
            }
            else{
                animEffects = animEffects.filter(x => x.mount == false);
            }
            for(let i = 0; i < animEffects.length; i++){
                if(this.skill.skill_target_type !== SkillTargetType.Self && this.skill.is_normal_attack !== true){
                    animEffects[i].offset = this.target.info.data_position;
                }
                if(this.skill.scale_animSpeed){
                    animEffects[i].scaleAnimSpeed = true;
                    animEffects[i].animSpeed = this.animSpeed();
                }
            }
        }
        this.animController.triggerAnim(this.skill.skill_animName, this.animSpeed(), true, animEffects);
    }

    //Kích hoạt kỹ năng thành công, tiến hành xử lý kỹ năng
    async onCasting()
    {
        this.currentState.triggerSpDelta(this.skill.skill_info[this.skillLevel].sp_cost);
        //kích hoạt buff (nếu có): sử dụng đòn đánh thường tăng xx% sát thương, sử dụng kỹ năng nhận yy buff,...
        if (this.skill.is_normal_attack)
        {
            this.buff.onNormalAttack(this.skill, this.target)
        }
        else
        {
            this.buff.onAbility(this.skill, this.target);
        }
        await this.triggerSpawn(this.skill, this.skillLevel, this.target);
    }

    onCastBack()
    {
    }

    //Kết thúc kỹ năng, bắt đầu tính Thời gian hồi K/N, reset skill để có thể sử dụng K/N tiếp theo
    onCastEnd(isInterrupt = false){
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
        this.skillController.skillInCD(this.skill.skill_id, this.skill.skill_info[this.skillLevel].cd);
        this.skillController.locked = false;
        this.skillController.currentCasting = null;
        this.nowState = CastStatus.End;
    }

    //Tốc độ hoạt ảnh có thể tăng, giảm nếu scale_animSpeed = true
    animSpeed(){
        // if(this.skill.scale_animSpeed){
        //     return animSpeed;
        // }
        return 1;
    }

    //Xử lý thông tin kỹ năng: gây ST, buff, debuff,...
    async triggerSpawn(skill, level, target){
        //socket.emit('trigger-spawn', skill, target);
        //Vị trí của kỹ năng sau khi thi triển
        const skillPosition = target.info.data_position;
        //Tính toán vị trí kỹ năng, tìm kiếm các đối tượng có thể bị ảnh hưởng bởi kỹ năng, kích hoạt hiệu ứng kỹ năng (gây ST hoặc Buff), tính toán việc lặp lại sau 1 thời gian nhất định (nếu có)
        let count = 0
        let intervalId = setInterval(async ()=>{
            count += 1;
            switch(skill.skill_logic.logic){
                //ST đơn mục tiêu
                case Logic.Single:
                    this.triggerDamage(skill, level, target);
                    this.triggerBuff(skill, level, target);
                    break;
                //ST đa mục tiêu
                case Logic.Range:
                    let getCharacterInRange = [];
                    //Target: Vị trí của kỹ năng thay đổi theo vị trí mục tiêu
                    if(skill.skill_pos === SkillPos.Target){
                        //console.log('skill.skill_pos === SkillPos.Target');
                        getCharacterInRange = await this.getCharacterInRange(skill, target.info.data_position);
                    }
                    //TargetPos: Vị trí kỹ năng cố định từ đầu
                    else if (skill.skill_pos === SkillPos.TargetPos){
                        //console.log('skill.skill_pos === SkillPos.TargetPos');
                        getCharacterInRange = await this.getCharacterInRange(skill, skillPosition);
                    }
                    for(let i = 0; i < getCharacterInRange.length; i++){
                        // ' + getCharacterInRange[i].info.uid);
                        this.triggerDamage(skill, level, getCharacterInRange[i]);
                        this.triggerBuff(skill, level, getCharacterInRange[i]);
                    }
                    break;
            }

            if(count == skill.skill_logic.count){
                clearInterval(intervalId);
            }
        }, skill.skill_logic.interval * 1000);
    }

    triggerDamage(skill, level, target){
        if(target.info.hp <= 0 || target.info.dead){
            return;
        }
        let damage = this.calcBasicDamage(skill, level);
        console.log('calcBasicDamage: ' + damage);
        let isCritical = false;
        const crit = this.info.crit - target.info.anti_crit <= 0 ? 0 : (this.info.crit - target.info.anti_crit);
        if (skill.skill_info[level].damage.canCrit && crit !== 0 && randomDouble(0,1) <= finalCrit)
        {
            isCritical = true;
            damage = this.calcCritDamage(damage);
        }
        console.log('critDamage: ' + damage);
        const my_socket = server.socketIO.sockets.sockets.get(this.socketId)
        if(this.info.category === Category.Player){
            target.currentState.hitDamage(this.currentState, damage, isCritical, skill, level);
        }
        else{
            target.hitDamage(this.currentState, damage, isCritical, skill, level);
        }
    }

    triggerBuff(skill, level, target){
        if(!skill.skill_info[level].hasOwnProperty('buff')){
            return;
        }
        if(this.info.hp <= 0 || this.info.dead){
            return;
        }
        const buffInfo = skill.skill_info[level].buff;
        for(let i = 0; i < buffInfo.length; i++){
            if(randomDouble(0,1) > buffInfo[i].buff_rate){
                continue;
            }
            if(buffInfo[i].buff_on == BuffOn.Caster){
                //console.log('buffInfo.buff_on == BuffOn.Caster');
                this.buff.triggerBuff(this.socket, buffInfo[i]);
            }
            else{
                //console.log('buffInfo.buff_on == BuffOn.target');
                target.buff.triggerBuff(this.socket, buffInfo[i]);
            }
        }

    }

    //Danh sách đối tượng trong phạm vi kỹ năng
    async getCharacterInRange(skill, skillPosition){
        console.log('skillPosition: ' + skillPosition);
        let listOfAllObjInRange = [];
        if(skill.skill_logic.target_type === SkillTargetType.Self){
            listOfAllObjInRange.push(this.obj);
        }
        else if(skill.skill_logic.target_type === SkillTargetType.Ally){
            //Không có nhóm thì return
            if(!this.info.party){
                return listOfAllObjInRange;
            }
            let sockets = await server.socketIO.in(this.info.data_location).fetchSockets();
            let listOfAllParty = await client.json.get('list_of_all_party');
            let myParty = listOfAllParty.find(x => x.partyId == this.info.party);
            //Kiểm tra từng thành viên trong nhóm
            for(let i = 0; i < myParty.member.length; i++){
                if(myParty.member[i] == this.info.uid){
                    continue;
                }
                let ally = sockets.find(x => x.info.uid == myParty.member[i]);
                //Nếu thành viên nhóm không có mặt trên bản đồ này
                if(!ally){
                    continue;
                }
                if(checkObjInRange(ally, skill, skillPosition)){
                    listOfAllObjInRange.push(ally);
                }
            }
        }
        else if(skill.skill_logic.target_type === SkillTargetType.Enemy){
            if(this.info.category === Category.Player){
                let mobs = server.mapController.mapList.find(x => x.map_id == this.info.data_location).monsterList;
                for(let i = 0; i < mobs.length; i++){
                    if(this.checkObjInRange(mobs[i], skill, skillPosition)){
                        listOfAllObjInRange.push(mobs[i]);
                    }
                }
            }

            else if(this.info.category === Category.Mob) {
                let sockets = await server.socketIO.in(this.info.data_location).fetchSockets();
                for(let i = 0; i < sockets.length; i++){
                    if(this.checkObjInRange(sockets[i], skill, skillPosition)){
                        listOfAllObjInRange.push(sockets[i]);
                    }
                }
            }

            // let sockets = await server.socketIO.in(this.info.data_location).fetchSockets();
            // let myParty = {};
            // if(this.info.party){
            //     let listOfAllParty = await client.json.get('list_of_all_party');
            //     myParty = listOfAllParty.find(x => x.partyId == this.info.party);
            // }
            // for(let i = 0; i < sockets.length; i++){
            //     if(sockets[i].info.uid == this.info.uid || (Object.keys(myParty).length !== 0 && myParty.member.includes(sockets[i].info.uid))){
            //         continue;
            //     }
            //     //console.log('this.skill.skill_target_type === SkillTargetType.Enemy: ' + sockets[i].info.nickname);
            //     if(this.checkObjInRange(sockets[i], skill, skillPosition)){
            //         listOfAllObjInRange.push(sockets[i]);
            //     }
            // }
        }
        return listOfAllObjInRange;
    }

    //Kiểm tra vị trí của mục tiêu có trong phạm vi KN hay không
    checkObjInRange(target, skill, pointCheck){
        if(skill.skill_logic.skill_shape_type === SkillShapeType.CircularSector){
            //Nguồn tham khảo: https://www.youtube.com/watch?v=MB7d3MdVHwU
            //transform.foward = quaternionMul(character.rotation, [0,0,1])
            let radius = skill.skill_logic.shape_param[0];
            let degrees = skill.skill_logic.shape_param[1];
            let toTarget = [target.info.data_position[0] - pointCheck[0], 0, target.info.data_position[2] - pointCheck[2]];
            //console.log('pointCheck: ' + pointCheck);
            //console.log('target.info.data_position: ' + target.info.data_position);
            //console.log('toTarget: ' + toTarget);
            if(magnitude(toTarget) <= radius){
                //console.log('normalized(toTarget): ' + normalized(toTarget));
                //console.log('quaternionMul(this.currentState.data_rotation, [0,0,1])): ' + quaternionMul(this.currentState.data_rotation, [0,0,1]));
                //console.log('dot: ' + dot(normalized(toTarget), quaternionMul(this.currentState.data_rotation, [0,0,1])));
                //console.log('Math.cos(degrees * 0.5 * (degrees * Math.PI / 180.0): ' + Math.cos(degrees * 0.5 * (Math.PI / 180.0)));
                if(dot(normalized(toTarget), quaternionMul(this.info.data_rotation, [0,0,1])) > Math.cos(degrees * 0.5 * (Math.PI / 180.0))){
                    return true;
                }
            }
        }
        else if(skill.skill_logic.skill_shape_type === SkillShapeType.Circle){
            let radius = skill.skill_logic.shape_param[0];
            let toTarget = [pointCheck[0] - target.info.data_position[0], 0, pointCheck[2] - target.info.data_position[2]];
            //console.log('checkObjInRange: ' + magnitude(toTarget) + ' ' + radius);
            if(magnitude(toTarget) <= radius){
                return true;
            }
        }
        return false;
    }

    //#region Công thức kỹ năng
    //ST của kỹ năng = ST cơ bản + (Hệ số STVL * STVL) + (Hệ số STPT * STPT)
    calcBasicDamage(skill, level){
        return skill.skill_info[level].damage.raw_damage + (skill.skill_info[level].damage.p_atk_multiplier * this.info.p_atk) + (skill.skill_info[level].damage.m_atk_multiplier * this.info.m_atk);
    };

    //ST khi chí mạng của kỹ năng = ST của kỹ năng * Hệ số Crit Damage
    calcCritDamage(damage){
        return damage * this.info.crit_dmg;
    };
    //#endregion
}

module.exports = { SkillBase }