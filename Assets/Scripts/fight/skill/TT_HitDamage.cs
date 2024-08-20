using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TT_HitDamage : ThrowType
{
    protected override void Awake()
    {
       
    }

    public GameObject owner;
    public GameObject target1;
    public JHitDamage skill1;
    public override void Launch()
    {
        Invoke(nameof(DestroySpawn), 1f);
    }

    protected override void FixedUpdate()
    {
        
    }
}
