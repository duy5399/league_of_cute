const { BuffEventType, DamageType } = require("../enum/enum");
const { SS_Buff, SS_HitDamage } = require("../unit/skillSpawner");

class SS_Deathblade extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Giant_Slayer extends SS_Buff{
    constructor(){
        super();
    }

    onBeforeDamageOnTarget(target, damage){
        if((target.state.hp <= 0 || target.state.dead) || target.state.maxHP < 1750 || !this.buffInfo.buffEventType.includes(BuffEventType.OnBeforeDamageOnTarget)){
            return 0;
        }
        return damage * this.buffInfo.buffEffect.boostPer;
    }
}

class SS_Edge_of_Night extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Bloodthirster extends SS_Buff{
    constructor(){
        super();
    }

    whenActive(){
        this.isActive = false;
    }

    whenInactive(){
        this.isActive = false;
    }

    onBeHitted(caster, damageInfo, damage, isCritical){
        super.onBeHitted(caster, damageInfo, damage, isCritical);
        if((this.caster.state.hp/this.caster.state.maxHP) > 0.4 || this.isActive){
            return;
        }
        this.isActive = true;
        this.active();
    }
}

class SS_Hextech_Gunblade extends SS_Buff{
    constructor(){
        super();
    }

    onHit(target, damageInfo, damage, isCritical){
        super.onHit(target, damageInfo, damage, isCritical);
        let ally = [];
        if(this.caster.state.arena.homeTeamComps.some(x => x.state.networkId === this.caster.state.networkId)){
            ally = this.caster.state.arena.awayTeamComps.filter(x => x.state.networkId !== this.caster.state.networkId && x.state.hp > 0 && !x.state.dead);
        }
        else{
            ally = this.caster.state.arena.homeTeamComps.filter(x => x.state.networkId !== this.caster.state.networkId && x.state.hp > 0 && !x.state.dead);
        }
        let lowestCurrHPAlly = null;
        for(let i = 0; i < ally.length; i++){
            if(!lowestCurrHPAlly && lowestCurrHPAlly.state.hp >= ally[i].state.hp){
                continue;
            }
            lowestCurrHPAlly = ally[i];
        }
        if(!lowestCurrHPAlly){
            return;
        }
        lowestCurrHPAlly.state.triggerHeal(damage * 0.2);
    }
}

class SS_Spear_of_Shojin extends SS_Buff{
    constructor(){
        super();
    }

    onNormalAttack(skill, target)
	{
        this.caster.state.triggerSpDelta(5);
	}
}

class SS_Steraks_Gage extends SS_Buff{
    constructor(){
        super();
    }

    whenActive(){
        this.isActive = false;
    }

    whenInactive(){
        this.isActive = false;
    }

    onBeHitted(caster, damageInfo, damage, isCritical){
        super.onBeHitted(caster, damageInfo, damage, isCritical);
        if((this.caster.state.hp/this.caster.state.maxHP) > 0.6 || this.isActive){
            return;
        }
        this.isActive = true;
        this.active();
    }
}

class SS_Infinity_Edge extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Rapid_Firecannon extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Titans_Resolve extends SS_Buff{
    constructor(){
        super();
        this.maxStackUp = 5;
    }

    whenActive(){
        this.currentStackUp = 0;
    }

    whenInactive(){
        this.currentStackUp = 0;
    }

    onNormalAttack(skill, target)
	{
        if(this.currentStackUp >= this.maxStackUp){
            return;
        }
        this.currentStackUp += 1;
        if(this.buffInfo.buffId === 'titans_resolve_buff_001'){
            this.active();
        }
        if(this.currentStackUp === this.maxStackUp && this.buffInfo.buffId === 'titans_resolve_buff_002'){
            this.active();
        }
	}

	onBeHitted(caster, damageInfo, damage, isCritical)
	{
        if(this.currentStackUp >= this.maxStackUp){
            return;
        }
        this.currentStackUp += 1;
        if(this.buffInfo.buffId === 'titans_resolve_buff_001'){
            this.active();
        }
        if(this.currentStackUp === this.maxStackUp && this.buffInfo.buffId === 'titans_resolve_buff_002'){
            this.active();
        }
	}
}

class SS_Zekes_Herald extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Guinsoos_Rageblade extends SS_Buff{
    constructor(){
        super();
        this.maxStackUp = 30;
    }

    whenActive(){
        this.currentStackUp = 0;
    }

    whenInactive(){
        this.currentStackUp = 0;
    }

    onNormalAttack(skill, target)
	{
        if(this.currentStackUp >= this.maxStackUp){
            return;
        }
        this.currentStackUp += 1;
        this.active();
	}
}

class SS_Sword_Breaker extends SS_Buff{
    constructor(){
        super();
    }

    onNormalAttackTarget(target, skill, damage, isCritical)
	{
        this.target = target;
        this.active();
	}
}

class SS_Nashors_Tooth extends SS_Buff{
    constructor(){
        super();
    }

    onAbility(skill, target)
	{
        this.active();
	}
}

class SS_Last_Whisper extends SS_Buff{
    constructor(){
        super();
    }

    onNormalAttackTarget(target, skill, damage, isCritical)
	{
        this.target = target;
        this.active();
	}
}

class SS_Bramble_Vest extends SS_Buff{
    constructor(){
        super();
    }

    onAbility(skill, target)
	{
        this.active();
	}
}

class SS_Gargoyle_Stoneplate extends SS_Buff{
    constructor(){
        super();
        this.maxStackUp = 10;
    }

    whenActive(){
        this.currentStackUp = 0;
    }

    whenInactive(){
        this.currentStackUp = 0;
    }

    onBeHitted(caster, damageInfo, damage, isCritical)
	{
        if(this.currentStackUp >= this.maxStackUp){
            return;
        }
        this.currentStackUp += 1;
        this.active();
	}
}

class SS_Crownguard extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Protectors_Vow extends SS_Buff{
    constructor(){
        super();
    }

    whenActive(){
        this.isActive = false;
    }

    whenInactive(){
        this.isActive = false;
    }

    onBeHitted(caster, damageInfo, damage, isCritical){
        if((this.caster.state.hp/this.caster.state.maxHP) > 0.4 || this.isActive){
            return;
        }
        this.isActive = true;
        this.active();
    }
}

class SS_Sunfire_Cape extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Steadfast_Heart extends SS_Buff{
    constructor(){
        super();
    }

    whenActive(){
        this.isActive = false;
    }

    whenInactive(){
        this.isActive = false;
    }

    onBeforeDamageOnSelf(caster, damageInfo, damage, isCritical){
        if((this.caster.state.hp/this.caster.state.maxHP) >= 0.5){
            return damage * 0.15;
        }
        return damage * 0.08;
    }
}

class SS_Dragons_Claw extends SS_Buff{
    constructor(){
        super();
    }
}


class SS_Ionic_Spark extends SS_Buff{
    constructor(){
        super();
    }

    onAbility(skill, target)
	{
        let damage = this.caster.state.maxSP * 1.6;
        let damageInfo = {
            isAbility : true,
            damageType : DamageType.AP,
            canCrit: false,
			canLifesteal: false
        }
        this.caster.state.hitDamage(this.caster.state, damage, isCritical, damageInfo);
	}
}

class SS_Adaptive_Helm extends SS_Buff{
    constructor(){
        super();
    }

    whenActive(){
        if(this.caster.state.currTile.x > 1 && this.buffInfo.buffId === 'adaptive_helm_buff_front'){
            this.active();
        }
        else if(this.caster.state.currTile.x < 2 && this.buffInfo.buffId === 'adaptive_helm_buff_back'){
            this.active();
            this.activeTimeId = setInterval(() => {
                if(this.caster.state.hp < 0 || this.caster.state.dead){
                    this.whenInactive();
                }
                this.caster.state.triggerSpDelta(10);
            }, 3000);
        }
    }

    whenInactive(){
        if(this.buffInfo.buffId !== 'adaptive_helm_buff_back'){
            return;
        }
        clearInterval(this.activeTimeId);
    }

    onBeHitted(caster, damageInfo, damage, isCritical){
        if(this.buffInfo.buffId !== 'adaptive_helm_buff_front'){
            return;
        }
        this.caster.state.triggerSpDelta(1);
    }
}

class SS_Evenshroud extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Quicksilver extends SS_Buff{
    constructor(){
        super();
    }
}


class SS_Rabadons_Deathcap extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Archangels_Staff extends SS_Buff{
    constructor(){
        super();
        this.cooldown = 5;
    }

    whenActive(){
        this.activeTimeId = setInterval(() => {
            if(this.caster.state.hp < 0 || this.caster.state.dead){
                this.whenInactive();
            }
            this.active();
        }, this.cooldown * 1000);
    }

    whenInactive(){
        clearInterval(this.activeTimeId);
    }
}

class SS_Night_Harvester extends SS_Buff{
    constructor(){
        super();
    }

    onBeforeDamageOnTarget(target, damage){
        if((target.state.hp <= 0 || target.state.dead) || !this.buffInfo.buffEventType.includes(BuffEventType.OnBeforeDamageOnTarget)){
            return 0;
        }
        if((target.state.hp/target.state.maxHP) > 0.6){
            return damage * 0.12;
        }
        return damage * 0.3;
    }
}

class SS_Jeweled_Gauntlet extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Blue_Buff extends SS_Buff{
    constructor(){
        super();
    }

    onAbility(skill, target)
	{
        this.caster.state.triggerSpDelta(20);
	}
}

class SS_Redemption extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Hand_of_Justice extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Warmogs_Armor extends SS_Buff{
    constructor(){
        super();
    }
}

class SS_Guardbreaker extends SS_Buff{
    constructor(){
        super();
    }

    onHit(target, damageInfo, damage, isCritical){
        if(target.state.shield <= 0){
            return;
        }
        this.active();
    }
}

module.exports = { SS_Giant_Slayer, SS_Bloodthirster, SS_Hextech_Gunblade, SS_Spear_of_Shojin, SS_Steraks_Gage, SS_Titans_Resolve, SS_Guinsoos_Rageblade, 
    SS_Sword_Breaker, SS_Nashors_Tooth, SS_Last_Whisper, SS_Gargoyle_Stoneplate, SS_Protectors_Vow, SS_Steadfast_Heart, SS_Ionic_Spark, SS_Archangels_Staff, SS_Blue_Buff,
    SS_Night_Harvester, SS_Adaptive_Helm
 }