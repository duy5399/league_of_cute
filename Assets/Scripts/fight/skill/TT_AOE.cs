
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class TT_AOE : ThrowType
{
    [SerializeField] protected int maxHitNum;
    [SerializeField] protected float lifeTime;

    public GameObject owner;
    public JAoE skill1;
    public GameObject target1;
    public override void Launch()
    {

    }

    public void TriggerHit()
    {
        if (!isActive)
        {
            return;
        }
        if (target == null && isActive)
        {
            isActive = false;
            Suicide();
            return;
        }
        
    }
}
