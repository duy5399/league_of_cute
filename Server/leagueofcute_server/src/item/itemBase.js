const server = require("../../server");
const { client } = require("../db/init.redis");
const uuid = require('uuid');
const { ItemTag, ItemId, ItemType, UnitStatus } = require("../enum/enum");
const { randomDouble } = require("../formula/formula");
const { SkillSpawner, SS_Buff } = require("../unit/skillSpawner");
const { SS_Giant_Slayer, SS_Bloodthirster, SS_Hextech_Gunblade, SS_Spear_of_Shojin, SS_Steraks_Gage, SS_Titans_Resolve, SS_Last_Whisper, SS_Nashors_Tooth, SS_Gargoyle_Stoneplate, SS_Protectors_Vow, SS_Steadfast_Heart, SS_Ionic_Spark, SS_Archangels_Staff, SS_Blue_Buff, SS_Night_Harvester, SS_Guinsoos_Rageblade, SS_Sword_Breaker, SS_Adaptive_Helm } = require("./itemBuff");

class ItemGold{
    constructor(){
        this.networkId = uuid.v4();
        this.amount = 0;
        this.tag = ItemTag.Gold;
    }
}

class ItemBase{
    constructor(){
        this.networkId = uuid.v4();
        this.itemInfo = null;
        this.equipped = null;
        this.tag = ItemTag.Item;
        this.buff = [];
    }

    onEquip(){
        if(this.itemInfo.itemStats.hasOwnProperty('maxHP')){
            this.equipped.state.hp = this.equipped.state.maxHP;
        }
        if(!this.itemInfo.hasOwnProperty('itemPassive')){
            return;
        }
        for(let i = 0; i < this.itemInfo.itemPassive.length; i++){
            if(randomDouble(0,1) > this.itemInfo.itemPassive[i].buffRate){
                continue;
            }
            let spawner = null;
            if(this.itemInfo.itemId === ItemId.Giant_Slayer){
                spawner = new SS_Giant_Slayer();
            }
            else if(this.itemInfo.itemId === ItemId.Bloodthirster){
                spawner = new SS_Bloodthirster();
            }
            else if(this.itemInfo.itemId === ItemId.Hextech_Gunblade){
                spawner = new SS_Hextech_Gunblade();
            }
            else if(this.itemInfo.itemId === ItemId.Spear_of_Shojin){
                spawner = new SS_Spear_of_Shojin();
            }
            else if(this.itemInfo.itemId === ItemId.Steraks_Gage){
                spawner = new SS_Steraks_Gage();
            }
            else if(this.itemInfo.itemId === ItemId.Titans_Resolve){
                spawner = new SS_Titans_Resolve();
            }
            else if(this.itemInfo.itemId === ItemId.Guinsoos_Rageblade){
                spawner = new SS_Guinsoos_Rageblade();
            }
            else if(this.itemInfo.itemId === ItemId.Sword_Breaker){
                spawner = new SS_Sword_Breaker();
            }
            else if(this.itemInfo.itemId === ItemId.Nashors_Tooth){
                spawner = new SS_Nashors_Tooth();
            }
            else if(this.itemInfo.itemId === ItemId.Last_Whisper){
                spawner = new SS_Last_Whisper();
            }
            else if(this.itemInfo.itemId === ItemId.Gargoyle_Stoneplate){
                spawner = new SS_Gargoyle_Stoneplate();
            }
            else if(this.itemInfo.itemId === ItemId.Protectors_Vow){
                spawner = new SS_Protectors_Vow();
            }
            else if(this.itemInfo.itemId === ItemId.Steadfast_Heart){
                spawner = new SS_Steadfast_Heart();
            }
            else if(this.itemInfo.itemId === ItemId.Ionic_Spark){
                spawner = new SS_Ionic_Spark();
            }
            else if(this.itemInfo.itemId === ItemId.Archangels_Staff){
                spawner = new SS_Archangels_Staff();
            }
            else if(this.itemInfo.itemId === ItemId.Night_Harvester){
                spawner = new SS_Night_Harvester();
            }
            else if(this.itemInfo.itemId === ItemId.Blue_Buff){
                spawner = new SS_Blue_Buff();
            }
            else if(this.itemInfo.itemId === ItemId.Adaptive_Helm){
                spawner = new SS_Adaptive_Helm();
            }
            else{
                spawner = new SS_Buff();
            }
            spawner.caster = this.equipped;
            spawner.target = this.equipped;
            spawner.skill = this.itemInfo.itemPassive[i];
            spawner.spawnInfo = this.itemInfo.itemPassive[i];
            spawner.launch();
            this.buff.push(spawner);
        }
        if(this.equipped.state.status === UnitStatus.Fighting){
            this.whenActive();
        }
    }

    onUnequip(){
        
    }

    whenActive(){
        if(!this.itemInfo.hasOwnProperty('itemActive')){
            return;
        }
        this.activeTimeId = setInterval(() => {
            if(!this.equipped || this.equipped.state.hp < 0 || this.equipped.state.dead){
                this.whenInactive();
            }
            let skillSpawner = new SkillSpawner();
            skillSpawner.caster = this.equipped;
            skillSpawner.skill = this.itemInfo.itemActive;
            skillSpawner.spawnInfo = this.itemInfo.itemActive;
            skillSpawner.spawn();
        }, this.cooldown * 1000);
    }

    whenInactive(){
        clearInterval(this.activeTimeId);
    }

    toJSON(){
        return {
            networkId : this.networkId,
            itemInfo : this.itemInfo,
            tag : this.tag
        }
    }
}

class Item_Zekes_Herald extends ItemBase{
    constructor(){
        super();
    }

    whenActive(){
        if(!this.itemInfo.hasOwnProperty('itemActive')){
            return;
        }
        if(this.equipped.state.hp < 0 || this.equipped.state.dead){
            this.whenInactive();
        }
        let skillSpawner = new SkillSpawner();
        skillSpawner.caster = this.equipped;
        skillSpawner.skill = this.itemInfo.itemActive;
        skillSpawner.spawnInfo = this.itemInfo.itemActive;
        skillSpawner.spawn();
    }

    whenInactive(){
        clearInterval(this.activeTimeId);
    }
}

class Item_SunfireCape extends ItemBase{
    constructor(){
        super();
        this.cooldown = 2;
    }
}

class Item_Dragons_Claw extends ItemBase{
    constructor(){
        super();
        this.cooldown = 2;
    }
}

class Item_Ionic_Spark extends ItemBase{
    constructor(){
        super();
        this.cooldown = 0.2;
    }
}

class Item_Evenshroud extends ItemBase{
    constructor(){
        super();
        this.cooldown = 0.2;
    }
}

class Item_Redemption extends ItemBase{
    constructor(){
        super();
        this.cooldown = 1;
    }
}

class Item_Hand_of_Justice extends ItemBase{
    constructor(){
        super();
    }

    whenActive(){
        if(randomDouble(0,1) <= 0.5){
            let skillSpawner = new SkillSpawner();
            skillSpawner.caster = this.equipped;
            skillSpawner.skill = this.itemInfo.itemActive1;
            skillSpawner.spawnInfo = this.itemInfo.itemActive1;
            skillSpawner.spawn();
        }
        else{
            let skillSpawner = new SkillSpawner();
            skillSpawner.caster = this.equipped;
            skillSpawner.skill = this.itemInfo.itemActive2;
            skillSpawner.spawnInfo = this.itemInfo.itemActive2;
            skillSpawner.spawn();
        }
    }
}

class Item_Thiefs_Gloves extends ItemBase{
    constructor(){
        super();
        this.itemTemp = [];
    }

    async whenActive(){
        let itemDB = await client.json.get('itemDB');
        let itemLst = Object.values(itemDB).filter(x => x.itemType === ItemType.Core && x.itemId !== ItemId.Thiefs_Gloves);
        let randomItemInfo1 = itemLst[Math.floor(Math.random() * itemLst.length)];
        let item1 = null;
        switch(randomItemInfo1.itemId){
            case ItemId.Zekes_Herald:
                item1 = new Item_Zekes_Herald();
                break;
            case ItemId.Sunfire_Cape:
                item1 = new Item_SunfireCape();
                break;
            case ItemId.Dragons_Claw:
                item1 = new Item_Dragons_Claw();
                break;
            case ItemId.Ionic_Spark:
                item1 = new Item_Ionic_Spark();
                break;
            case ItemId.Redemption:
                item1 = new Item_Redemption();
                break;
            case ItemId.Hand_of_Justice:
                item1 = new Item_Hand_of_Justice();
                break;
            default:
                item1 = new ItemBase();
                break;                
        }
        if(!item1){
            return;
        }
        randomItemInfo1.slotRequired = 0;
        item1.itemInfo = randomItemInfo1;
        this.equipped.item.equipItem(item1);

        itemLst = itemLst.filter(x => x.itemId !== randomItemInfo1.itemId);
        let randomItemInfo2 = itemLst[Math.floor(Math.random() * itemLst.length)];
        let item2 = null;
        switch(randomItemInfo2.itemId){
            case ItemId.Sunfire_Cape:
                item2 = new Item_SunfireCape();
                break;
            case ItemId.Dragons_Claw:
                item2 = new Item_Dragons_Claw();
                break;
            case ItemId.Ionic_Spark:
                item2 = new Item_Ionic_Spark();
                break;
            case ItemId.Hand_of_Justice:
                item2 = new Item_Hand_of_Justice();
                break;
            default:
                item2 = new ItemBase();
                break;
        }
        if(!item2){
            return;
        }
        randomItemInfo2.slotRequired = 0;
        item2.itemInfo = randomItemInfo2;
        this.equipped.item.equipItem(item2);
        this.itemTemp.push(item1);
        this.itemTemp.push(item2);
        item1.whenActive();
        item2.whenActive();
    }

    whenInactive(){
        this.itemTemp.forEach(x => {
            this.equipped.item.unequipItem(x);
        })
        this.itemTemp = [];
    }
}

module.exports = { ItemBase, ItemGold, Item_Zekes_Herald, Item_SunfireCape, Item_Dragons_Claw, Item_Ionic_Spark, Item_Hand_of_Justice, Item_Thiefs_Gloves, Item_Evenshroud, Item_Redemption }