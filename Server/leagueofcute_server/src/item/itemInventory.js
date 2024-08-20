const server = require("../../server");
const { InventoryTile } = require("../arena/tile");
const { client } = require("../db/init.redis");
const { ItemType, ItemId } = require("../enum/enum");
const { randomDouble, randomInt } = require("../formula/formula");
const { ItemBase, ItemGold, Item_SunfireCape, Item_Dragons_Claw, Item_Ionic_Spark, Item_Hand_of_Justice, Item_Thiefs_Gloves, Item_Zekes_Herald, Item_Evenshroud, Item_Redemption } = require("./itemBase");

const ROW_ITEM_INVENTORY = 4;
const COL_ITEM_INVENTORY = 3;
const START_POINT_X = -11;
const SPACING_X = 0.9;
const START_POINT_Y = -8;
const SPACING_Y = 0.9;
const MAX_ITEM_INVENTORY = 10;

class ItemInventory{
    constructor(socketId, roomId, unitShop){
        this.socketId = socketId;
        this.roomId = roomId;
        this.unitShop = unitShop;
        this.row = ROW_ITEM_INVENTORY;   
        this.col = COL_ITEM_INVENTORY;
        this.listTile = [];
        this.maxItemInventory = MAX_ITEM_INVENTORY;
        this.unpickedItems = [];
        this.create();
    }

    create(){
        let num = 0;
        for(let x = 0; x < this.row; x++)
        {
            for(let y = 0; y < this.col; y++)
            {
                if(num === 10){
                    return;
                }
                let tile = new InventoryTile(x, y);
                tile.position = [START_POINT_X + (y * SPACING_X), 1.55, START_POINT_Y - (x * SPACING_Y)]
                this.listTile.push(tile);
                num++;
            }
        }
    }

    addItem(item){
        let tile = this.listTile.find(x => x.item === null);
        //Nếu không có ô nào trống để thêm
        if(!tile){
            return null;
        }
        //Thêm trang bị vào ô trống được tìm thấy
        tile.item = item;
        return tile;
    }

    removeItem(item){
        let tile = this.listTile.find(x => x.item === item);
        //Nếu không có ô chứa trang bị
        if(!tile){
            return null;
        }
        //Xóa trang bị khỏi ô 
        tile.item = null;
        return tile;
    }

    async dropItem(monsterState, dropList){
        if(!monsterState || !dropList){
            return;
        }
        if(dropList.hasOwnProperty('gold')){
            for(let i = 0; i < dropList.gold.length; i++){
                if(randomDouble(0,1) > dropList.gold[i].odds){
					continue;
				}
                let amount = randomInt(dropList.gold[i].min, dropList.gold[i].max);
                let item = new ItemGold();
                item.amount = amount;
                this.unpickedItems.push(item);
                server.socketIO.in(this.roomId).emit('drop_gold', this.socketId, JSON.stringify(monsterState), JSON.stringify(item));
            }
        }
        if(dropList.hasOwnProperty('items')){
            //Danh sách item theo type
            let itemDB = await client.json.get('itemDB');
            let itemsComponent = Object.values(itemDB).filter(x => x.itemType === ItemType.Component);
            let itemsCore = Object.values(itemDB).filter(x => x.itemType === ItemType.Core);
            for(let i = 0; i < dropList.items.length; i++){
                //So sánh tỉ lệ thành công
                if(randomDouble(0,1) > dropList.items[i].odds){
					continue;
				}               
                //Thành công rớt vật phẩm => lấy ngẫu nhiên vật phẩm 
                let itemInfo = null;
                switch(dropList.items[i].itemType){
                    case ItemType.Component:
                        itemInfo = itemsComponent[Math.floor(Math.random() * itemsComponent.length)];
                        break;
                    case ItemType.Core:
                        itemInfo = itemsCore[Math.floor(Math.random() * itemsCore.length)];
                        break;
                }
                if(!itemInfo){
                    return;
                }
                let item = null;
                switch(itemInfo.itemId){
                    case ItemId.Zekes_Herald:
                        item = new Item_Zekes_Herald();
                        break;
                    case ItemId.Sunfire_Cape:
                        item = new Item_SunfireCape();
                        break;
                    case ItemId.Dragons_Claw:
                        item = new Item_Dragons_Claw();
                        break;
                    case ItemId.Ionic_Spark:
                        item = new Item_Ionic_Spark();
                        break;
                    case ItemId.Evenshroud:
                        item = new Item_Evenshroud();
                        break;
                    case ItemId.Redemption:
                        item = new Item_Redemption();
                        break;
                    case ItemId.Hand_of_Justice:
                        item = new Item_Hand_of_Justice();
                        break;
                    case ItemId.Thiefs_Gloves:
                        item = new Item_Thiefs_Gloves();
                        break;
                    default:
                        item = new ItemBase();
                        break;                
                }
                item.itemInfo = itemInfo;
                this.unpickedItems.push(item);
                server.socketIO.in(this.roomId).emit('drop_item', this.socketId, JSON.stringify(monsterState), JSON.stringify(item.toJSON()));
            }
        }
    }
}

module.exports = { ItemInventory }