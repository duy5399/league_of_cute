const server = require("../../server");
const { AnimStatus } = require("../enum/enum");

class UnitAim
{
    constructor(parent){
        this.parent = parent;
        this.animStatus = AnimStatus.Idle;
    }

    triggerAnim(animName, animSpeed = 1, force = false,  animEffect = [])
    {
        if ((animName === 'idle' && this.animStatus === AnimStatus.Idle) || (animName === 'run' && this.animStatus === AnimStatus.Run) || (animName === 'death' && this.animStatus === AnimStatus.Death)){
            return;
        }
        if (animName === 'idle')
        {
            this.animStatus = AnimStatus.Idle;
        }
        else if (animName === 'run')
        {
            this.animStatus = AnimStatus.Run;
        }
        else if (animName === 'death')
        {
            this.animStatus = AnimStatus.Death;
        }

        else if (animName === 'force_idle')
        {
            this.animStatus = AnimStatus.Idle;
            //InterruptNowAnim();
        }
        else
        {
            this.animStatus = AnimStatus.Orther;
            //InterruptNowAnim();
        }
        server.socketIO.in(this.parent.state.roomId).emit('trigger_anim_success', JSON.stringify(this.parent.state.toJSON()), animName, animSpeed, force, JSON.stringify(animEffect));
        if(animEffect.length <= 0)
        {
            return;
        }
        //server.socketIO.in(this.info.data_location).emit('trigger_anim_effect_success', JSON.stringify(this.info.getInfo()), JSON.stringify(animEffect)); 
    }

    triggerIdle(force = false)
    {
        this.triggerAnim('idle', 1, force);
    }

    triggerRun(force = false)
    {
        this.triggerAnim('run', 1, force);
    }

    triggerDeath(force = false)
    {
        this.triggerAnim('death', 1, force);
    }

    triggerVictory(force = false)
	{
        this.triggerAnim('victory', 1, force);
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

module.exports = { UnitAim }