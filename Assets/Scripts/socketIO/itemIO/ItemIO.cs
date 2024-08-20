using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;

public class ItemIO : MonoBehaviour
{
    private void Start()
    {
        ItemIOStart();
    }

    public void ItemIOStart()
    {
        //Drop item
        SocketIO1.instance.socketManager.Socket.On<string, string, string>("drop_gold", (owner, _unitState, _itemBase) => {
            Debug.Log("drop_gold: " + _unitState);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            if (!unit)
            {
                return;
            }
            GameObject goldPrefab = Resources.Load<GameObject>("prefabs/fight/items/coin");
            GameObject itemDrop = Instantiate(goldPrefab, new Vector3(unit.transform.position.x, 1.2f, unit.transform.position.z), Quaternion.identity);
            ItemBase1 itemBase = itemDrop.AddComponent<ItemBase1>();
            JItemBase jItemBase = JsonConvert.DeserializeObject<JItemBase>(_itemBase);
            itemBase.jItemBase = jItemBase;
            //Phases currPhase = (Phases)Enum.Parse(typeof(Phases), _currPhase);
            RoomManager1.instance.lstItem.Add(itemDrop);
        });

        SocketIO1.instance.socketManager.Socket.On<string, float[], string>("drop_item", (owner, position, _itemBase) => {
            Debug.Log("drop_item: " + _itemBase);

            bool isOwner = SocketIO1.instance.socketManager.Socket.Id == owner ? true : false;
            GameObject itemPrefab = Resources.Load<GameObject>("prefabs/fight/items/item");
            GameObject itemDrop = Instantiate(itemPrefab, new Vector3(position[0], 1.2f, position[2]), Quaternion.identity);
            JItemBase jItemBase = JsonConvert.DeserializeObject<JItemBase>(_itemBase);
            NetworkObject networkObject = itemDrop.AddComponent<NetworkObject>();
            networkObject.networkId = jItemBase.networkId;
            networkObject.isOwner = isOwner;
            ItemBase1 itemBase = itemDrop.AddComponent<ItemBase1>();
            ItemDragDrop1 itemDragDrop = itemDrop.AddComponent<ItemDragDrop1>();
            itemBase.jItemBase = jItemBase;

            Renderer meshRenderer = itemDrop.GetComponentInChildren<Renderer>();
            var materialsCopy = meshRenderer.materials;
            Material newMaterial = Resources.Load<Material>("materials/items/" + jItemBase.itemInfo.itemIcon);
            materialsCopy[0] = newMaterial;
            meshRenderer.materials = materialsCopy;

            RoomManager1.instance.lstItem.Add(itemDrop);
        });

        //Nhặt vật phẩm thành công
        SocketIO1.instance.socketManager.Socket.On<string, string>("pick_up_item_success", (_tile, _itemBase) => {
            Debug.Log("pick_up_item_success: " + _itemBase);
            JItemInventoryTile tile = JsonConvert.DeserializeObject<JItemInventoryTile>(_tile);
            JItemBase jItemBase = JsonConvert.DeserializeObject<JItemBase>(_itemBase);
            var lst = RoomManager1.instance.myItemInventoryTile.Concat(RoomManager1.instance.otherItemInventoryTile);
            GameObject itemTile = lst.FirstOrDefault(x => x.GetComponent<Tile>().tile.networkId == tile.networkId);
            GameObject item = RoomManager1.instance.FindItem(jItemBase);
            if (!itemTile || !item)
            {
                return;
            }
            ItemBase1 itemBase = item.GetComponent<ItemBase1>();
            itemBase.picked = false;
            item.transform.parent = itemTile.transform;
            item.transform.localPosition = new Vector3(0, 8, 0);
        });

        //Trang bị vật phẩm thành công
        SocketIO1.instance.socketManager.Socket.On<string, string>("equip_item_success", (_jUnitState, _jItemBase) => {
            Debug.Log("equip_item_success: " + _jItemBase);
            JUnitState jUnitState = JsonConvert.DeserializeObject<JUnitState>(_jUnitState);
            JItemBase jItemBase = JsonConvert.DeserializeObject<JItemBase>(_jItemBase);
            GameObject unit = RoomManager1.instance.FindUnit(jUnitState);
            if (!unit)
            {
                return;
            }
            ChampionState chState = unit.GetComponent<ChampionState>();
            chState.jUnitState = jUnitState;
            UnitItem chItem = unit.GetComponent<UnitItem>();
            GameObject item = RoomManager1.instance.FindItem(jItemBase);
            if(item)
            {
                
                chItem.itemObj.Add(item);
                chItem.AddEquip(jItemBase);
                item.transform.parent = chItem.itemManager;
                item.transform.localPosition = Vector3.zero;
                item.SetActive(false);
            }
            else
            {
                Debug.Log("equip_item_success2: " + _jItemBase);
                chItem.AddEquip(jItemBase);
            }
        });

        //Trang bị vật phẩm thành công
        SocketIO1.instance.socketManager.Socket.On<string, string>("unequip_item_success", (_jUnitState, _jItemBase) => {
            Debug.Log("unequip_item_success: " + _jItemBase);
            JUnitState jUnitState = JsonConvert.DeserializeObject<JUnitState>(_jUnitState);
            GameObject unit = RoomManager1.instance.FindUnit(jUnitState);
            if (!unit)
            {
                return;
            }
            JItemBase jItemBase = JsonConvert.DeserializeObject<JItemBase>(_jItemBase);
            ChampionState chState = unit.GetComponent<ChampionState>();
            chState.jUnitState = jUnitState;
            UnitItem chItem = unit.GetComponent<UnitItem>();
            for(int i = 0; i < chItem.itemObj.Count; i++)
            {
                if (chItem.itemObj[i].GetComponent<ItemBase1>().jItemBase.networkId != jItemBase.networkId)
                {
                    continue;
                }
                chItem.itemDisplay[i].SetActive(false);
                try
                {
                    chItem.itemObj[i].transform.parent = this.transform.root;
                    chItem.itemObj[i].transform.localPosition = new Vector3(unit.transform.position.x, 1.2f, unit.transform.position.z);
                    chItem.itemObj[i].transform.localRotation = Quaternion.identity;
                    chItem.itemObj[i].SetActive(true);
                    chItem.itemObj.Remove(chItem.itemObj[i]);
                }
                catch
                {
                    Debug.Log("unequip_item_fail: ");
                }
            }
        });

        SocketIO1.instance.socketManager.Socket.On<string>("destroy_item_success", (_jItemBase) => {
            Debug.Log("destroy_item_success: " + _jItemBase);
            JItemBase jItemBase = JsonConvert.DeserializeObject<JItemBase>(_jItemBase);
            GameObject item = RoomManager1.instance.FindItem(jItemBase);
            if (!item)
            {
                return;
            }   
            Debug.Log("destroy_item_success1: " + item.name);
            RoomManager1.instance.lstItem.Remove(item);
            Destroy(item);
        });
    }

    public void Emit_PickUpItem(JItemBase jItemBase)
    {
        SocketIO1.instance.socketManager.Socket.Emit("pick_up_item", jItemBase);
    }

    public void Emit_DragDropItem(JTile jTile, JItemBase jItemBase)
    {
        SocketIO1.instance.socketManager.Socket.Emit("drag_drop_item", jTile, jItemBase);
    }

    public void Emit_EquipItem(JUnitState jUnitState, JItemBase jItemBase)
    {
        Debug.Log("Emit_EquipItem: ");
        SocketIO1.instance.socketManager.Socket.Emit("equip_item", jUnitState, jItemBase);
    }
}

[Serializable]
public class JItemBase
{
    public string networkId;
    public string tag;
    public JItemInfo itemInfo;

}

[Serializable]
public class JItemInfo
{
    public string itemId;
    public string itemName;
    public string itemIcon;
    public string itemType;
    public JItemStats itemStats;
    public string descriptionStat;
    public string descriptionPassive;
    public int slotRequired;
    public bool isUnique;
}

[Serializable]
public class JItemStats
{
    public float attackDamage;
    public float aspd;
    public float ar;
    public float mr;
    public float abilityPower;
    public float sp;
    public float maxHp;
    public float critRate;
}