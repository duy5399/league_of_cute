using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TT_FixedDirection : ThrowType
{
    [SerializeField] protected Vector3 prePos;
    [SerializeField] protected float activeDistance;
    public override void Launch()
    {
        tempTargetPoint.gameObject.SetActive(true);
        isActive = true;
    }

    public GameObject owner;
    public GameObject target1;
    public JFixedDirection skill1;
    public Transform tempTargetPoint;

    protected override void Awake()
    {
        tempTargetPoint = new GameObject("tempTargetPoint").transform;
        tempTargetPoint.tag = "Temp";
        tempTargetPoint.gameObject.SetActive(false);
    }

    protected override void FixedUpdate()
    {
        if (!isActive || tempTargetPoint == null)
        {
            return;
        }
        if (this.transform.position == tempTargetPoint.position)
        {
            DestroySpawn();
            return;
        }
        this.transform.position = Vector3.MoveTowards(base.transform.position, tempTargetPoint.transform.position, skill1.speedFly * Time.fixedDeltaTime);
        this.transform.LookAt(tempTargetPoint.transform.position);
    }
}
