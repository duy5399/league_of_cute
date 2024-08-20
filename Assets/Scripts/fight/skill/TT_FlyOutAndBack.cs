using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;

public class TT_FlyOutAndBack : ThrowType
{
    [SerializeField] private float activeDistance;
    public Transform tempTargetPoint;
    [SerializeField] private bool flyOut;

    protected override void Awake()
    {
        tempTargetPoint = new GameObject("tempTargetPoint").transform;
        tempTargetPoint.tag = "Temp";
    }

    //public override void Launch()
    //{
    //    if (target == null)
    //    {
    //        //Destroy(base.gameObject);
    //        return;
    //    }
    //    Debug.Log("TT_FlyOutAndBack Launch");
    //    activeDistance = skill.details.flyOutAndBack.activeDistance;
    //    speedFly = skill.details.flyOutAndBack.speedFly;
    //    triggerOnHit = skill.details.flyOutAndBack.triggerOnHit;
    //    hitRange = skill.details.flyOutAndBack.hitRange;
    //    flyOut = true;
    //    tempTargetPoint = new GameObject("tempTargetPoint").transform;
    //    tempTargetPoint.tag = "Temp";
    //    tempTargetPoint.parent = skill.info.weakness.transform;
    //    tempTargetPoint.localPosition = transform.localRotation * Vector3.forward * activeDistance + transform.localPosition;
    //    isActive = true;
    //}

    //protected override void FixedUpdate()
    //{
    //    if (isActive && target != null)
    //    {
    //        if (tempTargetPoint != null)
    //        {
    //            if (this.transform.position == tempTargetPoint.position)
    //            {
    //                flyOut = false;
    //                objHitted.Clear();
    //            }
    //            if(flyOut)
    //            {
    //                this.transform.position = Vector3.MoveTowards(this.transform.position, tempTargetPoint.position, speedFly * Time.fixedDeltaTime);
    //                this.transform.LookAt(tempTargetPoint);
    //            }
    //            else
    //            {
    //                this.transform.position = Vector3.MoveTowards(this.transform.position, skill.transform.position, speedFly * Time.fixedDeltaTime);
    //                this.transform.LookAt(skill.transform.position);
    //            }
    //        }
    //        if(flyOut == false && this.transform.position == skill.transform.position)
    //        {
    //            Destroy(tempTargetPoint.gameObject);
    //            Suicide();
    //        }
    //    }
    //}

    public GameObject owner;
    public GameObject target1;
    public JFlyOutAndBack skill1;
    public override void Launch()
    {
        Debug.Log("owner rotation: " + owner.transform.rotation);
        tempTargetPoint.gameObject.SetActive(true);
        flyOut = true;
        isActive = true;
    }

    protected override void Update()
    {
        if(!isActive || tempTargetPoint == null)
        {
            return;
        }

        if (this.transform.position == owner.transform.position && !flyOut)
        {
            isActive = false;
            tempTargetPoint.gameObject.SetActive(false);
            this.gameObject.SetActive(true);
            return;
        }

        if (this.transform.position == tempTargetPoint.position)
        {
            flyOut = false;
        }
        if (flyOut)
        {
            this.transform.position = Vector3.MoveTowards(this.transform.position, tempTargetPoint.position, skill1.speedFly * Time.fixedDeltaTime);
            this.transform.LookAt(tempTargetPoint);
        }
        else
        {
            this.transform.position = Vector3.MoveTowards(this.transform.position, owner.transform.position, skill1.speedFly * Time.fixedDeltaTime);
            this.transform.LookAt(owner.transform.position);
        }

        if (isActive && target != null)
        {
            if (tempTargetPoint != null)
            {
                
            }
            if (flyOut == false && this.transform.position == owner.transform.position)
            {
                Destroy(tempTargetPoint.gameObject);
                Suicide();
            }
        }
    }
}
