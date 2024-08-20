const server = require("../../server");
const { client } = require("../db/init.redis");
const { TraitBase } = require("./traitBase");

class TraitController{
    constructor(socketId){
        this.socketId = socketId;
        this.origins = [];
        this.classes = [];

        this.trait = {};
        //this.trait = { traitId : TraitBase };
    }

    //Thêm tộc/hệ
    async addTrait(unit){
        if(!unit){
            return;
        }
        let traitDB = await client.json.get('traitDB');
        //Duyệt qua các Tộc/Hệ của đơn vị
        for(let i = 0; i < unit.state.origins.length; i++){
            //Nếu đã có tộc/hệ này trong danh sách Trait
            if(!this.trait.hasOwnProperty(unit.state.origins[i])){
                this.trait[unit.state.origins[i]] = new TraitBase(traitDB[unit.state.origins[i]]);
            }
            let result = this.trait[unit.state.origins[i]].addTrait(unit);
            if(result){
                server.socketIO.to(this.socketId).emit('update_trait', JSON.stringify(traitDB[unit.state.origins[i]]), this.trait[unit.state.origins[i]].currBreakpoint);
            }
        }
        for(let i = 0; i < unit.state.classes.length; i++){
            //Nếu đã có tộc/hệ này trong danh sách Trait
            if(!this.trait.hasOwnProperty(unit.state.classes[i])){
                this.trait[unit.state.classes[i]] = new TraitBase(traitDB[unit.state.classes[i]]);
            }
            let result = this.trait[unit.state.classes[i]].addTrait(unit);
            if(result){
                server.socketIO.to(this.socketId).emit('update_trait', JSON.stringify(traitDB[unit.state.classes[i]]), this.trait[unit.state.classes[i]].currBreakpoint);
            }
        }
    }

    //Xóa tộc/hệ
    async removeTrait(unit){
        if(!unit){
            return;
        }
        let traitDB = await client.json.get('traitDB');
        //Duyệt qua các Tộc/Hệ của đơn vị
        for(let i = 0; i < unit.state.origins.length; i++){
            //Nếu không có tộc/hệ này hoặc đơn vị có trong danh sách Trait
            if(!this.trait.hasOwnProperty(unit.state.origins[i]) || !this.trait[unit.state.origins[i]].champion.some(x => x === unit)){
                continue;
            }
            let result = this.trait[unit.state.origins[i]].removeTrait(unit);
            if(result){
                server.socketIO.to(this.socketId).emit('update_trait', JSON.stringify(traitDB[unit.state.origins[i]]), this.trait[unit.state.origins[i]].currBreakpoint);
            }
            if(this.trait[unit.state.origins[i]].currBreakpoint <= 0){
                delete this.trait[unit.state.origins[i]];
            }
        }
        for(let i = 0; i < unit.state.classes.length; i++){
            //Nếu không có tộc/hệ này hoặc đơn vị có trong danh sách Trait
            if(!this.trait.hasOwnProperty(unit.state.classes[i]) || !this.trait[unit.state.classes[i]].champion.some(x => x === unit)){
                continue;
            }
            let result = this.trait[unit.state.classes[i]].removeTrait(unit);
            if(result){
                server.socketIO.to(this.socketId).emit('update_trait', JSON.stringify(traitDB[unit.state.classes[i]]), this.trait[unit.state.classes[i]].currBreakpoint);
            }
            if(this.trait[unit.state.classes[i]].currBreakpoint <= 0){
                delete this.trait[unit.state.classes[i]];
            }
        }
    }
    
    active(){
        for (const [key, value] of Object.entries(this.trait)) {
            value.active();
        }
    }

    inactive(){
        for (const [key, value] of Object.entries(this.trait)) {
            value.inactive();
        }
    }
}

module.exports = { TraitController }