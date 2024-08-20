const { x } = require("joi");
const server = require("../../server");
const Arena = require("../arena/arena");
const Battlefield = require("../arena/battlefield");
const Bench = require("../arena/bench");
const { client } = require("../db/init.redis");
const { Phases, UnitStatus, OnArea, TileTag, ItemTag, ItemId, ItemType } = require("../enum/enum");
const { Item_Zekes_Herald, Item_SunfireCape, Item_Dragons_Claw, Item_Ionic_Spark, Item_Evenshroud, Item_Redemption, Item_Hand_of_Justice, Item_Thiefs_Gloves, ItemBase } = require("../item/itemBase");
const { ItemInventory } = require("../item/itemInventory");
const Tactician = require("../tactician/tactician");
const { TacticianAnim } = require("../tactician/tacticianAnim");
const TacticianState = require("../tactician/tacticianState");
const { TraitController } = require("../trait/traitController");

const UnitShop = require("../unitShop/unitShop");

class PlayerController {
    constructor(roomId, player, place) {
        this.roomId = roomId;
        this.socketId = player.socketId;
        this.uid = player.uid;
        this.nickname = player.nickname;
        this.profileImg = player.profileImg;
        this.level = player.level;
        this.rank = player.rank;
        this.points = player.points;
        this.arenaSkinEquip = player.arenaSkinEquip;
        this.boomEquip = player.boomEquip;
        this.connectionState = player.connectionState;
        this.place = place;
        this.arena = new Arena(roomId);
        this.tactician = new Tactician(roomId, player.tacticianEquip);
        this.tactician1 = {};
        this.tactician1.state = new TacticianState(this.tactician1, roomId, player.tacticianEquip, this.nickname);
        this.tactician1.anim = new TacticianAnim(this.tactician1);
        this.bench = new Bench(roomId);
        this.battlefield = new Battlefield(roomId);
        this.unitShop = new UnitShop(roomId, this.bench, this.battlefield);
        this.currPhase = null;
        this.traitController = new TraitController(player.socketId);
        this.itemInventory = new ItemInventory(this.socketId, this.roomId, this.unitShop);
        this.addPoint = 0;
    }

    async getInfo(){
        return {
            uid : this.uid,
            points : this.points,
            rank : this.rank,
            addPoint : this.addPoint
        }
    }

    getFormation(){
        let fomation = [];
        this.battlefield.listTile.forEach(element => {
            if(element.unit === null){
                return;
            }
            fomation.push({
                unitId : element.unit.state.toJSON().unitId,
                level : element.unit.state.level
            })
        });
        return fomation.sort((a, b) => b.level - a.level );
    }

    async equipItem(unitState, itemBase){
        if(!unitState || !itemBase){
            return;
        }
        //Nếu đơn vị trên Hàng chờ
        let unit = null;
        if(unitState.onArea === OnArea.Bench){
            unit = this.bench.listTile.find(x => x.unit !== null && x.unit.state.networkId === unitState.networkId).unit;
        }
        //Nếu đơn vị trên Sân đấu
        else if(unitState.onArea === OnArea.Battlefield){
            unit = this.battlefield.listTile.find(x => x.unit !== null && x.unit.state.networkId === unitState.networkId).unit;
        }
        let item = this.itemInventory.listTile.find(x => x.item !== null && x.item.networkId === itemBase.networkId).item;
        if(!unit || !item){
            return;
        }
        if(await this.upgradeItem(unit, item)){
            this.itemInventory.removeItem(item);
            return;
        }
        let check = unit.item.equipItem(item);
        if(!check){
            return;
        }
        this.itemInventory.removeItem(item);
    }

    async upgradeItem(unit, item){
        if(item.itemInfo.itemType !== ItemType.Component){
            return false;
        }
        let itemComponent = unit.item.itemLst.find(x => x.itemInfo.itemType === ItemType.Component);
        if(!itemComponent){
            return false;
        }
        let itemDB = await client.json.get('itemDB');
        let itemInfo = itemDB[item.itemInfo.combination[itemComponent.itemInfo.itemId]];
        let itemUpgrade = null;
        switch(itemInfo.itemId){
            case ItemId.Zekes_Herald:
                itemUpgrade = new Item_Zekes_Herald();
                break;
            case ItemId.Sunfire_Cape:
                itemUpgrade = new Item_SunfireCape();
                break;
            case ItemId.Dragons_Claw:
                itemUpgrade = new Item_Dragons_Claw();
                break;
            case ItemId.Ionic_Spark:
                itemUpgrade = new Item_Ionic_Spark();
                break;
            case ItemId.Evenshroud:
                itemUpgrade = new Item_Evenshroud();
                break;
            case ItemId.Redemption:
                itemUpgrade = new Item_Redemption();
                break;
            case ItemId.Hand_of_Justice:
                itemUpgrade = new Item_Hand_of_Justice();
                break;
            case ItemId.Thiefs_Gloves:
                itemUpgrade = new Item_Thiefs_Gloves();
                break;
            default:
                itemUpgrade = new ItemBase();
                break;                
        }
        if(!itemUpgrade){
            return false;
        }
        itemUpgrade.itemInfo = itemInfo;
        unit.item.unequipItem(itemComponent);
        server.socketIO.in(this.roomId).emit('destroy_item_success', JSON.stringify(item.toJSON()));
        server.socketIO.in(this.roomId).emit('destroy_item_success', JSON.stringify(itemComponent.toJSON()));
        server.socketIO.in(this.roomId).emit('drop_item', this.socketId, [0,200,0], JSON.stringify(itemUpgrade.toJSON()));
        unit.item.equipItem(itemUpgrade);
        return true;
    }

    //nhặt vật phẩm
    pickupItem(itemBase){
        //Nếu vật phẩm này chưa được nhặt
        let item = this.itemInventory.unpickedItems.find(x => x.networkId === itemBase.networkId);
        if(!item){
            return;
        }
        if(item.tag === ItemTag.Gold){
            this.addGold(item.amount);
            //server.socketIO.in(this.roomId).except(this.socketId).emit('destroy_', this.tactician1.state.networkId, position);
        }
        else if(item.tag === ItemTag.Item){
            //Xóa vật phẩm trong danh sách chưa nhặt
            this.itemInventory.unpickedItems = this.itemInventory.unpickedItems.filter(x => x.networkId !== item.networkId);
            //Thêm vật phẩm vào tile trống trong Inventory
            let tile = this.itemInventory.addItem(item);
            if(!tile){
                return;
            }
            server.socketIO.in(this.roomId).emit('pick_up_item_success', JSON.stringify(tile), JSON.stringify(item.toJSON()));
        }
    }

    //di chuyển linh thú
    tacticianMove(position){
        this.tactician1.state.position = position;
        server.socketIO.in(this.roomId).except(this.socketId).emit('tactician_move_success', this.tactician1.state.networkId, position);
        this.tactician1.anim.triggerRun();
    }

    //xoay linh thú
    tacticianRotate(rotation){
        this.tactician1.state.rotation = rotation;
        server.socketIO.in(this.roomId).except(this.socketId).emit('tactician_rotate_success', this.tactician1.state.networkId, rotation);
    }

    tacticianStop(){
        this.tactician1.anim.triggerIdle();
    }

    //cập nhật cấp độ người chơi
    increaseMaxUnitOnBattlefield(amount){
        this.battlefield.maxUnitOnBattlefield += amount;
    }

    //cập nhật cấp độ người chơi
    levelUp(level){
        this.tactician1.state.level = level;
        server.socketIO.in(this.socketId).emit('level_up', this.tactician1.state.level);
    }

    //Thêm vàng
    addGold(amount){
        this.unitShop.gold += amount;
        server.socketIO.in(this.socketId).emit('update_gold', this.unitShop.gold);
    }

    //thay đổi tỉ lệ roll tướng
    async changeRollingOdds(){
        let rollingOdds = await this.unitShop.changeRollingOdds(this.tactician1.state.level);
        server.socketIO.to(this.socketId).emit('change_rolling_odds', JSON.stringify(rollingOdds));
    }

    //Khóa/Mở UnitShop
    async lockUnitShop(){
        let lock = this.unitShop.lockUnitShop();
        server.socketIO.to(this.socketId).emit('lock_unit_shop_success', lock);
    }

    //Làm mới UnitShop
    async refreshUnitShop(cost){
        if(this.unitShop.gold < cost){
            server.socketIO.to(this.socketId).emit('refresh_unit_shop_failure', 'Không đủ Vàng để làm mới');
            return;
        }
        this.unitShop.gold -= cost;
        let newUnitShop = await this.unitShop.refreshUnitShop();
        server.socketIO.in(this.socketId).emit('update_gold', this.unitShop.gold);
        server.socketIO.to(this.socketId).emit('refresh_unit_shop_success', JSON.stringify(newUnitShop));
    }

    //Mua đơn vị
    buyUnit(index){
        // if(this.currPhase === Phases.Arrival || this.currPhase === Phases.End){
        //     return;
        // }
        let champion = this.unitShop.buyUnit(index);
        if(!champion){
            return;
        }
        champion = this.upgradeUnit(champion);
        if(champion.state.level === 0){
            let addUnitOnBench = this.bench.addUnit(champion);
            if(!addUnitOnBench){
                server.socketIO.to(this.socketId).emit('buy_unit_failure', 'Hàng chờ đã đạt số lượng tối đa!');
            }
            else{
                this.unitShop.champions[index] = null;
                server.socketIO.to(this.socketId).emit('buy_unit_success', index);
                server.socketIO.in(this.roomId).emit('add_unit_on_bench', this.socketId, JSON.stringify(addUnitOnBench.toJSON()), JSON.stringify(addUnitOnBench.unit.state.toJSON()));
            }
            return;
        }
        this.unitShop.champions[index] = null;
        server.socketIO.to(this.socketId).emit('buy_unit_success', index);
        server.socketIO.in(this.roomId).emit('upgrade_unit', JSON.stringify(champion.state.toJSON()));
    }

    //
    autoUpgradeUnit(){
        for(let i = this.bench.listTile.length - 1; i >= 0; i--){
            if(!this.bench.listTile[i].unit){
                continue;
            }
            let champion = this.upgradeUnit(this.bench.listTile[i].unit);
            if(!this.bench.listTile[i].unit){
                server.socketIO.in(this.roomId).emit('upgrade_unit', JSON.stringify(champion.state.toJSON()));
            }
        }
    }

    //Tự động nâng cấp đơn vị
    upgradeUnit(champion){
        //Giới hạn nâng cấp là level 2
        if(champion === null || champion.state.level >= 2){
            return champion;
        }
        //Tìm kiếm các đơn vị khác có cùng loại, cùng số cấp độ trên Hàng chờ và Sân đấu
        let sameChampionOnBench = this.bench.listTile.filter(x => x.unit !== null && x.unit.state.networkId !== champion.state.networkId && x.unit.state.unitId === champion.state.unitId && x.unit.state.level === champion.state.level);
        //Nếu trong giai Chiến đấu, không thể nâng cấp các đơn vị trong Sân đấu, chỉ xét duyệt các đơn vị trong Hàng đợi
        if(this.currPhase === Phases.Arrival || this.currPhase === Phases.Battle ||this.currPhase === Phases.End){
            //TH ít hơn 2 đơn vị cùng loại và cùng cấp độ => không thể có sự nâng cấp, trả về đơn vị truyền vào
            if(sameChampionOnBench.length < 2){
                //TODO: Thêm thông tin cho champion trước khi trả về: id, level, ...
                return champion;
            }
            //TH có 2 đơn vị cùng loại và cùng cấp độ => có thể nâng lên thêm 1 cấp độ
            //TODO: Xét duyệt thêm điều kiện đơn vị mang trang bị sẽ được ưu tiên nâng cấp
            //Đơn vị đầu tiên trên Hàng đợi được ưu tiên nâng cấp
            let newCh = sameChampionOnBench[0].unit;
            newCh.state.level += 1;
            newCh.state.attackDamage = newCh.state.unitInfo.attackDamage[newCh.state.level];
            newCh.state.maxHP = newCh.state.unitInfo.maxHP[newCh.state.level];
            newCh.state.hp = newCh.state.unitInfo.maxHP[newCh.state.level];
            newCh.state.sellPrice = newCh.state.unitInfo.sellPrice[newCh.state.level];
            //Xóa các unit còn lại
            sameChampionOnBench = sameChampionOnBench.filter(x => x !== sameChampionOnBench[0]);
            for(let i = 0; i < sameChampionOnBench.length; i++){
                server.socketIO.in(this.roomId).emit('delete_unit', JSON.stringify(sameChampionOnBench[i].unit.state.toJSON()));
                sameChampionOnBench[i].unit.state.currTile = null;
                sameChampionOnBench[i].unit.state.position = [];
                sameChampionOnBench[i].unit = null;
            }
            let index = this.bench.listTile.findIndex(x => x.unit === champion);
            if(index !== -1){
                server.socketIO.in(this.roomId).emit('delete_unit', JSON.stringify(champion.state.toJSON()));
                this.bench.listTile[index].unit.state.currTile = null;
                this.bench.listTile[index].unit.state.position = [];
                this.bench.listTile[index].unit = null;
            }
            return this.upgradeUnit(newCh);
        }
        else if(this.currPhase === Phases.Planning){
            let sameChampionOnBattlefield = this.battlefield.listTile.filter(x => x.unit !== null && x.unit.state.networkId !== champion.state.networkId && x.unit.state.unitId === champion.state.unitId && x.unit.state.level === champion.state.level);
            //TH ít hơn 2 đơn vị cùng loại và cùng cấp độ => không thể có sự nâng cấp, trả về đơn vị truyền vào
            if(sameChampionOnBench.length + sameChampionOnBattlefield.length < 2){
                //TODO: Thêm thông tin cho champion trước khi trả về: id, level, ...
                return champion;
            }
            //TH có 2 đơn vị cùng loại và cùng cấp độ => có thể nâng lên thêm 1 cấp độ
            //TODO: Xét duyệt thêm điều kiện đơn vị mang trang bị sẽ được ưu tiên
            //Đơn vị đầu tiên trên Sân đấu được ưu tiên (nếu có)
            if(sameChampionOnBattlefield.length > 0){
                //sameChampionOnBattlefield[0].state.level += 1;
                let newCh = sameChampionOnBattlefield[0].unit;
                newCh.state.level += 1;
                newCh.state.attackDamage = newCh.state.unitInfo.attackDamage[newCh.state.level];
                newCh.state.maxHP = newCh.state.unitInfo.maxHP[newCh.state.level];
                newCh.state.hp = newCh.state.unitInfo.maxHP[newCh.state.level];
                newCh.state.sellPrice = newCh.state.unitInfo.sellPrice[newCh.state.level];
                //Xóa các unit còn lại
                sameChampionOnBattlefield = sameChampionOnBattlefield.filter(x => x !== sameChampionOnBattlefield[0]);
                for(let i = 0; i < sameChampionOnBattlefield.length; i++){
                    server.socketIO.in(this.roomId).emit('delete_unit', JSON.stringify(sameChampionOnBattlefield[i].unit.state.toJSON()));
                    sameChampionOnBattlefield[i].unit.state.currTile = null;
                    sameChampionOnBattlefield[i].unit.state.position = [];
                    sameChampionOnBattlefield[i].unit = null;
                    sameChampionOnBattlefield[i].walkable = true;
                }
                for(let i = 0; i < sameChampionOnBench.length; i++){
                    server.socketIO.in(this.roomId).emit('delete_unit', JSON.stringify(sameChampionOnBench[i].unit.state.toJSON()));
                    sameChampionOnBench[i].unit.state.currTile = null;
                    sameChampionOnBench[i].unit.state.position = [];
                    sameChampionOnBench[i].unit = null;
                }
                let index = this.battlefield.listTile.findIndex(x => x.unit === champion);
                if(index !== -1){
                    server.socketIO.in(this.roomId).emit('delete_unit', JSON.stringify(champion.state.toJSON()));
                    this.battlefield.listTile[index].unit.state.currTile = null;
                    this.battlefield.listTile[index].unit.state.position = [];
                    this.battlefield.listTile[index].unit = null;
                }
                let index2 = this.bench.listTile.findIndex(x => x.unit === champion);
                if(index2 !== -1){
                    server.socketIO.in(this.roomId).emit('delete_unit', JSON.stringify(champion.state.toJSON()));
                    this.bench.listTile[index2].unit.state.currTile = null;
                    this.bench.listTile[index2].unit.state.position = [];
                    this.bench.listTile[index2].unit = null;
                }
                return this.upgradeUnit(newCh);
            }
            else{
                let newCh = sameChampionOnBench[0].unit;
                newCh.state.level += 1;
                newCh.state.attackDamage = newCh.state.unitInfo.attackDamage[newCh.state.level];
                newCh.state.maxHP = newCh.state.unitInfo.maxHP[newCh.state.level];
                newCh.state.hp = newCh.state.unitInfo.maxHP[newCh.state.level];
                newCh.state.sellPrice = newCh.state.unitInfo.sellPrice[newCh.state.level];
                //Xóa các unit còn lại
                sameChampionOnBench = sameChampionOnBench.filter(x => x !== sameChampionOnBench[0]);
                for(let i = 0; i < sameChampionOnBattlefield.length; i++){
                    server.socketIO.in(this.roomId).emit('delete_unit', JSON.stringify(sameChampionOnBattlefield[i].unit.state.toJSON()));
                    sameChampionOnBattlefield[i].unit.state.currTile = null;
                    sameChampionOnBattlefield[i].unit.state.position = []
                    sameChampionOnBattlefield[i].unit = null;
                    sameChampionOnBattlefield[i].walkable = true;
                }
                for(let i = 0; i < sameChampionOnBench.length; i++){
                    server.socketIO.in(this.roomId).emit('delete_unit', JSON.stringify(sameChampionOnBench[i].unit.state.toJSON()));
                    sameChampionOnBench[i].unit.state.currTile = null;
                    sameChampionOnBench[i].unit.state.position = [];
                    sameChampionOnBench[i].unit = null;
                }
                let index = this.bench.listTile.findIndex(x => x.unit === champion);
                if(index !== -1){
                    server.socketIO.in(this.roomId).emit('delete_unit', JSON.stringify(champion.state.toJSON()));
                    this.bench.listTile[index].unit.state.currTile = null;
                    this.bench.listTile[index].unit.state.position = [];
                    this.bench.listTile[index].unit = null;
                }
                return this.upgradeUnit(newCh);
            }
        }
    }
    
    //Bán đơn vị
    sellUnit(unitState){
        //Nếu đơn vị không xác dịnh hoặc không ở trạng thái 'Nghỉ ngơi'
        if(!unitState || !unitState.networkId || !unitState.onArea || unitState.status !== UnitStatus.Resting){
            return;
        }
        //Nếu đơn vị trên Hàng chờ
        let tile = null;
        if(unitState.onArea === OnArea.Bench){
            tile = this.bench.listTile.find(x => x.unit !== null && x.unit.state.networkId === unitState.networkId);
        }
        //Nếu đơn vị trên Sân đấu
        else if(unitState.onArea === OnArea.Battlefield){
            tile = this.battlefield.listTile.find(x => x.unit !== null && x.unit.state.networkId === unitState.networkId);
        }
        //Nếu đơn vị không ở trạng thái 'Nghỉ ngơi' thì không thể bán
        if(!tile || tile.unit.state.status !== UnitStatus.Resting){
            return;
        }
        if(tile.tag === TileTag.Battlefield){
            this.traitController.removeTrait(tile.unit);
        }
        for(let i = 0; i < tile.unit.item.itemLst.length; i++){
            let item = tile.unit.item.unequipItem(tile.unit.item.itemLst[i]);
            let tileInventory = this.itemInventory.addItem(item);
            if(!tileInventory){
                return;
            }
            server.socketIO.in(this.roomId).emit('pick_up_item_success', JSON.stringify(tileInventory), JSON.stringify(item.toJSON()));
        }
        server.socketIO.in(this.roomId).emit('delete_unit', JSON.stringify(tile.unit.state.toJSON()));
        tile.unit.state.currTile = null;
        tile.unit.state.position = [];
        tile.unit = null;
        tile.canUse = true;
        if(tile.hasOwnProperty('walkable')){
            tile.walkable = true;
        }
    }

    //Kéo thả đơn vị tới ô nào đó
    async dragDropUnit(_unitState, _tile){
        let unitState = JSON.parse(_unitState);
        let tile = JSON.parse(_tile);
        //Nếu đơn vị không ở trạng thái 'Nghỉ ngơi' thì không thể kéo thả
        if(!unitState || !unitState.networkId || !unitState.onArea || unitState.status !== UnitStatus.Resting){
            return;
        }
        //Tìm kiếm thông tin đơn vị cần di chuyển và tile hiện tại của nó
        let currTile = null;
        //Nếu đơn vị trên Hàng chờ
        if(unitState.onArea === OnArea.Bench){
            currTile = this.bench.listTile.find(x => x.unit !== null && x.unit.state.networkId === unitState.networkId);
        }
        //Nếu đơn vị trên Sân đấu
        else if(unitState.onArea === OnArea.Battlefield){
            currTile = this.battlefield.listTile.find(x => x.unit !== null && x.unit.state.networkId === unitState.networkId);
        }
        //Nếu không tìm thấy hoặc đơn vị không ở trạng thái 'Nghỉ ngơi'
        if(!currTile || (currTile.unit != null && currTile.unit.state.status !== UnitStatus.Resting)){
            return;
        }

        //Tìm Tile mà đơn vị cần chuyển đến
        let toTile = null;
        if(tile.tag === TileTag.Bench){
            toTile = this.bench.listTile.find(x => x.networkId === tile.networkId && x.x === tile.x && x.y === tile.y);
        }
        else if(tile.tag === TileTag.Battlefield){
            toTile = this.battlefield.listTile.find(x => x.networkId === tile.networkId && x.x === tile.x && x.y === tile.y);
        }
        //Nếu ô được chọn không xác định đơn vị trong ô đó đang trong trạng thái 'Chiến đấu' thì dừng
        if(!toTile || (toTile.unit != null && toTile.unit.state.status !== UnitStatus.Resting)){
            return;
        }
        //Nếu kéo thêm đơn vị vào chỗ trống trên Sàn đấu
        if(currTile.tag === TileTag.Bench && toTile.tag === TileTag.Battlefield){
            //Trong giai đoạn Arrival, Battle và End thì không được phép
            if(this.currPhase === Phases.Arrival || this.currPhase === Phases.Battle || this.currPhase === Phases.End){
                return;
            }
            //Kiểm tra giới hạn đơn vị có thể triển khai
            const currNumberUnitOnBattlefield = this.battlefield.listTile.filter(x => x.unit !== null).length;
            if(currNumberUnitOnBattlefield >= this.battlefield.maxUnitOnBattlefield){
                return;
            }
        }

        //Thay thế đơn vị trong tile truyền vào và trả về đơn vị bị thay thế (đơn vị trong tile trước khi bị thay thế)
        let beReplacedUnit;
        if(tile.tag === TileTag.Bench){
            beReplacedUnit = this.bench.replaceUnit(tile, currTile.unit);
        }
        else if(tile.tag === TileTag.Battlefield){
            beReplacedUnit = this.battlefield.replaceUnit(tile, currTile.unit);
        }
        //Nếu thay thế không thành công thì dừng
        if(beReplacedUnit === undefined){
            return;
        }

        //Thay thế beReplacedUnit vào vị trí của đơn vị truyền vào trước đó
        if(currTile.tag === TileTag.Bench){
            this.bench.replaceUnit(currTile, beReplacedUnit);
        }
        else if(currTile.tag === TileTag.Battlefield){
            this.battlefield.replaceUnit(currTile, beReplacedUnit);
        }
        
        //Cập nhật thông tin tộc/hệ

        if(currTile.tag === TileTag.Bench && toTile.tag === TileTag.Battlefield){
            await this.traitController.addTrait(toTile.unit);
            this.traitController.removeTrait(currTile.unit);
        }
        if(currTile.tag === TileTag.Battlefield && toTile.tag === TileTag.Bench){
            await this.traitController.addTrait(currTile.unit);
            this.traitController.removeTrait(toTile.unit);
        }
        
        server.socketIO.in(this.roomId).emit('drag_drop_unit_success', this.socketId, JSON.stringify(toTile.toJSON()), JSON.stringify(toTile.unit.state.toJSON()));
        if(currTile.unit){
            server.socketIO.in(this.roomId).emit('drag_drop_unit_success', this.socketId, JSON.stringify(currTile.toJSON()), JSON.stringify(currTile.unit.state.toJSON()));
        }
    }

    activeTraits(isActive){
        if(isActive){
            this.traitController.active();
        }
        else{
            this.traitController.inactive();
        }
    }

    changeUnitStatus(status){
        let tile = this.battlefield.listTile.filter(x => x.unit !== null);
        for(let i = 0; i < tile.length; i++){
            tile[i].unit.state.status = status;
            if(status === UnitStatus.Resting){
                tile[i].unit.state.battlefield = null;
            }
            else if(status === UnitStatus.Fighting){
                tile[i].unit.state.battlefield = this.battlefield;
            }
        }
    }

    resetBattlefield(){
        let tile = this.battlefield.listTile.filter(x => x.unit !== null);
        for(let i = 0; i < tile.length; i++){
            tile[i].unit.anim.triggerIdle(true);
            tile[i].unit.buff.removeAllBuffs();
            tile[i].unit.state.resetState();
            tile[i].unit.state.currTile = tile[i];
            tile[i].unit.state.position = tile[i].position;
            server.socketIO.in(this.roomId).emit('reset_state', JSON.stringify(tile[i].unit.state.toJSON()));
        }
//        server.socketIO.in(this.roomId).emit('reset_battlefield', JSON.stringify(tile));
    }
    

    // removeUnitOnUnitShop(_slot){
    //     delete this.unitShop[_slot];
    // }

    // addUnitOnBench(_unit) {
    //     for(let i = 0; i < ROW_BENCH; i++){
    //         for(let j = 0; j < COL_BENCH; j++){
    //             if(!(this.bench || {}).hasOwnProperty("slot"+i+"_"+j) ){
    //                 if(this.bench == null)
    //                     this.bench = {};
    //                 this.bench["slot"+i+"_"+j] = _unit;
    //                 const result = {
    //                     slot : "slot"+i+"_"+j,
    //                     unit : _unit
    //                 };
    //                 return result;
    //             }
    //         }
    //     }
    //     return null;
    // }

    // removeUnitOnBench(_unit) {
    //     for(var i in this.bench) {
    //         if(this.bench[i]._id == _unit._id && this.bench[i].championName == _unit.championName){
    //             delete this.bench[i];
    //             return i;
    //         }
    //     }
    //     return null;
    // }

    // set maxUnitOnBench(maxUnitOnBench) { this._maxUnitOnBench = maxUnitOnBench; }
    // get maxUnitOnBench() { return this._maxUnitOnBench; }

    // set battlefield(battlefield) { this._battlefield = battlefield; }   
    // get battlefield() { return this._battlefield; }

    // addUnitInBattlefield(_unit) {
    //     for(let i = 0; i < ROW_BATTLEFIELD; i++){
    //         for(let j = 0; j < COL_BATTLEFIELD; j++){
    //             if(!(this.battlefield || {}).hasOwnProperty("slot"+i+"_"+j) ){
    //                 if(this.battlefield == null)
    //                     this.battlefield = {};
    //                 this.battlefield["slot"+i+"_"+j] = _unit;
    //                 const result = {
    //                     slot : "slot"+i+"_"+j,
    //                     unit : _unit
    //                 };
    //                 return result;
    //             }
    //         }
    //     }
    //     return null;
    // }
    // removeUnitOnBattlefield(_unit) {
    //     for(var i in this.battlefield) {
    //         if(this.battlefield[i]._id == _unit._id && this.battlefield[i].championName == _unit.championName) {
    //             delete this.battlefield[i];
    //             return i;
    //         }
    //     }
    //     return null;
    // }
};

module.exports = PlayerController;