
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TT_FollowTarget : ThrowType
{
    public GameObject owner;
    public JFollowTarget skill1;
    public GameObject target1;
    public override void Launch()
    {
        if (!target1)
        {
            DestroySpawn();
            return;
        }
        isActive = true;
    }

    //protected override void Update()
    //{
    //    if(!isActive || !target1)
    //    {
    //        return;
    //    }
    //    Vector3 targetWeakness = target1.GetComponent<UnitState>().weakness.position;
    //    this.transform.position = Vector3.MoveTowards(base.transform.position, targetWeakness, skill1.speedFly * Time.fixedDeltaTime);
    //    this.transform.LookAt(targetWeakness);
    //}

    protected override void FixedUpdate()
    {
        if (!isActive || !target1)
        {
            return;
        }
        Vector3 targetWeakness = target1.GetComponent<UnitState>().weakness.position;
        this.transform.position = Vector3.MoveTowards(base.transform.position, targetWeakness, skill1.speedFly * Time.fixedDeltaTime);
        this.transform.LookAt(targetWeakness);
    }
}
