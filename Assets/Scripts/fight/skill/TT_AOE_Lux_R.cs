using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class TT_AOE_Lux_R : TT_AOE
{
    public override List<Collider> GetCollidersInRange()
    {
        Vector3 endPoint = base.transform.TransformPoint(Vector3.forward * 25);
        return Physics.OverlapCapsule(base.transform.position, endPoint, hitRange).ToList();
    }
}
