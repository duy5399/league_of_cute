const server = require("../../server");
const { MoveState } = require("../enum/enum");
const { moveTowards, lookRotation, distance2D } = require("../formula/formula");

class UnitMove{
    constructor(parent){
        this.parent = parent;
        this.locked = false;
        this.moveState = MoveState.Standing;
        this.nextTileToMove = null;
    }

    //Tìm mục tiêu gần nhất
    findNearestTarget(){
        if(!this.parent.state.arena || this.moveState === MoveState.FindingNearestTarget){
            return;
        }
        this.locked = true;
        this.moveState = MoveState.FindingNearestTarget;
        let enemy = [];
        //Nếu đơn vị này có trong danh sách Chủ nhà => kẻ thù là Đội Khách
        if(this.parent.state.arena.homeTeamComps.some(x => x.state.networkId === this.parent.state.networkId)){
            enemy = this.parent.state.arena.awayTeamComps.filter(x => x.state.hp > 0 && !x.state.dead);
        }
        //Ngược lại kẻ thù là Chủ nhà
        else{
            enemy = this.parent.state.arena.homeTeamComps.filter(x => x.state.hp > 0 && !x.state.dead);
        }
        let nearestEnemy = null;
        let shortestPath = null;
        //Duyệt qua các đơn vị kẻ địch, tìm đường đi ngắn nhất cũng là kẻ địch gần nhất
        for(let i = 0; i < enemy.length; i++){
            let path = this.parent.state.arena.findPath([this.parent.state.currTile.x, this.parent.state.currTile.y], [enemy[i].state.currTile.x, enemy[i].state.currTile.y]);
            if(!path){
                continue;
            }
            if(!shortestPath || shortestPath[shortestPath.length - 1] > path[path.length - 1]){
                nearestEnemy = enemy[i];
                shortestPath = path;
            }
        }
        //console.log(this.parent.state.unitName + ' - ' + this.parent.state.networkId + ' nearestEnemy: ' + nearestEnemy);
        this.parent.state.target = nearestEnemy;
        this.moveState = MoveState.Standing;
        this.locked = false;
    }

    //Tìm đường đi ngắn nhất tới mục tiêu
    shortestPathToTarget(){
        if(!this.parent.state.arena || this.moveState === MoveState.FindingShortestPath || this.nextTileToMove){
            return;
        }
        this.moveState = MoveState.FindingShortestPath;
        let path = this.parent.state.arena.findPath([this.parent.state.currTile.x, this.parent.state.currTile.y], [this.parent.state.target.state.currTile.x, this.parent.state.target.state.currTile.y]);
        if(!path || !path[1].walkable){
            this.moveState = MoveState.Standing;
            return;
        }
        //console.log(this.parent.state.unitName + ' - ' + this.parent.state.networkId + ' shortestPathToTarget: ' + this.parent.state.target.state.currTile)
        //Reset tile hiện tại đang đứng
        let nexTile = this.parent.state.arena.listTile.find(element => element.networkId === path[1].networkId);
        nexTile.walkable = false;
        //Thay đổi thông tin currTile của unit state
        let currTile = this.parent.state.arena.listTile.find(element => element.x === this.parent.state.currTile.x && element.y === this.parent.state.currTile.y);
        currTile.walkable = true;
        this.nextTileToMove = path[1];
        this.moveState = MoveState.Standing;
    }

    //Di chuyển về phía mục tiêu
    moveToTarget(){
        if(!this.parent.state.arena || !this.nextTileToMove || distance2D([this.parent.state.currTile.x, this.parent.state.currTile.y], [this.parent.state.target.state.currTile.x, this.parent.state.target.state.currTile.y]) <= this.parent.state.attackRange){
            return;
        }

        //di chuyển và xoay hướng về phía mục tiêu
        let forward = [this.nextTileToMove.position[0] - this.parent.state.position[0],this.nextTileToMove.position[1] - this.parent.state.position[1],this.nextTileToMove.position[2] - this.parent.state.position[2]];
        this.parent.state.rotation = lookRotation(forward);
        this.parent.state.position = moveTowards(this.parent.state.position, this.nextTileToMove.position, this.parent.state.moveSpd * 0.02);
        this.parent.anim.triggerRun();
        server.socketIO.in(this.parent.state.roomId).emit('unit_move_success', JSON.stringify(this.parent.state.toJSON()));

        if(JSON.stringify(this.parent.state.position) === JSON.stringify(this.nextTileToMove.position)){
            this.parent.anim.triggerIdle();
            this.parent.state.currTile = this.nextTileToMove;
            this.nextTileToMove = null;
            
        }
    }
}

module.exports = {UnitMove}