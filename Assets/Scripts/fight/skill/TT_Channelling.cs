using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TT_Channelling : ThrowType
{
    [SerializeField] private float timeChanneling;
    [SerializeField] private float tickInterval;
    [SerializeField] private int tickTimes;
    [SerializeField] private float nextTriggerTime;

    public override void Launch()
    {

    }

    protected override void FixedUpdate()
    {
        
    }
}
