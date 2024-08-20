const { UnitBT } = require("../behaviourTree/unitBT");
const { ChampionAim } = require("../champion/championAnim");
const { ChampionBT } = require("../champion/championBT");
const { ChampionMove } = require("../champion/championMove");
const { UnitStatus, OnArea } = require("../enum/enum");
const { UnitBuff } = require("../unit/unitBuff");
const { UnitItem } = require("../unit/unitItem");
const { UnitMove } = require("../unit/unitMove");
const { UnitSkill } = require("../unit/unitSkill");


const { BenchTile } = require("./tile");
const ROW_BENCH = 1;
const COL_BENCH = 9;
const START_POINT_X = -9.1;
const SPACING_X = 2.1;
const MAX_UNIT_ON_BENCH = 9;

class Bench{
    constructor(roomId){
        this.roomId = roomId;
        this.row = ROW_BENCH;   
        this.col = COL_BENCH;
        this.listTile = [];
        this.maxUnitOnBench = MAX_UNIT_ON_BENCH;
        this.create();
    }

    create(){
        for(let x = 0; x < this.row; x++)
        {
            for(let y = 0; y < this.col; y++)
            {
                let tile = new BenchTile(x, y);
                tile.position = [START_POINT_X + y * SPACING_X, 1, -11.5]
                this.listTile.push(tile);
            }
        }
    }

    addUnit(champion){
        let tile = this.listTile.find(x => x.canUse === true && x.unit === null);
        //Nếu không có ô nào trống để thêm
        if(!tile){
            return null;
        }
        //Thêm đơn vị vào ô trống được tìm thấy
        tile.unit = champion;
        champion.state.currTile = tile;
        champion.state.position = tile.position;
        champion.anim = new ChampionAim(champion);
        champion.move = new ChampionMove(champion);
        champion.skill = new UnitSkill(champion);
        champion.buff = new UnitBuff(champion);
        champion.item = new UnitItem(champion);
        champion.behaviour = new ChampionBT(champion);
        champion.behaviour.setupBT();

        return tile;
    }

    replaceUnit(_tile, champion){
        let tile = this.listTile.find(x => x.networkId === _tile.networkId && x.x === _tile.x && x.y === _tile.y);
        //Nếu ô không tồn tại hoặc không thể sử dụng hoặc đơn vị trong ô không ở trạng thái Resting
        if(!tile || !tile.canUse || (tile.unit != null && tile.unit.state.status !== UnitStatus.Resting)){
            return undefined;
        }
        //Thay thế đơn vị trong tile và trả về đơn vị bị thay thế
        if(champion === null){
            tile.unit = null;
            return null;
        }
        let championTemp = tile.unit;
        tile.unit = champion;
        tile.unit.state.onArea = OnArea.Bench;
        tile.unit.state.currTile = tile;
        tile.unit.state.position = tile.position;
        return championTemp;
    }

    removeUnit(_tile){
        let tile = this.listTile.find(x => x.networkId === _tile.networkId && x.x === _tile.x && x.y === _tile.y);
        //Nếu ô không tồn tại hoặc không thể sử dụng
        if(!tile){
            return undefined;
        }
        //Gán đơn vị trong tile trước thay thế nó (nếu có)
        let championTemp = tile.unit;
        tile.unit.state.currTile = tile;
        tile.unit.state.position = tile.position;
        tile.unit = null;
        return championTemp;
    }
}

module.exports = Bench