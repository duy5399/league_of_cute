const server = require("../../server");
const uuid = require('uuid');
const { UnitStatus, OnArea, DamageType, ColorStyle, BuffAppendType } = require("../enum/enum");

class UnitState{
    constructor(roomId, unitInfo, parent){
        this.parent = parent;
        this.roomId = roomId;
        this.unitInfo = unitInfo;
        this.networkId = uuid.v4();
        this.arena = null;
        this.currTile = null;
        
        this.buffOnAttackDamage = [];
        this.buffOnAbilityPower = [];
        this.buffOnHP = [];
        this.buffOnMaxHP = [];
        this.buffOnSP = [];
        this.buffOnMaxSP = [];
        this.buffOnAR = [];
        this.buffOnMR = [];
        this.buffOnARPen = [];
        this.buffOnARPenPer = [];
        this.buffOnMRPen = [];
        this.buffOnMRPenPer = [];
        this.buffOnAttackRange = [];
        this.buffOnAspd = [];
        this.buffOnCritRate = [];
        this.buffOnCritDamage  = [];
        this.buffOnShield = [];
        this.buffOnMoveSpd = [];
        this.buffOnHPRegenSpd = [];
        this.buffOnSPRegenSpd = [];
        this.buffOnPhysicalVamp = [];
        this.buffOnSpellVamp = [];
        
        this.unitId = unitInfo.unitId;
        this.unitName = unitInfo.unitName;
        this.tier = unitInfo.tier;
        this.background = unitInfo.background;
        this.level = 0;
        this.attackDamage = unitInfo.attackDamage[this.level];
        this.attackRange = unitInfo.attackRange;
        this.aspd = unitInfo.aspd;
        this.abilityPower = unitInfo.abilityPower;
        this.critRate = unitInfo.critRate;
        this.critDamage = unitInfo.critDamage;
        this.arPen = unitInfo.arPen;
        this.arPenPer = unitInfo.arPenPer;
        this.mrPen = unitInfo.mrPen;
        this.mrPenPer = unitInfo.mrPenPer;
        this.hp = unitInfo.maxHP[this.level];
        this.maxHP = unitInfo.maxHP[this.level];
        this.sp = unitInfo.startSP;
        this.maxSP = unitInfo.maxSP;
        this.moveSpd = unitInfo.moveSpd;
        this.ar = unitInfo.ar;
        this.mr = unitInfo.mr;
        this.hpRegen = unitInfo.hpRegen;
        this.spRegen  = unitInfo.spRegen;
        this.physicalVamp = unitInfo.physicalVamp;
        this.spellVamp = unitInfo.spellVamp;
        this.shield = 0;
        this.dead = false;

        this.status = UnitStatus.Resting;
        this.position = [0,0,0];
        this.rotation = [0,0,0,1];

        this.target = null;

        this.onArea = OnArea.Bench;
        this.boxColSize = unitInfo.boxColSize;
        // this.unselectable = false;

        this.basicAttack = unitInfo.basicAttack;
        this.ability = unitInfo.hasOwnProperty('ability') === true ? unitInfo.ability : null;

        this.buffOnAttackDisable = [];
        this.buffOnSilence = [];
        this.buffOnBlind = [];
        this.buffOnMoveDisable = [];
        this.buffOnDisableRecoverSp = [];

        this.attackDisable = false;
        this.silenced = false;
        this.blinded = false;
        this.moveDisable = false;
        this.recoverSpDisable = false;

        this.buffOnAbilityCanCrit = [];
    }

    get attackDisable(){ return this.buffOnAttackDisable.length > 0 ? true : false; }
    set attackDisable(value){ this._attackDisable = value; }
    
    get silenced(){ return this.buffOnSilence.length > 0 ? true : false; }
    set silenced(value){ this._silenced = value; }

    get blinded(){ return this.buffOnBlind.length > 0 ? true : false; }
    set blinded(value){ this._blinded = value; }

    get moveDisable(){ return this.buffOnMoveDisable.length > 0 ? true : false; }
    set moveDisable(value){ this._moveDisable = value; }

    get recoverSpDisable(){ return this.buffOnDisableRecoverSp.length > 0 ? true : false; }
    set recoverSpDisable(value){ this._recoverSpDisable = value; }

    //return calcBuff(_attack + equipProperty.AD + runeProperty.AD, buffOnAttackDamage);
    get attackDamage(){ 
        try{
            return this.calcBuff(this.unitInfo.attackDamage[this.level] * (1 + this.parent.item.attackDamage) , this.buffOnAttackDamage); 
        }
        catch{
            return this.calcBuff(this.unitInfo.attackDamage[this.level] , this.buffOnAttackDamage); 
        }
    }
    set attackDamage(value){ 
        this._attackDamage = value;
    }

    get attackRange(){ 
        return this.calcBuff(this.unitInfo.attackRange, this.buffOnAttackRange); 
    }
    set attackRange(value){ 
        this._attackRange = value;
    }

    get aspd(){ 
        let num = 0;
        try{
            num = this.calcBuff(this.unitInfo.aspd + this.parent.item.aspd , this.buffOnAspd);
        }
        catch{
            num = this.calcBuff(this.unitInfo.aspd , this.buffOnAspd);
        }
        if(num < 0.2){
            return 0.2;
        }
        else if(num > 5){
            return 5;
        }
        return num; 
    }
    set aspd(value){ 
        if(value < 0.2){
            this._aspd = 0.2;
        }
        else if(value > 5){
            this._aspd = 5;
        }
        else{
            this._aspd = value;
        }
    }

    get abilityPower(){ 
        try{
            return this.calcBuff(this.unitInfo.abilityPower + this.parent.item.abilityPower , this.buffOnAbilityPower); 
        }
        catch{
            return this.calcBuff(this.unitInfo.abilityPower , this.buffOnAbilityPower); 
        }
    }
    set abilityPower(value){ 
        this._abilityPower = value;
    }

    get critRate(){ 
        try{
            return this.calcBuff(this.unitInfo.critRate + this.parent.item.critRate , this.buffOnCritRate); 
        }
        catch{
            return this.calcBuff(this.unitInfo.critRate , this.buffOnCritRate); 
        }
    }
    set critRate(value){ 
        if(value < 0){
            this._critRate = 0;
        }
        else if(value > 1){
            this._critRate = 1;
        }
        else{
            this._critRate = value;
        }
    }

    get critDamage(){ 
        try{
            return this.calcBuff(this.unitInfo.critDamage + this.parent.item.critDamage , this.buffOnCritDamage); 
        }
        catch{
            return this.calcBuff(this.unitInfo.critDamage , this.buffOnCritDamage); 
        } 
    }
    set critDamage(value){ 
        if(value < 1.25){
            this._critDamage = 1.25;
        }
        else{
            this._critDamage = value;
        }
    }

    get arPen(){ 
        try{
            return this.calcBuff(this.unitInfo.arPen + this.parent.item.arPen , this.buffOnARPen); 
        }
        catch{
            return this.calcBuff(this.unitInfo.arPen , this.buffOnARPen); 
        }
    }
    set arPen(value){ 
        if(value < 0){
            this._arPen = 0;
        }
        else{
            this._arPen = value;
        }
    }

    get arPenPer(){ 
        try{
            return this.calcBuff(this.unitInfo.arPenPer + this.parent.item.arPenPer , this.buffOnARPenPer); 
        }
        catch{
            return this.calcBuff(this.unitInfo.arPenPer , this.buffOnARPenPer); 
        }
    }
    set arPenPer(value){ 
        if(value < 0){
            this._arPenPer = 0;
        }
        else{
            this._arPenPer = value;
        }
    }

    get mrPen(){ 
        try{
            return this.calcBuff(this.unitInfo.mrPen + this.parent.item.mrPen , this.buffOnMRPen); 
        }
        catch{
            return this.calcBuff(this.unitInfo.mrPen , this.buffOnMRPen); 
        }
    }
    set mrPen(value){ 
        if(value < 0){
            this._mrPen = 0;
        }
        else{
            this._mrPen = value;
        }
    }

    get mrPenPer(){ 
        try{
            return this.calcBuff(this.unitInfo.mrPenPer + this.parent.item.mrPenPer , this.buffOnMRPenPer); 
        }
        catch{
            return this.calcBuff(this.unitInfo.mrPenPer , this.buffOnMRPenPer); 
        }
    }
    set mrPenPer(value){ 
        if(value < 0){
            this._mrPenPer = 0;
        }
        else{
            this._mrPenPer = value;
        }
    }

    get hp(){ return this._hp; }
    set hp(value){ 
        if(value < 0){
            this._hp = 0;
        }
        else if(value > this.maxHP){
            this._hp = this.maxHP;
        }
        else{
            this._hp = value;
        }
    }

    get maxHP(){ 
        try{
            return this.calcBuff(this.unitInfo.maxHP[this.level] + this.parent.item.maxHP , this.buffOnMaxHP);
        }
        catch{
            return this.calcBuff(this.unitInfo.maxHP[this.level] , this.buffOnMaxHP);
        }
    }
    set maxHP(value){ 
        if(value < 1){
            this._maxHP = 1;
        }
        else{
            this._maxHP = value;
        }
    }

    get sp(){ return this._sp; }
    set sp(value){ 
        if(value < 0){
            this._sp = 0;
        }
        else if(value > this.maxSP){
            this._sp = this.maxSP;
        }
        else{
            this._sp = value;
        }
    }

    get maxSP(){ return this.calcBuff(this.unitInfo.maxSP , this.buffOnMaxSP); }
    set maxSP(value){ 
        if(value < 0){
            this._maxSP = 0;
        }
        else{
            this._maxSP = value;
        }
    }

    get moveSpd(){ 
        try{
            return this.calcBuff(this.unitInfo.moveSpd + this.parent.item.moveSpd , this.buffOnMoveSpd); 
        }
        catch{
            return this.calcBuff(this.unitInfo.moveSpd , this.buffOnMoveSpd); 
        }
    }
    set moveSpd(value){ 
        if(value < 0.5){
            this._moveSpd = 0.5;
        }
        else{
            this._moveSpd = value;
        }
    }

    get ar(){ 
        try{
            return this.calcBuff(this.unitInfo.ar + this.parent.item.ar , this.buffOnAR); 
        }
        catch{
            return this.calcBuff(this.unitInfo.ar , this.buffOnAR); 
        } 
    }
    set ar(value){ 
        this._ar = value;
    }
    
    get mr(){ 
        try{
            return this.calcBuff(this.unitInfo.mr + this.parent.item.mr , this.buffOnMR); 
        }
        catch{
            return this.calcBuff(this.unitInfo.mr , this.buffOnMR); 
        }
    }
    set mr(value){ 
        this._mr = value;
    }

    get physicalVamp(){ 
        try{
            return this.calcBuff(this.unitInfo.physicalVamp + this.parent.item.physicalVamp , this.buffOnPhysicalVamp); 
        }
        catch{
            return this.calcBuff(this.unitInfo.physicalVamp , this.buffOnPhysicalVamp); 
        }
    }
    set physicalVamp(value){ 
        if(value < 0){
            this._physicalVamp = 0;
        }
        else{
            this._physicalVamp = value;
        }
    }

    get spellVamp(){ 
        try{
            return this.calcBuff(this.unitInfo.spellVamp + this.parent.item.spellVamp , this.buffOnSpellVamp); 
        }
        catch{
            return this.calcBuff(this.unitInfo.spellVamp , this.buffOnSpellVamp); 
        }
    }
    set spellVamp(value){ 
        if(value < 0){
            this._spellVamp = 0;
        }
        else{
            this._spellVamp = value;
        }
    }

    get shield(){ return this.calcBuff(0 , this.buffOnShield); }
    set shield(value){ 
        if(value <= 0){
            this._shield = 0;
        }
        else{
            this._shield = value;
        }
    }

    resetState(){
        this.attackDamage = this.attackDamage;
        this.attackRange = this.attackRange;
        this.aspd = this.aspd;
        this.abilityPower = this.abilityPower;
        this.critRate = this.critRate;
        this.critDamage = this.critDamage;
        this.arPen = this.arPen;
        this.arPenPer = this.arPenPer;
        this.mrPen = this.mrPen;
        this.mrPenPer = this.mrPenPer;
        this.maxHP = this.maxHP;
        this.hp = this.maxHP;
        this.maxSP = this.maxSP;
        this.sp = this.unitInfo.startSP;
        this.moveSpd = this.unitInfo.moveSpd;
        this.ar = this.ar;
        this.mr = this.mr;
        this.hpRegen = this.hpRegen;
        this.spRegen  = this.spRegen;
        this.physicalVamp = this.physicalVamp;
        this.spellVamp = this.spellVamp;
        this.shield = 0;
        this.dead = false;

        this.status = UnitStatus.Resting;
        this.target = null;
    }

    //Tính % giá trị buff
    calcBuff(x, buffOn)
    {
        let num = 0;
        let num2 = 1;
        for (let i = 0; i < buffOn.length; i++)
        {
            switch (buffOn[i].appendType)
            {
                case BuffAppendType.Add:
                    num += buffOn[i].amount;
                    break;
                case BuffAppendType.Mult:
                    num2 *= (1 + buffOn[i].amount);
                    break;
            }
        }
        return (x + num) * num2;
    }

    toJSON(){
        return {
            arena : this.arena === null ? 'null' : this.arena.networkId, 
            networkId : this.networkId,
            unitId : this.unitId,
            unitName : this.unitName,
            tier : this.tier,
            background : this.background,
            level : this.level,
            attackRange : this.attackRange,
            aspd : this.aspd,
            arPen : this.arPen,
            arPenPer : this.arPenPer,
            abilityPower : this.abilityPower,
            mrPen : this.mrPen,
            mrPenPer : this.mrPenPer,
            sp : this.sp,
            maxSP : this.maxSP,
            moveSpd : this.moveSpd,
            critRate : this.critRate,
            critDamage : this.critDamage,
            ar : this.ar,
            mr : this.mr,
            hpRegen : this.hpRegen,
            spRegen  : this.spRegen,
            physicalVamp : this.physicalVamp,
            spellVamp : this.spellVamp,
            attackDamage : this.attackDamage,
            hp : this.hp,
            maxHP : this.maxHP,
            shield : this.shield,
            dead : this.dead,
            status : this.status,
            onArea : this.onArea,
            currTileId : this.currTile === null ? null : this.currTile.networkId,
            currTileXY : this.currTile === null ? null : [this.currTile.x, this.currTile.y],
            position : this.position,
            rotation : this.rotation,
            target : this.target !== null ? this.target.state.toJSON : null,
            tag : this.tag,
            ability : this.ability === null ? null : { 
                skillIcon : this.ability.skillIcon,
                skillName : this.ability.skillName,
                skillDescription : this.abilityDescription
            }
        }
    }

    //------------------------
    hitDamage(casterState, damage, isCritical, damageInfo)
	{
        if(this.hp <= 0 || this.dead){
            return;
        }
		let num = damage;
        num = this.calcDefense(casterState, damage, isCritical, damageInfo);
        num = this.parent.buff.onBeforeDamageOnSelf(casterState, damageInfo, num, isCritical);
        //Hồi phục theo % ST gây ta (nếu có)
        if (damageInfo.canLifesteal)
		{
            let lifeSteal = 0;
            if(damageInfo.damageType === DamageType.AD && casterState.physicalVamp > 0){
                lifeSteal = num * casterState.physicalVamp;
            }
			else if(damageInfo.damageType === DamageType.AP && casterState.spellVamp > 0){
                lifeSteal = num * casterState.spellVamp;
            }
            casterState.triggerLifeSteal(lifeSteal);
		}
        //
		num = this.triggerShieldDamage(num);
		if (num > 0)
		{
			this.hp -= num;
		}
		else
		{
			num = 0;
		}
        this.parent.buff.onBeHitted(casterState, damageInfo, damage, isCritical);
        if (damageInfo.isNormalAttack)
        {
            casterState.parent.buff.onNormalAttackTarget(this.parent, damageInfo, damage, isCritical);
            this.parent.buff.onBeHittedByNormalAttack(casterState, damageInfo, damage, isCritical);
        }
        if (damageInfo.isAbility)
        {
            //casterState.parent.buff.onAbilityTarget(damage, isCritical, skill, this);
            this.parent.buff.onBeHittedByAbility(casterState, damageInfo, damage, isCritical);
        }
        let colorStyle = null;
        switch(damageInfo.damageType){
            case DamageType.AD:
                colorStyle = (isCritical === true ? ColorStyle.PhysicalCritDamage : ColorStyle.PhysicalDamage);
                break;
            case DamageType.AP:
                colorStyle = ColorStyle.MagicalDamage;
                break;
            case DamageType.True:
                colorStyle = ColorStyle.TrueDamage
                break;
        }
        server.socketIO.to(this.roomId).emit('play_hp_change', JSON.stringify(this.toJSON()), num, colorStyle);
		if (this.hp <= 0 && !this.dead)
		{
			this.triggerDeath(casterState);
		}
	}

    //Khi HP về 0
    async triggerDeath(killer)
	{
		if (this.dead)
		{
			return;
		}
        
        killer.parent.buff.onKill(this.obj);
        this.dead = true;
        //this.currTile.unit = null;
        this.currTile.walkable = true;
        this.parent.behaviour.stopBT();
		this.parent.skill.interrupt();
        this.parent.buff.removeAllBuffs();
        this.parent.anim.triggerDeath(true);
	}

	//Tính toán ST với PEN của người thi triển và DEF của bản thân
	calcDefense(casterState, damage, isCritical, damageInfo){
        let def = 0;
		let damageReduction = 0;
		//Sát thương vật lý
        if(damageInfo.damageType === DamageType.AD){
            def = (1 - casterState.arPenPer) * this.ar - casterState.arPen;  
        }
		//Sát thương phép
        else if(damageInfo.damageType === DamageType.AP){
            def = (1 - casterState.mrPenPer) * this.mr - casterState.mrPen;
        }
		if(def >= 0){
            damageReduction =  100 / (100 + def);
        }
		else{
			damageReduction = 2 - (100 / (100 - def));
		}
        return damage * damageReduction;
    };

    //Hấp thụ ST bằng giáp ảo (nếu có)
    triggerShieldDamage(damage)
	{
		if (damage <= 0 || this.shield <= 0)
		{
			return damage;
		}
		let num = damage;
		while (this.buffOnShield.length > 0 && num > 0)
		{
			let last = this.buffOnShield[0];
			if (last.amount > num)
			{
				last.amount -= num;
				num = 0;
			}
            //Nếu ST > giá trị lá chắn (500 dmg > 100 shield) => gỡ buff này
			else
			{
				num -= last.amount;
				this.buffOnShield.shift();
			}
		}
        //Nếu ST cuối cùng > 0
		// if (num > 0)
		// {
		// 	if (num > base.currentState.shield)
		// 	{
		// 		base.currentState.shield = 0;
		// 		num -= base.currentState.shield;
		// 	}
		// 	else
		// 	{
		// 		base.currentState.shield -= num;
		// 		num = 0;
		// 	}
		// }
		return num;
	}

    triggerHeal(amount)
	{
        if(this.hp <= 0 || this.dead){
            return;
        }
        this.hp += amount;
        server.socketIO.to(this.roomId).emit('play_hp_change', JSON.stringify(this.toJSON()), amount, ColorStyle.Heal);
	}

    triggerSpDelta(amount)
	{
        if(this.hp <= 0 || this.dead){
            return;
        }
        this.sp += amount;
        server.socketIO.to(this.roomId).emit('trigger_sp_delta', JSON.stringify(this.toJSON()));
	}

    triggerLifeSteal(amount)
	{
        if(this.hp <= 0 || this.hp >= this.maxHP || this.dead || amount <= 0){
            return;
        }
        this.hp += amount;
        server.socketIO.to(this.roomId).emit('play_hp_change', JSON.stringify(this.toJSON()), amount, ColorStyle.Heal);
	}
    
    
    get abilityDescription(){ 
        if(!this.ability){
            return null;
        }
        let description = this.ability.skillDescription;
        let formula = description.split(' ').filter(function (str) { return str.includes('{') || str.includes('}'); })
        for(let i = 0; i < formula.length; i++){
            let temp = formula[i].replace(/{|}/g, '').split('/');
            let property = this.hasKey(this.ability[this.level], temp);
            if(!property){
                continue;
            }
            if (temp[temp.length - 1].includes('heal'))
            {
                let heal = property.buffEffect.hasOwnProperty('heal') ? property.buffEffect.heal : 0;
                let maxHpPer = property.buffEffect.hasOwnProperty('maxHpPer') ? property.buffEffect.maxHpPer : 0;
                let currHpPer = property.buffEffect.hasOwnProperty('currHpPer') ? property.buffEffect.currHpPer : 0;
                let lostHpPer = property.buffEffect.hasOwnProperty('lostHpPer') ? property.buffEffect.lostHpPer : 0;
                let healing =  Math.floor(heal + (this.maxHP * maxHpPer) + (this.hp * currHpPer) + ((this.maxHP - this.hp) * lostHpPer));
                description = description.replace(formula[i], healing.toString());
            }
            if (temp[temp.length - 1].includes('_shield_'))
            {
                let shield = property.buffEffect.hasOwnProperty('shield') ? property.buffEffect.shield : 0;
                let maxHpPer = property.buffEffect.hasOwnProperty('maxHpPer') ? property.buffEffect.maxHpPer : 0;
                let currHpPer = property.buffEffect.hasOwnProperty('currHpPer') ? property.buffEffect.currHpPer : 0;
                let lostHpPer = property.buffEffect.hasOwnProperty('lostHpPer') ? property.buffEffect.lostHpPer : 0;
                let amount =  Math.floor(shield + (this.maxHP * maxHpPer) + (this.hp * currHpPer) + ((this.maxHP - this.hp) * lostHpPer));
                description = description.replace(formula[i], amount.toString());
            }
            switch(temp[temp.length - 1]){
                case 'hitDamage':
                    let rawDamage = property.hasOwnProperty('rawDamage') ? property.rawDamage : 0;
                    let adMultiplier = property.hasOwnProperty('adMultiplier') ? property.adMultiplier : 0;
                    let apMultiplier = property.hasOwnProperty('apMultiplier') ? property.apMultiplier : 0;
                    let damage =  Math.floor(rawDamage + (this.attackDamage * adMultiplier) + (this.abilityPower * apMultiplier));
                    description = description.replace(formula[i], damage.toString());
                    break;
                case 'attackDamagePer':
                case 'aspd':
                case 'critDamage':
                case 'arPer':
                case 'mrPer':
                case 'adMultiplier':
                case 'apMultiplier':
                case 'maxHpPer':
                    let value = Math.abs(property * 100);
                    description = description.replace(formula[i], value.toString() + '%');
                    break;
                case 'rawDamage':
                case 'ar':
                case 'mr':
                case 'critDamage':
                case 'shield':
                case 'maxHitNum':
                case 'bounceTime':
                case 'timeChanneling':
                case 'tickInterval':
                case 'tickTime':
                case 'duration':
                    description = description.replace(formula[i], property.toString());
                    break;
            }
        }
        return description; 
    }

    hasKey(object, property) {
        if (object.hasOwnProperty(property[0])) {
            if(property.length === 1){
                return object[property[0]];
            }
            let newobject = object[property[0]];
            property.shift();
            return this.hasKey(newobject, property);
        }
        for (const [key, value] of Object.entries(object)) {
            if (typeof value !== 'object') {
                continue;
            }
            return this.hasKey(value, property);
        }
    }
}

module.exports = {UnitState};