const server = require("../../server");
const uuid = require('uuid');
const { moveTowards, onTriggerEnter, distance, randomDouble, lookRotation, quaternionMul, distanceTwoNode } = require("../formula/formula");
const { HitOn, BuffMultipleAddType, CrowdControlType, BuffEventType, BuffType, BuffOn, BuffAppendType, TriggerOnHit, SkillPos, SkillTargetType } = require("../enum/enum");

class SkillSpawner{
    constructor(){
		this.networkId = uuid.v4();
		this.caster = null;
        this.target = null;
        this.spawnInfo = null;
        this.skill = null;
		this.isActive = false;
        this.fixedUpdateTimeId = null;
        this.gravity = 9.8;
		this.position = [0,0,0];
		this.rotation = [0,0,0,1];
		this.boxColSize = [1,2,1];
        this.hitted = [];
    }

	spawn()
	{
        if (!this.caster || !this.spawnInfo)
		{
			return;
		}
		if(this.spawnInfo.hasOwnProperty('followTarget')){
            if (!this.target)
            {
                return;
            }
            let spawner = new SS_FollowTarget();
            spawner.caster = this.caster;
            spawner.target = this.target;
            spawner.skill = this.skill;
            spawner.spawnInfo = this.spawnInfo.followTarget;
            spawner.launch();
            //server.socketIO.in(this.caster.state.roomId).emit('spawn_follow_target', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.currentCasting));
        }
        if(this.spawnInfo.hasOwnProperty('flyOutAndBack')){
            let spawner = new SS_FlyOutAndBack();
            spawner.caster = this.caster;
            spawner.target = this.target;
            spawner.skill = this.skill;
            spawner.spawnInfo = this.spawnInfo.flyOutAndBack;
            spawner.launch();
            //server.socketIO.in(this.caster.state.roomId).emit('spawn_follow_target', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.currentCasting));
        }
        if(this.spawnInfo.hasOwnProperty('bounce')){
            if (!this.target)
            {
                return;
            }
            let spawner = new SS_Bounce();
            spawner.caster = this.caster;
            spawner.target = this.target;
            spawner.skill = this.skill;
            spawner.spawnInfo = this.spawnInfo.bounce;
            spawner.launch();
            //server.socketIO.in(this.caster.state.roomId).emit('spawn_follow_target', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.currentCasting));
        }
        if(this.spawnInfo.hasOwnProperty('fixedDirection')){
            let spawner = new SS_FixedDirection();
            spawner.caster = this.caster;
            spawner.target = this.target;
            spawner.skill = this.skill;
            spawner.spawnInfo = this.spawnInfo.fixedDirection;
            spawner.launch();
            //server.socketIO.in(this.caster.state.roomId).emit('spawn_follow_target', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.currentCasting));
        }
        if(this.spawnInfo.hasOwnProperty('fixedDirection_MF')){
            let spawner = new SS_FixedDirectionMF();
            spawner.caster = this.caster;
            spawner.target = this.target;
            spawner.skill = this.skill;
            spawner.spawnInfo = this.spawnInfo.fixedDirection_MF;
            spawner.launch();
            //server.socketIO.in(this.caster.state.roomId).emit('spawn_follow_target', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.currentCasting));
        }
        if(this.spawnInfo.hasOwnProperty('aoe')){
            let spawner = new SS_AoE();
            spawner.caster = this.caster;
            spawner.target = this.target;
            spawner.skill = this.skill;
            spawner.spawnInfo = this.spawnInfo.aoe;
            spawner.launch();
            //server.socketIO.in(this.caster.state.roomId).emit('spawn_follow_target', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.currentCasting));
        }
        if(this.spawnInfo.hasOwnProperty('channelling')){
            let spawner = new SS_Channelling();
            spawner.caster = this.caster;
            spawner.target = this.target;
            spawner.skill = this.skill;
            spawner.spawnInfo = this.spawnInfo.channelling;
            spawner.launch();
            //server.socketIO.in(this.caster.state.roomId).emit('spawn_follow_target', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.currentCasting));
        }
        if(this.spawnInfo.hasOwnProperty('hitDamage')){
            if (!this.target)
            {
                return;
            }
            let spawner = new SS_HitDamage();
            spawner.caster = this.caster;
            spawner.target = this.target;
            spawner.skill = this.skill;
            spawner.spawnInfo = this.spawnInfo.hitDamage;
            spawner.launch();
            //server.socketIO.in(this.caster.state.roomId).emit('spawn_follow_target', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.currentCasting));
        }
        if(this.spawnInfo.hasOwnProperty('buff')){
			let buff = this.spawnInfo.buff;
            for (const [key, value] of Object.entries(buff)) {
                if(randomDouble(0,1) > value.buffRate){
					continue;
				}
                let spawner = new SS_Buff();
                spawner.skill = this.skill;
                spawner.caster = this.caster;
				if(value.buffOn === BuffOn.Caster){
					spawner.target = this.caster;
				}
				else{
					spawner.target = this.target;
				}
                spawner.spawnInfo = value;
                spawner.launch();
            }
            //server.socketIO.in(this.caster.state.roomId).emit('spawn_follow_target', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.currentCasting));
        }
	}

	launch()
	{
		if (!this.caster || !this.target || !this.spawnInfo)
		{
			return;
		}
	}

    hitCollider(){
        let collider1 = null;
        let enemy = [];
        switch (this.spawnInfo.triggerOnHit)
        {
            case TriggerOnHit.HitTarget:
                //Kiểm tra va chạm với mục tiêu
                collider1 = { position : this.position , boxColSize : this.boxColSize };
                let collider2 = { position : this.target.state.position , boxColSize : this.target.state.boxColSize };
                if(onTriggerEnter(collider1, collider2)){
                    this.spawn();
                    this.destorySpawn();
                    return;
                }
                break;
            case TriggerOnHit.FirstCollision:
                collider1 = { position : this.position , boxColSize : this.spawnInfo.boxColSize };
                //Nếu caster này có trong danh sách Chủ nhà => kẻ thù là Đội Khách
                if(this.caster.state.arena.homeTeamComps.some(x => x.state.networkId === this.caster.state.networkId)){
                    enemy = this.caster.state.arena.awayTeamComps.filter(x => x.state.hp > 0 && !x.state.dead);
                }
                //Ngược lại kẻ thù là Chủ nhà
                else{
                    enemy = this.caster.state.arena.homeTeamComps.filter(x => x.state.hp > 0 && !x.state.dead);
                }
                for(let i = 0; i < enemy.length; i++){
                    let collider2 = { position : enemy[i].state.position , boxColSize : enemy[i].state.boxColSize };
                    if(onTriggerEnter(collider1, collider2)){
                        this.spawn();
                        this.destorySpawn();
                        return;
                    }
                }
                break;
            case TriggerOnHit.EveryCollision:
                collider1 = { position : this.position , boxColSize : this.boxColSize };
                //Nếu caster này có trong danh sách Chủ nhà => kẻ thù là Đội Khách
                if(this.caster.state.arena.homeTeamComps.some(x => x.state.networkId === this.caster.state.networkId)){
                    enemy = this.caster.state.arena.awayTeamComps.filter(x => x.state.hp > 0 && !x.state.dead);
                }
                //Ngược lại kẻ thù là Chủ nhà
                else{
                    enemy = this.caster.state.arena.homeTeamComps.filter(x => x.state.hp > 0 && !x.state.dead);
                }
                for(let i = 0; i < enemy.length; i++){
                    if(this.hitted.some(x => x === enemy[i])){
                        continue;
                    }
                    let collider2 = { position : enemy[i].state.position , boxColSize : enemy[i].state.boxColSize };
                    if(onTriggerEnter(collider1, collider2)){
                        this.target = enemy[i];
                        this.spawn();
                        this.hitted.push(enemy[i]);
                    }
                }
                break;
        }
    }

    destorySpawn()
	{
        this.isActive = false;
        this.fixedUpdateTimeId = clearInterval(this.fixedUpdateTimeId);
        server.socketIO.in(this.caster.state.roomId).emit('destory_skill_spawn', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.spawnInfo));
	}
}

class SS_HitDamage extends SkillSpawner{
    constructor(){
        super();
		this.damageInfo = null;
    }

	spawn()
	{
		this.launch();
	}

	launch(){
        super.launch();
		this.triggerDamage();
	}
    
	triggerDamage(){
        if(this.target.state.hp <= 0 || this.target.state.dead){
            return;
        }
        this.damageInfo = this.spawnInfo;
        this.spawnInfo.networkId = this.networkId;
        this.spawnInfo.skillId = this.skill.skillId;
        if(this.skill.isNormalAttack){
            this.damageInfo.isNormalAttack = true;
        }
        else{
            this.damageInfo.isAbility = true;
        }
        //Tính ST kỹ năng
        let damage = this.calcBasicDamage();
        //Kiểm tra kỹ năng có thể chí mạng hay không
        let isCritical = false;
        if(this.skill.isNormalAttack){
            isCritical = this.damageInfo.canCrit;
        }
        else{
            isCritical = this.caster.state.buffOnAbilityCanCrit.length > 0 ? true : this.damageInfo.canCrit;
        }
        if (isCritical && randomDouble(0,1) <= this.caster.state.critRate)
        {
            damage = this.calcCritDamage(damage);
		}
        //boost dmg nếu có buff
        damage = this.caster.buff.onBeforeDamageOnTarget(this.target, damage);
        this.target.state.hitDamage(this.caster.state, damage, isCritical, this.damageInfo);
        server.socketIO.in(this.caster.state.roomId).emit('spawn_hit_damage', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.damageInfo));
        //Kiểm tra kỹ năng có thể gây ST lan
        if(!this.damageInfo.hasOwnProperty('boxColSize') || !this.damageInfo.hasOwnProperty('aoeMultiplier')){
            return;
        }
        let collider1 = { position : this.position , boxColSize : this.damageInfo.boxColSize };
        let enemy = [];
        //Nếu caster này có trong danh sách Chủ nhà => kẻ thù là Đội Khách
        if(this.caster.state.arena.homeTeamComps.some(x => x.state.networkId === this.caster.state.networkId)){
            enemy = this.caster.state.arena.awayTeamComps.filter(x => x.state.hp > 0 && !x.state.dead);
        }
        //Ngược lại kẻ thù là Chủ nhà
        else{
            enemy = this.caster.state.arena.homeTeamComps.filter(x => x.state.hp > 0 && !x.state.dead);
        }
        for(let i = 0; i < enemy.length; i++){
            if(enemy[i] === this.target){
                continue;
            }
            let collider2 = { position : enemy[i].state.position , boxColSize : enemy[i].state.boxColSize };
            if(onTriggerEnter(collider1, collider2)){
                enemy[i].state.hitDamage(this.caster.state, damage * this.damageInfo.aoeMultiplier, isCritical, this.damageInfo);
                server.socketIO.in(this.caster.state.roomId).emit('spawn_hit_damage', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(enemy[i].state.toJSON()), JSON.stringify(this.damageInfo));
            }
        }
    }

    //ST của kỹ năng = ST cơ bản + (Hệ số STVL * STVL) + (Hệ số STPT * STPT)
    calcBasicDamage(){
		const rawDamage = this.damageInfo.hasOwnProperty('rawDamage') ? (this.damageInfo.rawDamage * (this.caster.state.abilityPower/100)) : 0;
		const physicalDamage = this.damageInfo.hasOwnProperty('adMultiplier') ? (this.damageInfo.adMultiplier * this.caster.state.attackDamage) : 0;
		const magicDamage = this.damageInfo.hasOwnProperty('apMultiplier') ? (this.damageInfo.apMultiplier * this.caster.state.abilityPower) : 0;
        const extraMaxHP =  this.damageInfo.hasOwnProperty('maxHpPer') ? (this.damageInfo.maxHpPer * this.target.state.maxHP) : 0;
        return rawDamage + physicalDamage + magicDamage + extraMaxHP;
    };

    //ST khi chí mạng của kỹ năng = ST của kỹ năng * Hệ số Crit Damage
    calcCritDamage(damage){
        return damage * this.caster.state.critDamage;
    };

	toJSON(){
		return {
			networkId : this.networkId,
		}
	}
}

class SS_FollowTarget extends SkillSpawner{
    constructor(){
        super();
    }

    launch(){
        super.launch();
		this.followTarget();
	}

	followTarget()
	{
        this.followTargetInfo = this.spawnInfo;
        this.spawnInfo.networkId = this.networkId;
        this.spawnInfo.skillId = this.skill.skillId;
        this.isActive = true;
        server.socketIO.in(this.caster.state.roomId).emit('spawn_follow_target', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.followTargetInfo));
        this.fixedUpdateTimeId = setInterval(()=>{
            if(!this.isActive || this.target.state.hp < 0 || this.target.state.dead){
				this.fixedUpdateTimeId = clearInterval(this.fixedUpdateTimeId);
				return;
            }
            //Kiểm tra va chạm với mục tiêu
			this.hitCollider();
            //di chuyển tới mục tiêu
			let t = distance(this.position, this.target.state.position) / this.followTargetInfo.speedFly;
            this.position = moveTowards(this.position, this.target.state.position, this.followTargetInfo.speedFly * 0.02);
			let forward = [this.target.state.position[0] - this.position[0], this.target.state.position[1] - this.position[1], this.target.state.position[2] - this.position[2]];
        	this.rotation = lookRotation(forward);
        }, 20);
	}

	toJSON(){
		return {
			networkId : this.networkId,
			followTarget : this.followTargetInfo,
		}
	}
}

class SS_FlyOutAndBack extends SkillSpawner{
    constructor(){
        super();
        this.tempTargetPoint = null;
        this.flyOut = true;
        this.objHitted = [];
    }

    launch(){
        super.launch();
		this.flyOutAndBack();
	}

	flyOutAndBack()
	{
        this.flyOutAndBackInfo = this.spawnInfo;
        this.spawnInfo.networkId = this.networkId;
        this.spawnInfo.skillId = this.skill.skillId;
        this.isActive = true;
        //Tạo điểm quay lại cho kỹ năng
        this.tempTargetPoint = quaternionMul(this.caster.state.rotation, [0,0,1]).map((x) => { 
            return x * this.flyOutAndBackInfo.distance; 
        }).map((x, index) => { 
            return x + this.caster.state.position[index];
        });
        server.socketIO.in(this.caster.state.roomId).emit('spawn_fly_out_and_back', JSON.stringify(this.caster.state.toJSON()), this.tempTargetPoint, JSON.stringify(this.flyOutAndBackInfo));
		this.fixedUpdateTimeId = setInterval(()=>{
            if(!this.isActive){
				this.fixedUpdateTimeId = clearInterval(this.fixedUpdateTimeId);
				return;
            }
           //Nếu quay lại tới người thi triển
            if(!this.flyOut && JSON.stringify(this.position) === JSON.stringify(this.caster.state.position)){
                this.isActive = false;
                this.fixedUpdateTimeId = clearInterval(this.fixedUpdateTimeId);
                return;
            }
            //Nếu đã di chuyển tới điểm quay lại
            if(JSON.stringify(this.position) === JSON.stringify(this.tempTargetPoint))
            {
                this.flyOut = false;
                //Nếu kỹ năng có thể gây ST lần 2 lên tướng đã trúng chiêu
                if(this.flyOutAndBackInfo.hasOwnProperty('canHitTwoTimes') && this.flyOutAndBackInfo.canHitTwoTimes){
                    this.objHitted = [];
                }
            }
            //Nếu kỹ năng bay ra
            if(this.flyOut)
            {
                this.position = moveTowards(this.position,  this.tempTargetPoint, this.flyOutAndBackInfo.speedFly * 0.02);
                let forward = [this.tempTargetPoint[0] - this.position[0],  this.tempTargetPoint[1] - this.position[1],  this.tempTargetPoint[2] - this.position[2]];
                this.rotation = lookRotation(forward);
            }
            //Nếu kỹ năng quay lại
            else
            {
                this.position = moveTowards(this.position, this.caster.state.position, this.flyOutAndBackInfo.speedFly * 0.02);
                let forward = [this.caster.state.position[0] - this.position[0],  this.caster.state.position[1] - this.position[1],  this.caster.state.position[2] - this.position[2]];
                this.rotation = lookRotation(forward);
            }
			this.hitCollider();
        }, 20);
	}

	toJSON(){
		return {
			networkId : this.networkId,
			followTarget : this.skill.followTarget,
		}
	}
}

class SS_FixedDirection extends SkillSpawner{
    constructor(){
        super();
    }

    launch(){
        super.launch();
		this.fixedDirection();
	}

	fixedDirection()
	{
        this.fixedDirectionInfo = this.spawnInfo;
        this.spawnInfo.networkId = this.networkId;
        this.spawnInfo.skillId = this.skill.skillId;
        this.isActive = true;
		//Tạo điểm giới hạn bay
        this.tempTargetPoint = quaternionMul(this.caster.state.rotation, [0,0,1]).map((x) => { 
            return x * this.fixedDirectionInfo.distance; 
        }).map((x, index) => { 
            return x + this.caster.state.position[index];
        });
        server.socketIO.in(this.caster.state.roomId).emit('spawn_fixed_direction', JSON.stringify(this.caster.state.toJSON()), this.tempTargetPoint, JSON.stringify(this.spawnInfo));
		this.fixedUpdateTimeId = setInterval(()=>{
            if(!this.isActive || JSON.stringify(this.position) === JSON.stringify(this.tempTargetPoint)){
				this.fixedUpdateTimeId = clearInterval(this.fixedUpdateTimeId);
				return;
            }
            this.boxColSize = [6,1,1]
            //Kiểm tra va chạm với mục tiêu
			this.hitCollider();
            //di chuyển tới mục tiêu
            this.position = moveTowards(this.position, this.tempTargetPoint, this.fixedDirectionInfo.speedFly * 0.02);
			let forward = [this.tempTargetPoint[0] - this.position[0], this.tempTargetPoint[1] - this.position[1], this.tempTargetPoint[2] - this.position[2]];
        	this.rotation = lookRotation(forward);
        }, 20);
	}

	toJSON(){
		return {
			networkId : this.networkId,
			followTarget : this.skill.followTarget,
		}
	}
}

class SS_FixedDirectionMF extends SS_FixedDirection{
    constructor(){
        super();
    }

    launch(){
        super.launch();
		this.fixedDirection_MF();
	}

	fixedDirection_MF()
	{
        this.fixedDirectionInfo = this.spawnInfo;
        this.spawnInfo.networkId = this.networkId;
        this.spawnInfo.skillId = this.skill.skillId;
        this.isActive = true;
		//Tạo điểm giới hạn bay
        this.tempTargetPoint = quaternionMul(this.caster.state.rotation, [0,0,1]).map((x) => { 
            return x * this.fixedDirectionInfo.distance; 
        }).map((x, index) => { 
            return x + this.caster.state.position[index];
        });
        server.socketIO.in(this.caster.state.roomId).emit('spawn_fixed_direction', JSON.stringify(this.caster.state.toJSON()), this.tempTargetPoint, JSON.stringify(this.spawnInfo));
		this.fixedUpdateTimeId = setInterval(()=>{
            if(!this.isActive || JSON.stringify(this.position) === JSON.stringify(this.tempTargetPoint)){
				this.fixedUpdateTimeId = clearInterval(this.fixedUpdateTimeId);
				return;
            }
            if (this.boxColSize[0] < this.fixedDirectionInfo.boxColSize[0])
            {
                this.boxColSize[0] = this.fixedDirectionInfo.boxColSize[0] * (distance(this.position,this.tempTargetPoint) / this.fixedDirectionInfo.distance);
            }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
            //Kiểm tra va chạm với mục tiêu
			this.hitCollider();
            //di chuyển tới mục tiêu
            this.position = moveTowards(this.position, this.tempTargetPoint, this.fixedDirectionInfo.speedFly * 0.02);
			let forward = [this.tempTargetPoint[0] - this.position[0], this.tempTargetPoint[1] - this.position[1], this.tempTargetPoint[2] - this.position[2]];
        	this.rotation = lookRotation(forward);
        }, 20);
	}
}

class SS_Bounce extends SkillSpawner{
    constructor(){
        super();
        this.bounceTime = 0;
        this.bounceRange = 0;
    }

    launch(){
        super.launch();
		this.bounce();
	}

	bounce()
	{
        this.bounceInfo = this.spawnInfo;
        this.spawnInfo.networkId = this.networkId;
        this.spawnInfo.skillName = this.skill.skillName;
        this.bounceTime = this.spawnInfo.bounceTime[this.caster.state.level];
        this.bounceRange = this.spawnInfo.bounceRange[this.caster.state.level];
        this.isActive = true;
        server.socketIO.in(this.caster.state.roomId).emit('spawn_bounce', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.spawnInfo));
        this.fixedUpdateTimeId = setInterval(()=>{
            if(!this.isActive){
				this.fixedUpdateTimeId = clearInterval(this.fixedUpdateTimeId);
				return;
            }
            //Kiểm tra va chạm với mục tiêu
            let collider1 = { position : this.position , boxColSize : this.boxColSize };
            let collider2 = { position : this.target.state.position , boxColSize : this.target.state.boxColSize };
            if(onTriggerEnter(collider1, collider2)){
                this.spawn();
                this.reselectTarget()
            }
            //di chuyển tới mục tiêu
            this.position = moveTowards(this.position, this.target.state.position, this.bounceInfo.speedFly * 0.02);
			let forward = [this.target.state.position[0] - this.position[0], this.target.state.position[1] - this.position[1], this.target.state.position[2] - this.position[2]];
        	this.rotation = lookRotation(forward);
        }, 20);
	}

    //Tìm kiếm mục tiêu tiếp theo
    reselectTarget()
    {
        let targetNextBounce = null;
        let distanceNextBounce = -1;
        let enemy = [];
        if(this.caster.state.arena.homeTeamComps.some(x => x.state.networkId === this.caster.state.networkId)){
            enemy = this.caster.state.arena.awayTeamComps.filter(x => x.state.hp > 0 && !x.state.dead);
        }
        //Ngược lại kẻ thù là Chủ nhà
        else{
            enemy = this.caster.state.arena.homeTeamComps.filter(x => x.state.hp > 0 && !x.state.dead);
        }
        for(let i = 0; i < enemy.length; i++){
            if(enemy[i] === this.target){
                continue;
            }
            //Ưu tiên đơn vị có khoảng cách gần nhất
            let num = distanceTwoNode([this.target.state.currTile.x, this.target.state.currTile.y], [enemy[i].state.currTile.x, enemy[i].state.currTile.y]);
            if(!targetNextBounce || (num < distanceNextBounce && num <= this.bounceInfo.bounceRange)){
                distanceNextBounce = num;
                targetNextBounce = enemy[i];
            }
        }

        if(!targetNextBounce){
            this.destorySpawn();
        }
        else{
            this.target = targetNextBounce;
            this.bounceTime -= 1;
            server.socketIO.in(this.caster.state.roomId).emit('spawn_rebounce', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.spawnInfo));
        }
    }

	toJSON(){
		return {
			networkId : this.networkId,
			followTarget : this.skill.followTarget,
		}
	}
}

class SS_AoE extends SkillSpawner{
    constructor(){
        super();
    }

    launch(){
        super.launch();
		this.aoe();
	}

	aoe()
	{
        this.aoeInfo = this.spawnInfo;
        this.spawnInfo.networkId = this.networkId;
        this.spawnInfo.skillId = this.skill.skillId;
        let tempTargetPoint = [0,0,0];
        if(this.aoeInfo.aoePos === SkillPos.Self){
            tempTargetPoint = this.caster.state.position;
            this.position = [ this.caster.state.currTile.x, this.caster.state.currTile.y];
        }
        else if(this.aoeInfo.aoePos === SkillPos.Target){
            tempTargetPoint = this.target.state.position;
            this.position = [this.target.state.currTile.x, this.target.state.currTile.y];
        }
        server.socketIO.in(this.caster.state.roomId).emit('spawn_aoe', JSON.stringify(this.caster.state.toJSON()), tempTargetPoint, JSON.stringify(this.spawnInfo));
        this.isActive = true;
        this.hitCollider();
	}

    hitCollider(){
        let unitCollider = [];
        let numCollider = 0;
        if(this.aoeInfo.aoePos === SkillPos.AroundSelf){
            //this.position = this.caster.state.position;
            this.position = [this.caster.state.currTile.x, this.caster.state.currTile.y];
        }
        else if(this.aoeInfo.aoePos === SkillPos.AroundTarget){
            //this.position = this.target.state.position;
            this.position = [this.target.state.currTile.x, this.target.state.currTile.y];
        }
        if(this.skill.targetType === SkillTargetType.Ally){
            unitCollider = this.caster.state.arena.homeTeamComps.some(x => x.state.networkId === this.caster.state.networkId) === true ? this.caster.state.arena.homeTeamComps.filter(x => x.state.hp > 0 && !x.state.dead) : this.caster.state.arena.awayTeamComps.filter(x => x.state.hp > 0 && !x.state.dead);
        }
        else if(this.skill.targetType === SkillTargetType.Ally_No_Me){
            unitCollider = this.caster.state.arena.homeTeamComps.some(x => x.state.networkId === this.caster.state.networkId) === true ? this.caster.state.arena.homeTeamComps.filter(x => x.state.networkId !== this.caster.state.networkId && x.state.hp > 0 && !x.state.dead) : this.caster.state.arena.awayTeamComps.filter(x => x.state.networkId !== this.caster.state.networkId && x.state.hp > 0 && !x.state.dead);
        }
        else if(this.skill.targetType === SkillTargetType.Enemy){
            unitCollider = this.caster.state.arena.homeTeamComps.some(x => x.state.networkId === this.caster.state.networkId) === true ? this.caster.state.arena.awayTeamComps.filter(x => x.state.hp > 0 && !x.state.dead) : this.caster.state.arena.homeTeamComps.filter(x => x.state.hp > 0 && !x.state.dead);
        }
        let tempTarget = this.target;
        for(let i = 0; i < unitCollider.length; i++){
            if(numCollider >= this.aoeInfo.maxHitNum){
                break;
            }
            if(this.aoeInfo.onlyXaxis && unitCollider[i].state.currTile.x !== this.position[0]){
                continue;
            }
            if(distanceTwoNode(this.position, [unitCollider[i].state.currTile.x, unitCollider[i].state.currTile.y]) > this.aoeInfo.aoeRange){
                continue;
            }
            numCollider += 1;
            this.target = unitCollider[i];
            this.spawn();
        }
        this.target = tempTarget;
    }

	toJSON(){
		return {
			networkId : this.networkId,
			followTarget : this.aoeInfo,
		}
	}
}

class SS_Channelling extends SkillSpawner{
    constructor(){
        super();
    }

    launch(){
        super.launch();
		this.channelling();
	}

	channelling()
	{
        this.channellingInfo = this.spawnInfo;
        this.spawnInfo.networkId = this.networkId;
        this.spawnInfo.skillName = this.skill.skillName;
        this.tickTime = 0;
        this.tickInterval = this.spawnInfo.tickInterval;
        this.isActive = true;
        //server.socketIO.in(this.caster.state.roomId).emit('spawn_channelling', JSON.stringify(this.caster.state.toJSON()), JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.spawnInfo));
        server.socketIO.in(this.caster.state.roomId).emit('spawn_channelling', JSON.stringify(this.caster.state.toJSON()),  this.caster.state.position, JSON.stringify(this.spawnInfo));
        this.fixedUpdateTimeId = setInterval(()=>{
            if(!this.isActive || this.tickTime >= this.channellingInfo.tickTime){
				this.fixedUpdateTimeId = clearInterval(this.fixedUpdateTimeId);
				return;
            }
            this.spawn();
            this.tickTime++;
        }, this.tickInterval * 1000);
	}

	toJSON(){
		return {
			networkId : this.networkId,
			followTarget : this.skill.followTarget,
		}
	}
}

class SS_Buff extends SkillSpawner{
    constructor(){
        super();
		this.buffInfo = null;
		this.fixedUpdateTimeId = null;

		//this.maxActivated = 0;
		this.countActivated = 0;
    }

    launch(){
        super.launch();
		this.triggerBuff();
	}
	
	remove(){

	}

	destorySelf(){
		
	}

	triggerBuff(){
		if (this.target.state.hp <= 0 || this.target.state.dead)
		{
			return;
		}
        this.buffInfo = this.spawnInfo;
        this.buffInfo.networkId = this.networkId;
		//Nếu buff có hiệu ứng khống chế và đơn vị miễn với hiệu ứng khống chế
		if (this.buffInfo.hasOwnProperty('controlType') && this.target.state.immuniteControl)
		{
			//TriggerSpawn();
			return;
		}
		//this.target.buff.OnBeControl(this);
		//Nếu đơn vị đã có buff này thì tùy thuộc vào BuffMultipleAddType để xử lý
		if (this.target.buff.hasBuff(this.buffInfo.buffId))
		{
			switch (this.buffInfo.buffMultipleAddType)
			{
				//Xóa hết buff hiện có và ghi nhận buff mới
				case BuffMultipleAddType.Overlay:
					this.target.buff.getBuffs(this.buffInfo.buffId).forEach((x) => {
						x.onStop();
					});
					break;
				//Làm mới thời gian của buff đã có
				case BuffMultipleAddType.ResetTime:
					if (!this.target.buff.hasBuff(this.buffInfo.buffId))
					{
						break;
					}
					this.target.buff.getBuffs(this.buffInfo.buffId).forEach((x) => {
						//x.lifeTimeLeft = this.buffInfo.lifeTime;
                        clearTimeout(x.fixedUpdateTimeId);
                        x.fixedUpdateTimeId = setTimeout(() => {
                            x.onStop();
                        }, this.buffInfo.buffEndCondition.duration * 1000);
					});
//==>>>			    this.controlEffect();
					return;
				//Xếp chồng buff (nếu có thể) VD: Bình máu, E của Gankplank,...
				case BuffMultipleAddType.MultiLayer:
					let buffs = this.target.buff.getBuffs(this.buffInfo.buffId);
					if (buffs.length >= this.buffInfo.buffLimitLayer)
					{
						return;
					}
                    break;
				//Xếp chồng buff (nếu có thể) và làm mới các buff đã có. VD: Passive của Ezreal, Jax, Cuồng Đao,...
				case BuffMultipleAddType.MultiLayerAndRefresh:
				{
					let buffs = this.target.buff.getBuffs(this.buffInfo.buffId);
					for(let i = 0; i < buffs.length; i++){
                        //buffs[i].lifeTimeLeft = this.buffInfo.lifeTime;
                        clearTimeout(buffs[i].fixedUpdateTimeId);
                        buffs[i].fixedUpdateTimeId = setTimeout(() => {
                            buffs[i].onStop();
                        }, this.buffInfo.buffEndCondition.duration * 1000);
                    }
					if (buffs.length >= this.buffInfo.buffLimitLayer)
					{
						return;
					}
					break;
				}
			}
		}
		this.target.buff.addBuff(this);
        if(this.buffInfo.buffEventType.some(x => x === BuffEventType.OnNone)){
            return;
        }
		this.onStart();
		this.onCreate();
        //server.socketIO.in(this.caster.state.roomId).emit('spawn_buff', JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.buffInfo));
    }

	_launch()
	{
		//lifeTimeLeft = lifeTime;
		//this.isActive = true;
		ControlEffect();
		OnLaunch();
		TriggerSpawn();

		
	}

	//Bắt đầu tính thời gian buff có hiệu lực
	onStart(){
		this.whenActive();
        if(!this.buffInfo.buffEndCondition.duration || this.buffInfo.buffEndCondition.duration < 0){
            return;
        }
        this.fixedUpdateTimeId = setTimeout(() => {
            this.onStop();
        }, this.buffInfo.buffEndCondition.duration * 1000);
	}

	//khi buff hết hiệu lực => gỡ buff
    onStop(){
        //TO DO: bổ sung việc dừng hiệu ứng buff (nếu có)
        clearTimeout(this.fixedUpdateTimeId);
        this.whenInactive();
        this.removeCC();
		this.removeAttr();
        this.removeDisableSpRecover();
        this.removeAbilityCanCrit();
        this.target.buff.removeBuff(this);
        //server.socketIO.in(this.caster.state.roomId).emit('destory_skill_spawn', JSON.stringify(this.target.state.toJSON()), JSON.stringify(this.buffInfo));
    }

	//Buộc dừng kỹ năng sẽ hoặc đang thi triển
	interrupterTargetSkill(){
        if (!this.target.skill)
        {
            return;
        }
		this.target.skill.interrupt();
    }

	whenActive(){

	}

	whenInactive(){

	}

	active(){
        if(this.countActivated >= this.buffInfo.buffEndCondition.maxActivated && this.buffInfo.buffEndCondition.maxActivated > 0){
			//TODO: số lần kích hoạt tối đa => xóa buff này
            return;
		}
        if(this.buffInfo.buffType.includes(BuffType.AddStatus)){
            this.controlEffect();
			this.countActivated++;
        }
        if(this.buffInfo.buffType.includes(BuffType.AttrChange)){
            this.attrChange();
			this.countActivated++;
        }
        if(this.buffInfo.buffType.includes(BuffType.AddBuff)){
            this.addBuff();
			this.countActivated++;
        }
        if(this.buffInfo.buffType.includes(BuffType.Heal)){
            this.heal();
            this.countActivated++;
        }
        if(this.buffInfo.buffType.includes(BuffType.DisableSpRecover)){
            this.disableSpRecover();
            this.countActivated++;
        }
        if(this.buffInfo.buffType.includes(BuffType.AbilityCanCrit)){
            this.abilityCanCrit();
            this.countActivated++;
        }
    }

    heal(){
        this.tickInterval = this.buffInfo.buffEndCondition.tickInterval;
        this.tickTime = 0;
        let healIntervalId = setInterval(()=> {
            if (this.tickTime >= this.buffInfo.buffEndCondition.tickTime || this.target.state.hp <= 0 || this.target.state.dead)
            {
                clearInterval(healIntervalId);
                this.target.buff.removeBuff(this);
                return;
            }
            let extraHeal = this.buffInfo.buffEffect.heal ? this.buffInfo.buffEffect.heal : 0;
            let extraMaxHP = this.buffInfo.buffEffect.maxHpPer ? this.target.state.maxHP * this.buffInfo.buffEffect.maxHpPer : 0;
            let extraCurrHP = this.buffInfo.buffEffect.currHpPer ? this.target.state.hp * this.buffInfo.buffEffect.currHpPer : 0;
            let extraLostHP = this.buffInfo.buffEffect.lostHpPer ? (this.target.state.maxHP - this.target.state.hp) * this.buffInfo.buffEffect.lostHpPer : 0;
            let num = extraHeal + extraMaxHP + extraCurrHP + extraLostHP;
            this.target.state.triggerHeal(num);
			this.tickTime++;
        }, this.tickInterval * 1000);
    }

    disableSpRecover(){
        if (!this.target.state || !this.buffInfo.buffEndCondition.duration){
			return;
		}
        this.target.state.buffOnDisableRecoverSp.push(this);
    }

    removeDisableSpRecover(){
        if(!this.buffInfo.buffType.some(x => x === 'DisableSpRecover') ){
            return;
        }
        this.target.state.buffOnDisableRecoverSp = this.target.state.buffOnDisableRecoverSp.filter(x => x !== this);
    }

    abilityCanCrit(){
        if (!this.target.state){
			return;
		}
        this.target.state.buffOnAbilityCanCrit.push(this);
    }

    removeAbilityCanCrit(){
        if(!this.buffInfo.buffType.some(x => x === 'AbilityCanCrit') ){
            return;
        }
        this.target.state.buffOnAbilityCanCrit = this.target.state.buffOnAbilityCanCrit.filter(x => x !== this);
    }

    //Hiệu ứng khống chế
    controlEffect(){
        if (!this.target.state || !this.buffInfo.buffEndCondition.duration){
			return;
		}
        let lifeTime = this.buffInfo.buffEndCondition.duration;
		switch (this.buffInfo.controlType)
		{
			case CrowdControlType.Airborne:
			case CrowdControlType.Stun:
                this.target.state.buffOnAttackDisable.push(this);
                this.target.state.buffOnSilence.push(this);
                this.target.state.buffOnMoveDisable.push(this);
				this.interrupterTargetSkill();
				break;
			case CrowdControlType.Blind:
				this.target.state.buffOnBlind.push(this);
				break;
			case CrowdControlType.Root:
				this.target.state.buffOnMoveDisable.push(this);
				this.interrupterTargetSkill();
				break;
			case CrowdControlType.Silence:
				this.target.state.buffOnSilence.push(this);
				this.interrupterTargetSkill();
				break;
			case CrowdControlType.Slow:
				break;
		}
    }

	

	//Thêm các buff kèm theo. (VD: trong thời gian sở hữu buff này, mỗi đòn đánh thường nhận thêm buff tăng 10% AttackDamage)
	addBuff(){
		if(!this.target.state || !this.buffInfo.buffEffect.hasOwnProperty('addBuff')){
			return;
		}
        for (const [key, value] of Object.entries(this.buffInfo.buffEffect.addBuff)) {
            //this.target.buff.triggerBuff(this.obj, this.buff_effect.addBuff.buffs[i]);
			let buff = new SS_Buff();
			buff.caster = this.caster;
			buff.target = this.target;
			buff.spawnInfo = value;
            buff.launch();
        }
    }

	// //Khởi tạo buff
    // triggerBuff(caster, buffInfo){
    //     let newBuff = new BuffBase(caster, buffInfo);
    //     newBuff.awake(this, this.target.state);
    //     newBuff.initBuff();
    // }

	//Thêm buff chỉ số. (VD: +10% attackDamage, -10% aspd,...)
	attrChange(){
        if(this.buffInfo.buffEffect.hasOwnProperty('attackDamage') && this.buffInfo.buffEffect.attackDamage){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.attackDamage
            }
            this.target.state.buffOnAttackDamage.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('attackDamagePer') && this.buffInfo.buffEffect.attackDamagePer){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Mult,
                amount : this.buffInfo.buffEffect.attackDamagePer
            }
            this.target.state.buffOnAttackDamage.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('attackRange') && this.buffInfo.buffEffect.attackRange){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.attackRange
            }
            this.target.state.buffOnAttackRange.push(stateBuff);
        }
		if(this.buffInfo.buffEffect.hasOwnProperty('aspd') && this.buffInfo.buffEffect.aspd){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Mult,
                amount : this.buffInfo.buffEffect.aspd
            }
            this.target.state.buffOnAspd.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('abilityPower') && this.buffInfo.buffEffect.abilityPower){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.abilityPower
            }
            this.target.state.buffOnAbilityPower.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('abilityPowerPer') && this.buffInfo.buffEffect.abilityPowerPer){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Mult,
                amount : this.buffInfo.buffEffect.abilityPowerPer
            }
            this.target.state.buffOnAbilityPower.push(stateBuff);
        }		
		if(this.buffInfo.buffEffect.hasOwnProperty('critRate') && this.buffInfo.buffEffect.critRate){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.critRate
            }
            this.target.state.buffOnCritRate.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('critDamage') && this.buffInfo.buffEffect.critDamage){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.critDamage
            }
            this.target.state.buffOnCritDamage.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('arPen') && this.buffInfo.buffEffect.arPen){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.arPen
            }
            this.target.state.buffOnARPen.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('arPenPer') && this.buffInfo.buffEffect.arPenPer){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.arPenPer
            }
            this.target.state.buffOnARPenPer.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('mrPen') && this.buffInfo.buffEffect.mrPen){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.mrPen
            }
            this.target.state.buffOnMRPen.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('mrPenPer') && this.buffInfo.buffEffect.mrPenPer){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.mrPenPer
            }
            this.target.state.buffOnMRPenPer.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('maxHP') && this.buffInfo.buffEffect.maxHP){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.maxHP
            }
            this.target.state.buffOnMaxHP.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('maxHPPer') && this.buffInfo.buffEffect.maxHPPer){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Mult,
                amount : this.buffInfo.buffEffect.maxHPPer
            }
            this.target.state.buffOnMaxHP.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('maxSP') && this.buffInfo.buffEffect.maxSP){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.maxSP
            }
            this.target.state.buffOnMaxSP.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('maxSPPer') && this.buffInfo.buffEffect.maxSPPer){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Mult,
                amount : this.buffInfo.buffEffect.maxSPPer
            }
            this.target.state.buffOnMaxSP.push(stateBuff);
        }
		if(this.buffInfo.buffEffect.hasOwnProperty('moveSpd') &&this.buffInfo.buffEffect.moveSpd){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.moveSpd
            }
            this.target.state.buffOnMoveSpd.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('moveSpdPer') && this.buffInfo.buffEffect.moveSpdPer){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Mult,
                amount : this.buffInfo.buffEffect.moveSpdPer
            }
            this.target.state.buffOnMoveSpd.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('ar') && this.buffInfo.buffEffect.ar){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.ar
            }
            this.target.state.buffOnAR.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('arPer') && this.buffInfo.buffEffect.arPer){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Mult,
                amount : this.buffInfo.buffEffect.arPer
            }
            this.target.state.buffOnAR.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('mr') && this.buffInfo.buffEffect.mr){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.mr
            }
            this.target.state.buffOnMR.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('mrPer') && this.buffInfo.buffEffect.mrPer){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Mult,
                amount : this.buffInfo.buffEffect.mrPer
            }
            this.target.state.buffOnMR.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('physicalVamp') && this.buffInfo.buffEffect.physicalVamp){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.physicalVamp
            }
            this.target.state.buffOnPhysicalVamp.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('spellVamp') && this.buffInfo.buffEffect.spellVamp){
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : this.buffInfo.buffEffect.spellVamp
            }
            this.target.state.buffOnSpellVamp.push(stateBuff);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('shield')){
            let extraShield = this.buffInfo.buffEffect.shield ? this.buffInfo.buffEffect.shield : 0;
            let extraMaxHP = this.buffInfo.buffEffect.maxHpPer ? this.target.state.maxHP * this.buffInfo.buffEffect.maxHpPer : 0;
            let extraCurrHP = this.buffInfo.buffEffect.currHpPer ? this.target.state.hp * this.buffInfo.buffEffect.currHpPer : 0;
            let extraLostHP = this.buffInfo.buffEffect.lostHpPer ? (this.target.state.maxHP - this.target.state.hp) * this.buffInfo.buffEffect.lostHpPer : 0;
            let num = extraShield + extraMaxHP + extraCurrHP + extraLostHP;
            let stateBuff = {
                buff : this,
                appendType : BuffAppendType.Add,
                amount : num
            }
            this.target.state.buffOnShield.push(stateBuff);
        }
    }

    removeCC(){
        if(!this.buffInfo.hasOwnProperty('controlType') ){
            return;
        }
        if(this.buffInfo.controlType === CrowdControlType.Airborne || this.buffInfo.controlType === CrowdControlType.Stun){
            this.target.state.buffOnMoveDisable = this.target.state.buffOnMoveDisable.filter(x => x !== this);
            this.target.state.buffOnAttackDisable = this.target.state.buffOnAttackDisable.filter(x => x !== this);
            this.target.state.buffOnSilence = this.target.state.buffOnSilence.filter(x => x !== this);
        }
        if(this.buffInfo.controlType === CrowdControlType.Blind){
            this.target.state.buffOnBlind = this.target.state.buffOnBlind.filter(x => x !== this);
        }
        if(this.buffInfo.controlType === CrowdControlType.Root){
            this.target.state.buffOnMoveDisable = this.target.state.buffOnMoveDisable.filter(x => x !== this);
        }
        if(this.buffInfo.controlType === CrowdControlType.Silence){
            this.target.state.buffOnSilence = this.target.state.buffOnSilence.filter(x => x !== this);
        }
        if(this.buffInfo.controlType === CrowdControlType.Slow){
        }

        // switch (this.buffInfo.controlType)
		// {
		// 	case CrowdControlType.Airborne:
        //     case CrowdControlType.Stun:
		// 		this.target.state.attackDisableTimeLeft = lifeTime;
		// 		this.target.state.silenceTimeLeft = lifeTime;
        //         this.target.state.moveDisableTimeLeft = lifeTime;
        //         this.interrupterTargetSkill();
		// 		break;
		// 	case CrowdControlType.Blind:
		// 		this.target.state.blindTimeLeft = lifeTime;
		// 		break;
		// 	case CrowdControlType.Root:
		// 		this.target.state.moveDisableTimeLeft = lifeTime;
		// 		this.interrupterTargetSkill();
		// 		break;
		// 	case CrowdControlType.Silence:
		// 		this.target.state.silenceTimeLeft = lifeTime;
		// 		this.interrupterTargetSkill();
		// 		break;
		// 	case CrowdControlType.Slow:
		// 		break;
		// }
    }

	//Xóa buff chỉ số
	removeAttr(){
        if(!this.buffInfo.hasOwnProperty('buffEffect')){
            return;
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('attackDamage') && this.buffInfo.buffEffect.attackDamage){
            this.target.state.buffOnAttackDamage = this.target.state.buffOnAttackDamage.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('attackDamagePer') && this.buffInfo.buffEffect.attackDamagePer){
            this.target.state.buffOnAttackDamage = this.target.state.buffOnAttackDamage.filter(x => x.buff !== this);
        }
		if(this.buffInfo.buffEffect.hasOwnProperty('aspd') && this.buffInfo.buffEffect.aspd){
            this.target.state.buffOnAspd = this.target.state.buffOnAspd.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('abilityPower') && this.buffInfo.buffEffect.abilityPower){
            this.target.state.buffOnAbilityPower = this.target.state.buffOnAbilityPower.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('abilityPowerPer') && this.buffInfo.buffEffect.abilityPowerPer){
            this.target.state.buffOnAbilityPower = this.target.state.buffOnAbilityPower.filter(x => x.buff !== this);
        }		
		if(this.buffInfo.buffEffect.hasOwnProperty('critRate') && this.buffInfo.buffEffect.critRate){
			this.target.state.buffOnCritRate = this.target.state.buffOnCritRate.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('critDamage') && this.buffInfo.buffEffect.critDamage){
            this.target.state.buffOnCritDamage = this.target.state.buffOnCritDamage.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('arPen') && this.buffInfo.buffEffect.arPen){
            this.target.state.buffOnARPen = this.target.state.buffOnARPen.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('arPenPer') && this.buffInfo.buffEffect.arPenPer){
            this.target.state.buffOnARPenPer = this.target.state.buffOnARPenPer.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('mrPen') && this.buffInfo.buffEffect.mrPen){
            this.target.state.buffOnMRPen = this.target.state.buffOnMRPen.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('mrPenPer') && this.buffInfo.buffEffect.mrPenPer){
            this.target.state.buffOnMRPenPer = this.target.state.buffOnMRPenPer.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('maxHP') && this.buffInfo.buffEffect.maxHP){
            this.target.state.buffOnMaxHP = this.target.state.buffOnMaxHP.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('maxHPPer') && this.buffInfo.buffEffect.maxHPPer){
            this.target.state.buffOnMaxHP = this.target.state.buffOnMaxHP.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('maxSP') && this.buffInfo.buffEffect.maxSP){
            this.target.state.buffOnMaxSP = this.target.state.buffOnMaxSP.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('maxSPPer') && this.buffInfo.buffEffect.maxSPPer){
            this.target.state.buffOnMaxSP = this.target.state.buffOnMaxSP.filter(x => x.buff !== this);
        }
		if(this.buffInfo.buffEffect.hasOwnProperty('moveSpd') &&this.buffInfo.buffEffect.moveSpd){
            this.target.state.buffOnMoveSpd = this.target.state.buffOnMoveSpd.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('moveSpdPer') && this.buffInfo.buffEffect.moveSpdPer){
            this.target.state.buffOnMoveSpd = this.target.state.buffOnMoveSpd.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('ar') && this.buffInfo.buffEffect.ar){
            this.target.state.buffOnAR = this.target.state.buffOnAR.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('arPer') && this.buffInfo.buffEffect.arPer){
            this.target.state.buffOnAR = this.target.state.buffOnAR.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('mr') && this.buffInfo.buffEffect.mr){
            this.target.state.buffOnMR = this.target.state.buffOnMR.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('mrPer') && this.buffInfo.buffEffect.mrPer){
            this.target.state.buffOnMR = this.target.state.buffOnMR.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('physicalVamp') && this.buffInfo.buffEffect.physicalVamp){
            this.target.state.buffOnPhysicalVamp = this.target.state.buffOnPhysicalVamp.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('spellVamp') && this.buffInfo.buffEffect.spellVamp){
            this.target.state.buffOnSpellVamp = this.target.state.buffOnSpellVamp.filter(x => x.buff !== this);
        }
        if(this.buffInfo.buffEffect.hasOwnProperty('shield') &&this.buffInfo.buffEffect.shield){
            this.target.state.buffOnShield = this.target.state.buffOnShield.filter(x => x.buff !== this);
        }
    }

	//#region Kích hoạt buff khi kích hoạt sự kiện
    onCreate(){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnCreate)){
            return;
        }
        this.active();
    }

    onNormalAttack(skillInfo, target){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnNormalAttack)){
            return;
        }
        this.active();
    }

    onAbility(skillBaseJSON, target){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnAbility)){
            return;
        }
    }

    onHit(target, damageInfo, damage, isCritical){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnHit)){
            return;
        }
    }

    onNormalAttackTarget(target, skill, damage, isCritical){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnNormalAttackTarget)){
            return;
        }
    }
    onAbilityTarget(damage, isCritical, skillBaseJSON, target){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnAbilityTarget)){
            return;
        }
    }
    onBeHitted(caster, damageInfo, damage, isCritical){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnBeHitted)){
            return;
        }
    }
    onBeHittedByNormalAttack(caster, damageInfo, damage, isCritical){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnBeHittedByNormalAttack)){
            return;
        }
    }
    onBeHittedByAbility(caster, damageInfo, damage, isCritical){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnBeHittedByAbility)){
            return;
        }
    }
    onBeforeDamageOnTarget(target, damage){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnBeforeDamageOnTarget)){
            return 0;
        }
        return damage * this.buffInfo.buffEffect.boostPer;
    }
    onBeforeDamageOnSelf(caster, damageInfo, damage, isCritical){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnBeforeDamageOnSelf)){
            return 0;
        }
        return damage * this.buffInfo.buffEffect.reducePer;
    }
    onBeforeHeal(skillBaseJSON, caster){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.onBeforeHeal)){
            return;
        }
    }
    onBeControl(skillBaseJSON, caster){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnBeControl)){
            return;
        }
    }
    onBeforeDeath(){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnBeforeDeath)){
            return;
        }
    }
    onAfterDeath(){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnAfterDeath)){
            return;
        }
    }
    onAssist(target){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnAssist)){
            return;
        }
    }
    onKill(target){
        if(!this.buffInfo.buffEventType.includes(BuffEventType.OnKill)){
            return;
        }
    }
	//#endregion
}

class SS_Brawler extends SS_Buff{
    constructor(){
        super();
    }

    attrChange(){
        super.attrChange();
        this.target.state.hp = this.target.state.maxHP;
    }

    removeAttr(){
        super.removeAttr();
        this.target.state.hp = this.target.state.maxHP;
    }
}

class SS_Skirmisher extends SS_Buff{
    constructor(){
        super();
    }

    whenActive(){
        if(this.buffInfo.buffId === 'skirmisher_buff_001'){
            this.active();
        }
        if(this.buffInfo.buffId === 'skirmisher_buff_002'){
            this.activeTimeId = setInterval(() => {
                this.active();
            }, 1000);
        }
    }

    whenInactive(){
        clearInterval(this.activeTimeId);
    }
}

class SS_Mascot extends SS_Buff{
    constructor(){
        super();
    }

    whenActive(){
        this.activeTimeId = setInterval(() => {
            if(this.caster.state.hp < 0 || this.caster.state.dead){
                this.whenInactive();
            }
            if(this.caster.state.hp < this.caster.state.maxHP){
                let extraHeal = this.buffInfo.buffEffect.heal ? this.buffInfo.buffEffect.heal : 0;
                let extraMaxHP = this.buffInfo.buffEffect.maxHpPer ? this.target.state.maxHP * this.buffInfo.buffEffect.maxHpPer : 0;
                let extraCurrHP = this.buffInfo.buffEffect.currHpPer ? this.target.state.hp * this.buffInfo.buffEffect.currHpPer : 0;
                let extraLostHP = this.buffInfo.buffEffect.lostHpPer ? (this.target.state.maxHP - this.target.state.hp) * this.buffInfo.buffEffect.lostHpPer : 0;
                let num = extraHeal + extraMaxHP + extraCurrHP + extraLostHP;
                this.caster.state.triggerHeal(num);
            }
        }, 2000);
    }

    whenInactive(){
        clearInterval(this.activeTimeId);
    }
}

class SS_Hextech extends SS_Buff{
    constructor(){
        super();
    }

    whenActive(){
        this.activeTimeId = setInterval(() => {
            if(this.caster.state.sp < this.caster.state.maxSP){
                let extraRecoverSP = this.buffInfo.buffEffect.recoverSP ? this.buffInfo.buffEffect.recoverSP : 0;
                let extraMaxSP = this.buffInfo.buffEffect.maxSpPer ? this.target.state.maxSP * this.buffInfo.buffEffect.maxSpPer : 0;
                let extraCurrSP = this.buffInfo.buffEffect.currSpPer ? this.target.state.sp * this.buffInfo.buffEffect.currSpPer : 0;
                let extraLostSP = this.buffInfo.buffEffect.lostSpPer ? (this.target.state.maxSP - this.target.state.sp) * this.buffInfo.buffEffect.lostSpPer : 0;
                let num = extraRecoverSP + extraMaxSP + extraCurrSP + extraLostSP;
                this.caster.state.triggerSpDelta(num);
            }
        }, 2000);
    }

    whenInactive(){
        clearInterval(this.activeTimeId);
    }
}

class SS_Yordle extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Nightbringer extends SS_Buff{
    constructor(){
        super();
    }

    whenActive(){
        this.isActive = false;
    }

    whenInactive(){
        this.isActive = false;
    }

    onBeHittedByNormalAttack(caster, damageInfo, damage, isCritical){
        if((this.caster.state.hp/this.caster.state.maxHP) > 0.5 || this.isActive){
            return;
        }
        this.isActive = true;
        this.active();
    }
}

class SS_Dawnbringer extends SS_Nightbringer{
    constructor(){
        super();
    }
}

class SS_Duelist extends SS_Buff{
    constructor(){
        super();
    }
}

module.exports = { SkillSpawner, SS_HitDamage , SS_FollowTarget, SS_Buff, SS_Brawler, SS_Skirmisher, SS_Mascot, SS_Hextech, SS_Yordle, SS_Nightbringer, SS_Dawnbringer, SS_Duelist }