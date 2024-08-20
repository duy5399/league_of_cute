using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class TT_Bounce : ThrowType
{
    [SerializeField] private int maxBounce;
    [SerializeField] protected float bounceRange;
    public GameObject owner;
    public JBounce skill1;
    public GameObject target1;

    public SkillEffect skillEffect;

    //public override void OnDrawGizmosSelected()
    //{
    //    if (bounceRange > 0f)
    //    {
    //        Gizmos.color = Color.white;
    //        Gizmos.DrawWireSphere(base.transform.position, bounceRange);
    //    }
    //}
    public override void Launch()
    {
        if (!target1)
        {
            DestroySpawn();
            return;
        }
        isActive = true;
    }


    protected override void Update()
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
