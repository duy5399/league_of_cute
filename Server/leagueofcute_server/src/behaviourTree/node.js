const { NodeState } = require("../enum/enum");


class Node{
    constructor(children = []){
        this.children = children;
    }
    
    get nodeState(){ return this._nodeState; }
    set nodeState(value){ this._nodeState = value; }
    
    get parent(){ return this._parent; }
    set parent(value){ this._parent = value; }

    get children(){ return this._children; }
    set children(value){ this._children = value; }
    
    evaluate(){

    }
}

class Selector extends Node{
    constructor(children){
        super(children);
    }
    //dừng khi một trong các phần tử con trả về Running hoặc Success
    evaluate(){
        for(let i = 0; i < this.children.length; i++){
            switch(this.children[i].evaluate()){
                case NodeState.Running:
                    this.nodeState = NodeState.Running;
                    return this.nodeState;
                case NodeState.Success:
                    this.nodeState = NodeState.Success;
                    return this.nodeState;
                case NodeState.Failure:
                    break;
                default:
                    break;
            }
        }
        this.nodeState = NodeState.Failure;
        return this.nodeState;
    }
}

class Sequence extends Node{
    constructor(children){
        super(children);
    }
    //dừng khi một trong các phần tử con trả về Failure
    evaluate(){
        let anyChildRunning = false;
        for(let i = 0; i < this.children.length; i++){
            switch(this.children[i].evaluate()){
                case NodeState.Running:
                    anyChildRunning = true;
                    break;
                case NodeState.Success:
                    break;
                case NodeState.Failure:
                    this.nodeState = NodeState.Failure;
                    return this.nodeState;
                default:
                    break;
            }
        }
        this.nodeState = (anyChildRunning === true)? NodeState.Running : NodeState.Success;
        return this.nodeState;
    }
}

module.exports = { Node, Selector, Sequence }