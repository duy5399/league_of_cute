const server = require("../../server");
const uuid = require('uuid');
const Battlefield = require("./battlefield");

class Arena extends Battlefield {
    constructor(roomId){
        super(roomId);

    }

    get listAway(){ return this._listAway; }
    set listAway(value){ this._listAway = value; }
    
    //---------------------------------------------
    //G cost: khoảng cách từ Tile đang xét đến Tile bắt đầu
    //H cost: khoảng cách từ Tile đang xét đến Tile kết thúc
    //F cost: G cost + H cost
    findPath(startXY, tartgetXY){
        let startTile = { ...this.listTile.find(x => x.x === startXY[0] && x.y === startXY[1])};
        let tartgetTile = { ...this.listTile.find(x => x.x === tartgetXY[0] && x.y === tartgetXY[1])};
        let openList = [startTile]; //Danh sách các node cần xét duyệt
        let closedList = [];        //Danh sách các node đã xét duyệt

        while(openList.length > 0)
        {
            //Tìm kiếm node có đường đi ngắn nhất trong danh sách
            let currentTile = getLowestFCostTile(openList);
            //Nếu node tìm thấy cũng là node kết thúc, trả về kết quả
            if (currentTile === tartgetTile){
                return shortestPath(startTile, tartgetTile);
            }

            //Thêm node vào danh sách các node đã duyệt để tránh phải duyệt lại
            closedList.push(currentTile);
            //Xóa node khỏi danh sách các node cần xét duyệt
            openList = openList.filter(node => node !== currentTile);

            //Xét duyệt các node xung quanh currentTile
            for(let neighbourTile of getNeighbourList(currentTile))
            {
                //Nếu tile kế bên không cho phép đi qua hoặc tile này đã từng được duyệt qua trước đó
                if ((!neighbourTile.walkable && neighbourTile !== tartgetTile) || closedList.includes(neighbourTile)){
                    continue;
                }

                //Tính toán lại G cost của neighbourTile = G cost của currentTile + khoảng cách từ currentTile đến neighbourTile
                let tentativeGCostToNeighbour = currentTile.gCost + getDistanceTwoTile(currentTile, neighbourTile);
                //Nếu G cost của neighbourTile sau khi tính toán lại nhỏ hơn G cost thực tế
                if(/*!openList.includes(neighbourTile) ||*/ tentativeGCostToNeighbour < neighbourTile.gCost)
                {
                    neighbourTile.cameFromTile = currentTile;
                    neighbourTile.gCost = tentativeGCostToNeighbour;
                    neighbourTile.hCost = getDistanceTwoTile(neighbourTile, tartgetTile);
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
            if (nodeList[i].fCost < lowestTile.fCost || nodeList[i].fCost === lowestTile.fCost && nodeList[i].hCost < lowestTile.hCost){
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
        if(tileB[1] < tileA[1]){
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
            if (currentTile.x % 2 != 0){
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
            if (currentTile.x % 2 == 0){
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
        //Góc dưới phải
        if (currentTile.x - 1 >= 0)
        {
            if (currentTile.x % 2 != 0){
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
        //Góc dưới trái
        if (currentTile.x - 1 >= 0)
        {
            if (currentTile.x % 2 == 0){
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

module.exports = Arena