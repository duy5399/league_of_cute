using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class ItemDragDrop1 : DragDrop1
{
    [SerializeField] private ItemBase1 itemBase;
    [SerializeField] private bool isEquip = false;

    protected override void Awake()
    {
        base.Awake();
        itemBase = this.GetComponent<ItemBase1>();
        dropTag = "Champion";
    }

    protected override void FixedUpdate()
    {

    }

    public void EquipItem(JUnitState jUnitState, JItemBase jItemBase)
    {
        SocketIO1.instance.itemIO.Emit_EquipItem(jUnitState, jItemBase);
    }

    protected override void OnMouseDown()
    {
        if (!itemBase.picked)
        {
            return;
        }
        base.OnMouseDown();
    }

    protected override void OnMouseDrag()
    {
        if (!itemBase.picked)
        {
            return;
        }
        base.OnMouseDrag();
        //di chuyển unit theo chuột
        Vector3 position = Camera.main.ScreenToWorldPoint(Input.mousePosition - offset);
        this.transform.position = new Vector3(position.x, posY, position.z);
        //tạo 1 raycast từ camera
        Vector3 mousePos = Input.mousePosition;
        mousePos.z = 100f;
        var dir = Camera.main.ScreenToWorldPoint(mousePos) - Camera.main.transform.position;
        RaycastHit hit;
        //nếu chiếu tới các Tile có layer là Tile => active slot được chiếu tới
        if (Physics.Raycast(Camera.main.transform.position, dir, out hit, Mathf.Infinity, 1 << LayerMask.NameToLayer(dropTag)))
        {
            tfSelectDrop = hit.transform;
        }
        else
        {
            if (tfSelectDrop != null)
            {
                tfSelectDrop = null;
            }
        }
        Debug.DrawRay(Camera.main.transform.position, dir, Color.green);
    }

    protected override void OnMouseUp()
    {
        if (!itemBase.picked)
        {
            return;
        }
        base.OnMouseUp();
        if (tfSelectDrop && tfSelectDrop.GetComponent<NetworkObject>().isOwner)
        {
            Debug.Log("send drpp " + tfSelectDrop.name);
            ChampionState chStat = tfSelectDrop.gameObject.GetComponent<ChampionState>();
            EquipItem(chStat.jUnitState, itemBase.jItemBase);
            tfSelectDrop = null;
        }
        this.transform.localPosition = new Vector3(0, 8, 0);

    }

    protected override void OnMouseOver()
    {
        if (Input.GetMouseButtonDown(1))
        {
            ItemDescription.instance.DisplayItemInfo(true, itemBase.jItemBase.itemInfo);
        }
    }
}
