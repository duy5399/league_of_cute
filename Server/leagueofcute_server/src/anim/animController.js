const server = require("../../server");

class AnimController{
    constructor(){
        
    }

    // async triggerAnim(objectName, animName, animSpeed, force = false, animEffect = null){
    //     server.socketIO.in(this.socket.info.data_location).emit('trigger-anim-success', objectName, animName, animSpeed, force, animEffect);
    // }

    async triggerAnim(animName, animSpeed, force, animEffect = []){
        let character = {
            uid : this.socket.info.uid,
            nickname : this.socket.info.nickname,
        }
        server.socketIO.in(this.socket.info.data_location).emit('character-trig-anim-success', JSON.stringify(character), animName, animSpeed, force, animEffect);
    }

    // async triggerAnim(info, animName, animSpeed, force, animEffect = null){
    //     server.socketIO.in(this.obj.info.data_location).emit('trigger-anim-success', JSON.stringify(info), animName, animSpeed, force, animEffect);
    // }

    triggerAnim(animName, animSpeed = 1, force = false, animEffects = [])
    {
        
    }

    triggerEffect(effectName)
    {

    }

    spawnAnimEffect(animEffect)
    {

    }

    spawnAnimAudio(audio)
    {
        
    }
}



module.exports = { AnimController }