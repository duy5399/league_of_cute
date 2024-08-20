using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.EventSystems;

public class ChampionDragDrop : DragDrop1
{
    [SerializeField] private ChampionState chState;
    [SerializeField] private bool isSellUnit = false;
    [SerializeField] private string sellTag;

    protected override void Awake()
    {
        base.Awake();
        chState = this.GetComponent<ChampionState>();
        dropTag = "Tile";
        sellTag = "SellUnit";
    }

    protected override void FixedUpdate()
    {

    }

    public void SellUnit()
    {
        SocketIO1.instance.unitShopIO.Emit_SellUnit(chState.jUnitState);
    }

    protected override void OnMouseDown()
    {
        base.OnMouseDown();
        //if (base.stateCtrl.inCombat)
        //{
        //    return;
        //}
        //trong Combat chỉ có thể kéo thả unit trên "Hàng chờ"
        //trong Planning có thể kéo thả unit trên "Sân đấu"
        //if (SocketIO.instance.playerDataInBattleSocketIO.playerData._phase == "PlanningPhase")
        //{
        //    BattlefieldSideManager.instance.SetActiveBattlefieldSide(true);
        //}
        RoomManager1.instance.myBenchTile.ForEach(x =>
        {
            x.GetComponent<Tile>().Active(true);
        });
        for(int i = 0; i < RoomManager1.instance.myBattlefieldTile.Count; i++)
        {
            if(i >= 28)
            {
                break;
            }
            RoomManager1.instance.myBattlefieldTile[i].GetComponent<Tile>().Active(true);
        }
        this.transform.GetComponent<Collider>().enabled = false;
    }

    protected override void OnMouseDrag()
    {
        base.OnMouseDrag();
        //if (base.stateCtrl.inCombat)
        //{
        //    return;
        //}
        //kích hoạt chỗ bán unit
        UnitShopManager.instance.ActiveSellUnit(true, chState);
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
            if (tfSelectDrop && tfSelectDrop.tag == dropTag)
            {
                tfSelectDrop.GetComponent<Tile>().ChangeBorder(false);
            }
            tfSelectDrop = hit.transform;
            if (tfSelectDrop.tag == dropTag)
            {
                tfSelectDrop.GetComponent<Tile>().ChangeBorder(true);
            }
        }
        else
        {
            if (tfSelectDrop && tfSelectDrop.tag == dropTag)
            {
                tfSelectDrop.GetComponent<Tile>().ChangeBorder(false);
                tfSelectDrop = null;
            }
        }
        Debug.DrawRay(Camera.main.transform.position, dir, Color.green);
    }

    protected override void OnMouseUp()
    {
        base.OnMouseUp();
        RoomManager1.instance.myBenchTile.ForEach(x =>
        {
            x.GetComponent<Tile>().Active(false);
        });
        for (int i = 0; i < RoomManager1.instance.myBattlefieldTile.Count; i++)
        {
            if (i >= 28)
            {
                break;
            }
            RoomManager1.instance.myBattlefieldTile[i].GetComponent<Tile>().Active(false);
        }
        //bán unit
        var pointerEventData = new PointerEventData(null);
        pointerEventData.position = Input.mousePosition;
        var raycastResults = new List<RaycastResult>();
        EventSystem.current.RaycastAll(pointerEventData, raycastResults);
        if (raycastResults.Count > 0 && raycastResults.Exists(x => x.gameObject.tag == sellTag))
        {
            isSellUnit = true;
        }
        else
        {
            isSellUnit = false;
        }
        UnitShopManager.instance.ActiveSellUnit(false);
        if (isSellUnit)
        {
            SellUnit();
            return;
        }
        if (tfSelectDrop && tfSelectDrop.GetComponent<NetworkObject>().isOwner)
        {
            Debug.Log("send drpp " + tfSelectDrop.name);
            JTile tile = tfSelectDrop.GetComponent<Tile>().tile;
            SocketIO1.instance.roomIO.Emit_DragDropUnit(chState.jUnitState, tile);
        }
        this.transform.localPosition = new Vector3(chState.jUnitState.position[0], chState.jUnitState.position[1], chState.jUnitState.position[2]);
        transform.GetComponent<Collider>().enabled = true;
    }

    protected override void OnMouseOver()
    {
        if (Input.GetMouseButtonDown(1))
        {
            UnitDescriptionManager.instance.DisplayUnitDescription(true, chState);
            //for (int i = 0; i < 3; i++)
            //{
            //    if (i < base.items.itemLst.Count && base.items.itemLst[i])
            //    {
            //        Debug.Log("DragDrop OnMouseOver: " + base.items.itemLst[i].GetComponent<ItemBase>().item.icon);
            //        switch (i)
            //        {
            //            case 0:
            //                UnitDescriptionManager.instance.SetImageItem1(base.items.itemLst[i].GetComponent<ItemBase>().item.icon); break;
            //            case 1:
            //                UnitDescriptionManager.instance.SetImageItem2(base.items.itemLst[i].GetComponent<ItemBase>().item.icon); break;
            //            case 2:
            //                UnitDescriptionManager.instance.SetImageItem3(base.items.itemLst[i].GetComponent<ItemBase>().item.icon); break;
            //        }
            //    }
            //    else
            //    {
            //        switch (i)
            //        {
            //            case 0:
            //                UnitDescriptionManager.instance.SetImageItem1(); break;
            //            case 1:
            //                UnitDescriptionManager.instance.SetImageItem2(); break;
            //            case 2:
            //                UnitDescriptionManager.instance.SetImageItem3(); break;
            //        }
            //    }
            //}
        }
    }
}
