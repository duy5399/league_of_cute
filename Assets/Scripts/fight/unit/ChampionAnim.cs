using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class ChampionAnim : UnitAnim
{
    protected override void Awake()
    {
        base.Awake();
    }

    public override void TriggerAnim(string animName, float animSpeed = 1f, bool force = false, List<AnimEffect> animEffect = null)
    {
        base.TriggerAnim(animName, animSpeed, force, animEffect);
    }

    public override void TriggerEffect(string effectName)
    {

    }

    public override void SpawnAnimEffect(AnimEffect animEffect)
    {

    }

    public override void SpawnAnimAudio(string audio)
    {

    }
}
