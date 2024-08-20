const uuid = require('uuid');
const { TileTag } = require('../enum/enum');

class Tile{
    constructor(x, y){
        this.networkId = uuid.v4();
        this.x = x;
        this.y = y;
        this.position = [];
        this.canUse = true;
        this.tag = null;
    }

    toJSON(){     
        return { 
            networkId : this.networkId,
            x : this.x,
            y : this.y,
            position : this.position,
            tag : this.tag,
        };
    }
}

class BenchTile extends Tile{
    constructor(x, y){
        super(x, y);
        this.unit = null;
        this.tag = TileTag.Bench;
    }
}

class BattlefieldTile extends Tile{
    constructor(x, y){
        super(x, y);
        this.unit = null;
        this.tag = TileTag.Battlefield;
        this.walkable = true;
        this.gCost = Number.MAX_VALUE;
        this.hCost = 0;
        this.cameFromTile = null;
    }

    get fCost() { return this._gCost + this._hCost; }
}

class InventoryTile extends Tile{
    constructor(x, y){
        super(x, y);
        this.item = null;
        this.tag = TileTag.Inventory;
    }
}

module.exports = { BenchTile, BattlefieldTile, InventoryTile }