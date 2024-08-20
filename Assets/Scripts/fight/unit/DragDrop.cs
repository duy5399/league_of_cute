using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.EventSystems;

public class DragDrop1 : MonoBehaviour
{
    [SerializeField] protected NetworkObject networkObject;
    [SerializeField] protected string dropTag;
    [SerializeField] protected float posY;
    [SerializeField] protected Vector3 offset;
    [SerializeField] protected Transform tfSelectDrop;

    protected virtual void Awake()
    {
        networkObject = this.GetComponent<NetworkObject>();
    }

    protected virtual void FixedUpdate()
    {
        
    }

    protected virtual void OnMouseDown()
    {
        if (!networkObject.isOwner)
        {
            return;
        }
        offset = Input.mousePosition - Camera.main.WorldToScreenPoint(transform.position);
        posY = this.transform.position.y + 2f;
        this.transform.position = new Vector3(this.transform.position.x, posY, this.transform.position.x);
    }

    protected virtual void OnMouseDrag()
    {
        if (!networkObject.isOwner)
        {
            return;
        }
    }

    protected virtual void OnMouseUp()
    {
        if (!networkObject.isOwner)
        {
            return;
        }
    }

    protected virtual void OnMouseOver()
    {
        
    }
}
