const { BehaviourTree } = require("./behaviourTree");
const { Node, Selector, Sequence } = require("./node");
const { distance, lookRotation, moveTowards, distanceTwoNode, distance2D } = require("../formula/formula");
const server = require("../../server");
const { UnitStatus, NodeState, MoveState, SkillTargetType } = require("../enum/enum");

//Cây hành vi cho các Giai đoạn vòng đấu
class UnitBT extends BehaviourTree{
    constructor(parent){
        super();
        this.parent = parent;
    }
    
    setupBT(){
        this.root = new Selector(
            [
                //new IsResting([], state),
                //new IsDead([], state),
                new Sequence([new CheckTarget([], this.parent), new InRangeAbility([], this.parent), new IsAbilityAvailable([], this.parent), new TriggerAbilitySkill([], this.parent)]),
                new Sequence([new CheckTarget([], this.parent), new InRangeBasicAttack([], this.parent), new IsNormalAttackAvailable([], this.parent), new TriggerNormalAttackSkill([], this.parent)]),
                new Sequence([new CheckTarget([], this.parent), new TaskMoveToTarget([], this.parent)]),
                new Sequence([new CheckTarget([], this.parent), new TaskFindShortestPath([], this.parent)]),
                new TaskFindNearestTarget([], this.parent)
            ]
        );
    }
}
//----------------------

class IsResting extends Node{
    constructor(children, parent){
        super(children);
        this.parent = parent;
    }

    evaluate(){
        if(this.parent.state.status !== UnitStatus.Fighting){
            this.nodeState = NodeState.Success;
            return this.nodeState;
        }
        //console.log('IsResting');
        this.nodeState = NodeState.Failure;
        return this.nodeState;
    }
}

class IsDead extends Node{
    constructor(children, parent){
        super(children);
        this.parent = parent;
    }

    evaluate(){
        if(this.parent.state.hp <= 0 && this.parent.state.dead){
            this.nodeState = NodeState.Success;
            return this.nodeState;
        }
        //console.log('Not Dead');
        this.nodeState = NodeState.Failure;
        return this.nodeState;
    }
}

class InRangeBasicAttack extends Node{
    constructor(children, parent){
        super(children);
        this.parent = parent;
    }

    evaluate(){
        super.evaluate();
        if(distanceTwoNode([this.parent.state.currTile.x, this.parent.state.currTile.y], [this.parent.state.target.state.currTile.x, this.parent.state.target.state.currTile.y]) > this.parent.state.attackRange){
            this.nodeState = NodeState.Failure;
            return this.nodeState;
        }
		this.nodeState = NodeState.Running;
        return this.nodeState;
    }
}

class InRangeAbility extends Node{
    constructor(children, parent){
        super(children);
        this.parent = parent;
    }

    evaluate(){
        super.evaluate();
        if(this.parent.state.ability && this.parent.state.ability.targetType === SkillTargetType.Self){
            this.nodeState = NodeState.Running;
            return this.nodeState;
        }
        if(!this.parent.state.ability || distanceTwoNode([this.parent.state.currTile.x, this.parent.state.currTile.y], [this.parent.state.target.state.currTile.x, this.parent.state.target.state.currTile.y]) > this.parent.state.ability.range){
            this.nodeState = NodeState.Failure;
            return this.nodeState;
        }
		this.nodeState = NodeState.Running;
        return this.nodeState;
    }
}

class IsNormalAttackAvailable extends Node{
    constructor(children, parent){
        super(children);
        this.parent = parent;
    }

    evaluate(){
        if(this.parent.skill.locked){
            this.nodeState = NodeState.Failure;
            return this.nodeState;
        }
        //TH: kỹ năng không xác định, unit không đủ sp, kỹ năng đang được thi triển, kỹ năng bị cấm triển khai khi bị câm lặng, unit ở trạng thái không thể tấn công, kỹ năng không thể thi triển khi đang di chuyển
        if (!this.parent.state.basicAttack || (this.parent.state.basicAttack.canBeSilenced && this.parent.state.silenced) || this.parent.state.attackDisable || (!this.parent.state.basicAttack.canMoveWhenCast && this.parent.move.moveState === MoveState.MovingToTarget)){
            this.nodeState = NodeState.Failure;
            return this.nodeState;
        }
        console.log('IsNormalAttackAvailable true:')
        this.nodeState = NodeState.Success;
        return this.nodeState;
    }
}

class IsAbilityAvailable extends Node{
    constructor(children, parent){
        super(children);
        this.parent = parent;
    }

    evaluate(){
        if(this.parent.skill.locked){
            this.nodeState = NodeState.Failure;
            return this.nodeState;
        }
        //TH: kỹ năng không xác định, unit không đủ sp, kỹ năng đang được thi triển, kỹ năng bị cấm triển khai khi bị câm lặng, unit ở trạng thái không thể tấn công, kỹ năng không thể thi triển khi đang di chuyển
        if (!this.parent.state.ability || (this.parent.state.sp < this.parent.state.maxSP) || (this.parent.state.ability.canBeSilenced && this.parent.state.silenced) || this.parent.state.attackDisable || (!this.parent.state.ability.canMoveWhenCast && this.parent.move.moveState === MoveState.MovingToTarget)){
            this.nodeState = NodeState.Failure;
            return this.nodeState;
        }
        console.log('IsAbilityAvailable true:')
        this.nodeState = NodeState.Success;
        return this.nodeState;
    }
}

class TriggerNormalAttackSkill extends Node{
    constructor(children, parent){
        super(children);
        this.parent = parent;
    }

    evaluate(){
        //TH: kỹ năng không xác định, unit không đủ sp, kỹ năng đang được thi triển, kỹ năng bị cấm triển khai khi bị câm lặng, unit ở trạng thái không thể tấn công, kỹ năng không thể thi triển khi đang di chuyển
        // if (this.parent.skill.locked || !skill || (skill.hasOwnProperty('sp') && skill.sp < this.parent.state.sp) || skill.isActive || (skill.canBeSilenced && this.parent.state.silenced) || this.parent.state.attackDisable || (!skill.canMoveWhenCast && this.parent.move.moveState != MoveState.StandStill)){
        //     this.nodeState = NodeState.Failure;
        //     return this.nodeState;
        // }
        //if(this.parent.skill.locked || this.parent.skill.currentCasting){
        if(!this.parent.skill.triggerSkill(this.parent.state.basicAttack, this.parent.state.level, this.parent.state.target)){
            this.nodeState = NodeState.Failure;
            return this.nodeState;
        }
        this.nodeState = NodeState.Success;
        return this.nodeState;
    }
}

class TriggerAbilitySkill extends Node{
    constructor(children, parent){
        super(children);
        this.parent = parent;
    }

    evaluate(){
        if(!this.parent.skill.triggerSkill(this.parent.state.ability, this.parent.state.level, this.parent.state.target)){
            this.nodeState = NodeState.Failure;
            return this.nodeState;
        }
        this.nodeState = NodeState.Success;
        return this.nodeState;
    }
}

class CheckTarget extends Node{
    constructor(children, parent){
        super(children);
        this.parent = parent;
    }
    
    evaluate(){
        if(!this.parent.state.target || this.parent.state.target.state.hp <= 0 || this.parent.state.target.state.dead){
            this.nodeState = NodeState.Failure;
            return this.nodeState;
        }
        //console.log('CheckTarget');
        this.nodeState = NodeState.Success;
        return this.nodeState;
    }
}

class TaskMoveToTarget extends Node{
    constructor(children, parent){
        super(children);
        this.parent = parent;
    }

    evaluate(){
        if(this.parent.state.moveDisable || this.parent.move.locked || !this.parent.move.nextTileToMove || distanceTwoNode([this.parent.state.currTile.x, this.parent.state.currTile.y], [this.parent.state.target.state.currTile.x, this.parent.state.target.state.currTile.y]) <= this.parent.state.attackRange){
            //console.log('TaskMoveToTarget fail: ' + this.parent.state.networkId);
            this.nodeState = NodeState.Failure;
            return this.nodeState;
        }
        //console.log('TaskMoveToTarget success: ' + this.parent.state.networkId);
        //TODO: championObj.transform.position: (-1.80, 0.90, -8.90) = chính position của Gameobj Tile => thử di chuyển Tướng bằng championObj.transform.position
        this.parent.move.moveToTarget();
        this.nodeState = NodeState.Running;
        return this.nodeState;
    }
}

class TaskFindShortestPath extends Node{
    constructor(children, parent){
        super(children);
        this.parent = parent;
    }

    evaluate(){
        if(this.parent.move.locked || this.parent.move.nextTileToMove || distanceTwoNode([this.parent.state.currTile.x, this.parent.state.currTile.y], [this.parent.state.target.state.currTile.x, this.parent.state.target.state.currTile.y]) <= this.parent.state.attackRange){
            this.nodeState = NodeState.Failure;
            return this.nodeState;
        }
        //console.log('TaskFindShortestPath: ' + this.parent.state.networkId + [this.parent.state.currTile.x, this.parent.state.currTile.y] + [this.parent.state.target.state.currTile.x, this.parent.state.target.state.currTile.y]);
        //TODO: championObj.transform.position: (-1.80, 0.90, -8.90) = chính position của Gameobj Tile => thử di chuyển Tướng bằng championObj.transform.position
        this.parent.move.shortestPathToTarget();
        this.nodeState = NodeState.Running;
        return this.nodeState;
    }
}

class TaskFindNearestTarget extends Node{
    constructor(children, parent){
        super(children);
        this.parent = parent;
    }

    evaluate(){
        //console.log('TaskFindNearestTarget: ' + this.parent.state.networkId);
        this.parent.move.findNearestTarget();
        this.nodeState = NodeState.Success;
        return this.nodeState;
    }
}

module.exports = { UnitBT }