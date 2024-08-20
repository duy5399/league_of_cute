const server = require("../../server");
const { AnimStatus } = require("../enum/enum");
const { UnitAim } = require("../unit/unitAnim");

class TacticianAnim extends UnitAim
{
    constructor(parent){
        super(parent);
    }

    triggerAnim(animName, animSpeed = 1, force = false)
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
        else
        {
            this.animStatus = AnimStatus.Orther;
            //InterruptNowAnim();
        }
        server.socketIO.in(this.parent.state.roomId).emit('tactician_trigger_anim_success', JSON.stringify(this.parent.state.toJSON()), animName, animSpeed, force);
    }

    triggerCast(force = false)
    {
        this.triggerAnim('castSkill', 1, force);
    }

    triggerBeHitted(force = false)
    {
        this.triggerAnim('beHitted', 1, force);
    }
}

module.exports = { TacticianAnim }