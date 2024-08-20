
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Unity.VisualScripting;
using UnityEngine;

public class ThrowType : MonoBehaviour
{
    [SerializeField] protected Transform _target;
    [SerializeField] protected float speedFly;
    [SerializeField] protected float hitRange = 0.3f;
    [SerializeField] protected bool isActive;

    public Transform target
    {
        get { return _target; }
        set { _target = value; }
    }

    //public virtual void OnDrawGizmosSelected()
    //{
    //    if (hitRange > 0f)
    //    {
    //        Gizmos.color = Color.yellow;
    //        Gizmos.DrawWireSphere(base.transform.position, hitRange);
    //    }
    //}

    protected virtual void Awake()
    {
        
    }

    protected virtual void Update()
    {

    }

    protected virtual void FixedUpdate()
    {

    }

    public virtual List<Collider> GetCollidersInRange()
    {
        return Physics.OverlapSphere(base.transform.position, hitRange).ToList();
    }

    public virtual void Launch()
    {
    }

    public virtual void DestroySpawn()
    {
        isActive = false;
        this.gameObject.SetActive(false);
    }

    protected virtual void Suicide()
    {
        if (target && target.tag == "Temp")
        {
            Destroy(target.gameObject);
        }
        isActive = false;
    }
}
