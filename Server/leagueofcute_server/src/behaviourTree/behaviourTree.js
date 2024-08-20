class BehaviourTree {
    constructor(){
        this.updateTimeId = null;
    }

    startBT(){
        this.updateTimeId = setInterval(()=>{
            if(this.root === undefined){
                return;
            }
            this.root.evaluate();
        }, 20);
    }

    stopBT(){
        clearInterval(this.updateTimeId);
    }
    
    //Thiết kế cây hành vi cho đối tượng
    setupBT(){
        
    }
}

module.exports = { BehaviourTree }