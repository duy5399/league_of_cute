const uuid = require('uuid');
const { UnitStatus, OnArea } = require("../enum/enum");

const { BattlefieldTile } = require("./tile");
const ROW_BATTLEFIELD = 8;
const COL_BATTLEFIELD = 7;
const START_POINT_X = -6.6; //Điểm bắt đầu X của ma trận tile
const START_POINT_Z = -8.9; //Điểm bắt đầu Z của ma trận tile
const SPACING_X = 2.4;  //Khoảng cách trục X giữa 2 tile
const SPACING_Z = 2.1;  //Khoảng cách trục Z giừa 2 tile
const MAX_UNIT_ON_BATTLEFIELD = 9;

class Battlefield{
    constructor(roomId){
        this.networkId = uuid.v4();
        this.roomId = roomId;
        this.row = ROW_BATTLEFIELD;
        this.col = COL_BATTLEFIELD;
        this.listTile = [];
        this.maxUnitOnBattlefield = 1;
        this.home = null;
        this.homeTactician = [];
        this.homeTeamComps = [];
        this.away = null;
        this.awayTactician = null;
        this.awayTeamComps = [];
        this.battleOver = false;
        this.create();
    }

    create(){
        for(let x = 0; x < this.row; x++)
        {
            for(let y = 0; y < this.col; y++)
            {
                let tile = new BattlefieldTile(x, y);
                if (x >= this.row / 2)
                {
                    tile.canUse = false;
                }
                if (x % 2 === 0){
                    tile.position = [START_POINT_X + y * SPACING_X, 0.9, START_POINT_Z + x * SPACING_Z]
                }
                else{
                    tile.position = [(START_POINT_X + y * SPACING_X) - (SPACING_X/2), 0.9, START_POINT_Z + x * SPACING_Z]
                }
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
        champion.state.currTile = tile;
        champion.state.position = tile.position;
        tile.unit = champion;
        tile.walkable = false;
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
            tile.walkable = true;
            return null;
        }
        let championTemp = tile.unit;
        tile.unit = champion;
        tile.unit.state.onArea = OnArea.Battlefield;
        tile.unit.state.currTile = tile;
        tile.unit.state.position = tile.position;
        tile.walkable = false;
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
        tile.unit.state.currTile = null;
        tile.unit.state.position = [];
        tile.unit = null;
        tile.walkable = false;
        return championTemp;
    }

    //---------------------------------------------
    //G cost: khoảng cách từ Tile đang xét đến Tile bắt đầu
    //H cost: khoảng cách từ Tile đang xét đến Tile kết thúc
    //F cost: G cost + H cost
    findPath(startXY, tartgetXY){
        let startTile = { ...this.listTile.find(element => element.x === startXY[0] && element.y === startXY[1])};
        let targetTile = { ...this.listTile.find(element => element.x === tartgetXY[0] && element.y === tartgetXY[1])};
        let openList = [startTile]; //Danh sách các node cần xét duyệt
        let closedList = [];        //Danh sách các node đã xét duyệt

        startTile.gCost = 0;
        startTile.hCost = this.getDistanceTwoTile([startTile.x, startTile.y], [targetTile.x,targetTile.y]);

        while(openList.length > 0)
        {
            //console.log('openList1: ' + openList.map(x => { return '[' + x.x +','+ x.y +']' }))
            //Tìm kiếm node có đường đi ngắn nhất trong danh sách
            let currentTile = this.getLowestFCostTile(openList);
            //Nếu node tìm thấy cũng là node kết thúc, trả về kết quả
            if (currentTile.x === targetTile.x && currentTile.y === targetTile.y){
                //return this.shortestPath(startTile, targetTile);
                return closedList;
            }

            //Thêm node vào danh sách các node đã duyệt để tránh phải duyệt lại
            closedList.push(currentTile);
            //console.log('closedList: '  + closedList.map(x => { return '[' + x.x +','+ x.y +']' }))
            //Xóa node khỏi danh sách các node cần xét duyệt
            openList = openList.filter(node => node !== currentTile);
            //console.log('openList2: '  + openList.map(x => { return '[' + x.x +','+ x.y +']' }) )
            //Xét duyệt các node xung quanh currentTile
            for(let neighbourTile of this.getNeighbourList(currentTile))
            {
                //Nếu tile kế bên không cho phép đi qua hoặc tile này đã từng được duyệt qua trước đó
                if ((!neighbourTile.walkable && neighbourTile.x !== targetTile.x && neighbourTile.y !== targetTile.y) || closedList.includes(neighbourTile)){
                    continue;
                }

                //Tính toán lại G cost của neighbourTile = G cost của currentTile + khoảng cách từ currentTile đến neighbourTile
                let tentativeGCostToNeighbour = currentTile.gCost + this.getDistanceTwoTile([currentTile.x, currentTile.y], [neighbourTile.x, neighbourTile.y]);
                //console.log('tentativeGCostToNeighbour: ' + tentativeGCostToNeighbour)
                //console.log('neighbourTile.gCost: ' + neighbourTile.gCost)
                //Nếu G cost của neighbourTile sau khi tính toán lại nhỏ hơn G cost thực tế
                if(/*!openList.includes(neighbourTile) ||*/ tentativeGCostToNeighbour < neighbourTile.gCost)
                {
                    neighbourTile.cameFromTile = currentTile;
                    neighbourTile.gCost = tentativeGCostToNeighbour;
                    neighbourTile.hCost = this.getDistanceTwoTile([neighbourTile.x, neighbourTile.y], [targetTile.x, targetTile.y]);
                    if(!openList.includes(neighbourTile)){
                        openList.push(neighbourTile);
                    }
                }
            }
        }
        return null;
    }

    //Tìm kiếm node có đường đi ngắn nhất trong danh sách
    getLowestFCostTile(nodeList){
        let lowestTile = nodeList[0];
        for(let i = 1; i < nodeList.length; i++)
        {
            if (nodeList[i].fCost < lowestTile.fCost || (nodeList[i].fCost === lowestTile.fCost && nodeList[i].hCost < lowestTile.hCost)){
                lowestTile = nodeList[i];
            }
        }
        return lowestTile;
    }

    // getDistanceTwoTile(tileA, tileB){
    //     let dx = tileB.x - tileA.x;
    //     let dy = tileB.y - tileA.y;
    //     let x = Math.abs(dx);
    //     let y = Math.abs(dy);
    //     if ((dy < 0) ^ ((tileA.x & 1) == 1))
    //         y = Math.max(0, y - (x / 2));
    //     else
    //         y = Math.max(0, y - (x + 1) / 2);
    //     return x + y;
    // }

    //Khoảng cách giữa 2 tile
    getDistanceTwoTile(tileA, tileB){
        let xDistance = Math.abs(tileA[0] - tileB[0]);
        let yDistance = Math.abs(tileA[1] - tileB[1]);
        if(tileB[1] > tileA[1]){
            yDistance -= 1;
        }
        var lowest = Math.min(xDistance, yDistance);
        var highest = Math.max(xDistance, yDistance);

        return lowest * 14 + (highest - lowest) * 10;
    }

    //Trả về danh sách các node xung quanh
    getNeighbourList(currentTile){
        let neighbourList = [];
        //Góc trên phải
        if(currentTile.x + 1 < ROW_BATTLEFIELD)
        {
            if (currentTile.x % 2 !== 0){
                let tile = { ...this.listTile.find(element => element.x === (currentTile.x + 1) && element.y === currentTile.y)};
                neighbourList.push(tile);
            }
            else
            {
                if (currentTile.y + 1 < COL_BATTLEFIELD){
                    let tile = { ...this.listTile.find(element => element.x === (currentTile.x + 1) && element.y === (currentTile.y + 1))};
                    neighbourList.push(tile);
                }
            }
        }
        //Góc trên trái
        if (currentTile.x + 1 < ROW_BATTLEFIELD)
        {
            if (currentTile.x % 2 === 0){
                let tile = { ...this.listTile.find(element => element.x === (currentTile.x + 1) && element.y === currentTile.y)};
                neighbourList.push(tile);
            }
            else
            {
                if( currentTile.y > 0){
                    let tile = { ...this.listTile.find(element => element.x === (currentTile.x + 1) && element.y === (currentTile.y - 1))};
                    neighbourList.push(tile);
                }
            }
        }
        //Phải
        if (currentTile.y + 1 < COL_BATTLEFIELD){
            let tile = { ...this.listTile.find(element => element.x === currentTile.x && element.y === (currentTile.y + 1))};
            neighbourList.push(tile);
        }
        //Trái
        if (currentTile.y - 1 >= 0){
            let tile = { ...this.listTile.find(element => element.x === currentTile.x && element.y === (currentTile.y - 1))};
            neighbourList.push(tile);
        }
        //Góc dưới trái
        if (currentTile.x - 1 >= 0)
        {
            if (currentTile.x % 2 === 0){
                let tile = { ...this.listTile.find(element => element.x === (currentTile.x - 1) && element.y === currentTile.y)};
                neighbourList.push(tile);
            }
            else
            {
                if (currentTile.y > 0){
                    let tile = { ...this.listTile.find(element => element.x === (currentTile.x - 1) && element.y === (currentTile.y - 1))};
                    neighbourList.push(tile);
                }
            }
        }
        //Góc dưới phải
        if (currentTile.x - 1 >= 0)
        {
            if (currentTile.x % 2 !== 0){
                let tile = { ...this.listTile.find(element => element.x === (currentTile.x - 1) && element.y === currentTile.y)};
                neighbourList.push(tile);
            }
            else
            {
                if (currentTile.y + 1 < COL_BATTLEFIELD){
                    {
                        let tile = { ...this.listTile.find(element => element.x === (currentTile.x - 1) && element.y === (currentTile.y + 1))};
                        neighbourList.push(tile);
                    }
                }
            }
        }

        return neighbourList;
    }

    shortestPath(startTile, endTile){
        let path = [endTile];
        let currentTile = endTile;
        while(currentTile !== startTile)
        {
            path.push(currentTile);
            currentTile = currentTile.cameFromTile;
        }
        return path.reverse();
    }
}

module.exports = Battlefield