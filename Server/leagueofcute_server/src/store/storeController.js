const server = require("../../server");
const { client } = require("../db/init.redis");
const { ItemClass } = require("../enum/enum");
const { Inventory } = require("../models/inventory.model");
const { Store } = require("../models/store.model");

class StoreController{
    constructor(player){
        this.player = player;
        this.inventory = null;
    }
    
    async getStore(){
        let store = await Store.find();
        this.inventory = await Inventory.findOne({ uid : this.player.uid });
        server.socketIO.to(this.player.socketId).emit('get_store_success', JSON.stringify(store), JSON.stringify(this.inventory));
    }

    async equipItem(itemId){
        //Nếu vật phẩm chưa được nhân vật mở khóa
        if(!this.inventory.tacticianUnlocked.some(x => x === itemId) && !this.inventory.arenaSkinUnlocked.some(x => x === itemId) && !this.inventory.boomUnlocked.some(x => x === itemId)){
            server.socketIO.to(this.player.socketId).emit('equip_store_item_failure', 'Vật phẩm chưa được mở khóa');
            return;
        }
        //Nếu vật phẩm đã được trang bị 
        if(this.inventory.tacticianEquip === itemId || this.inventory.arenaSkinEquip === itemId && this.inventory.boomEquip === itemId){
            server.socketIO.to(this.player.socketId).emit('equip_store_item_failure', 'Vật phẩm đang được trang');
            return;
        }
        let storeDB = await client.json.get('storeDB');
        let item = storeDB[itemId];
        //Nếu vật phẩm không tồn tại
        if(!item){
            server.socketIO.to(this.player.socketId).emit('equip_store_item_failure', 'Có lỗi khi trang bị vật phẩm, hãy thử lại');
            return;
        }
        switch(item.itemClass){
            case ItemClass.Tactician:
                this.inventory.tacticianEquip = itemId;
                break;
            case ItemClass.ArenaSkin:
                this.inventory.arenaSkinEquip = itemId;
                break;
            case ItemClass.Boom:
                this.inventory.boomEquip = itemId;
                break;    
        }
        await this.inventory.save();
        server.socketIO.to(this.player.socketId).emit('equip_store_item_success', JSON.stringify(item));
    }

    async unlockItem(itemId){
        let storeDB = await client.json.get('storeDB');
        let item = storeDB[itemId];
        //Nếu vật phẩm không tồn tại hoặc số dư tiền tệ không đủ để giao dịch
        if(!item){
            server.socketIO.to(this.player.socketId).emit('unlock_store_item_failure', 'Có lỗi khi giao dịch, hãy thử lại');
            return;
        }
        //Nếu số dư tiền tệ không đủ để giao dịch
        if(item.price.gold > this.inventory.gold /*|| item.price.crystal > this.inventory.crystal*/){
            server.socketIO.to(this.player.socketId).emit('unlock_store_item_failure', 'Không đủ số dư để giao dịch');
            return;
        }
        this.inventory.gold -= item.price.gold;
        //this.inventory.crystal -= item.price.crystal;
        switch(item.itemClass){
            case ItemClass.Tactician:
                this.inventory.tacticianUnlocked.push(itemId);
                break;
            case ItemClass.ArenaSkin:
                this.inventory.arenaSkinUnlocked.push(itemId);
                break;
            case ItemClass.Boom:
                this.inventory.boomUnlocked.push(itemId);
                break;    
        }
        await this.inventory.save();
        server.socketIO.to(this.player.socketId).emit('unlock_store_item_success', JSON.stringify(item));
        server.socketIO.to(this.player.socketId).emit('update_currency', this.inventory.gold, this.inventory.crystal);
    }
}


   
module.exports = { StoreController }