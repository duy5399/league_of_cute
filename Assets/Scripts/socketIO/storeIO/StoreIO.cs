using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class StoreIO : MonoBehaviour
{
    private void Start()
    {
        StoreIOStart();
    }

    public void StoreIOStart()
    {
        //Lấy thông tin về cửa hàng thành công
        SocketIO1.instance.socketManager.Socket.On<string, string>("get_store_success", (_store, _inventory) => {
            Debug.Log("get_store_success: _store " + _store);
            Debug.Log("get_store_success: _inventory " + _inventory);
            List<JStoreItemInfo> store = JsonConvert.DeserializeObject<List<JStoreItemInfo>>(_store);
            JInventory inventory = JsonConvert.DeserializeObject<JInventory>(_inventory);
            //Cập nhật Vàng và Ctrystal hiện có
            StoreManager.instance.UpdateCurrency(inventory.gold, inventory.crystal);
            //Duyệt qua từng vật phẩm trong cửa hàng và hiển thị nó
            for (int i = 0; i < store.Count; i++)
            {
                //Kiểm tra nếu người chơi đã sở hữa vật phẩm này thì không cần khóa nữa
                if (inventory.tacticianUnlocked.Contains(store[i].itemId) || inventory.arenaSkinEquip.Contains(store[i].itemId) || inventory.boomEquip.Contains(store[i].itemId))
                {
                    StoreManager.instance.AddItem(store[i], true);
                    if(store[i].itemId == inventory.tacticianEquip)
                    {
                        StoreManager.instance.tacticianEquip = store[i];
                    }
                    else if (store[i].itemId == inventory.arenaSkinEquip)
                    {
                        StoreManager.instance.arenaSkinEquip = store[i];
                    }
                    else if (store[i].itemId == inventory.boomEquip)
                    {
                        StoreManager.instance.boomEquip = store[i];
                    }
                    continue;
                }
                StoreManager.instance.AddItem(store[i]);
            }
        });

        SocketIO1.instance.socketManager.Socket.On<string>("get_store_failure", (_failure) => {
            Debug.Log("get_store_failure: " + _failure);
        });

        //Trang bị vật phẩm thành công
        SocketIO1.instance.socketManager.Socket.On<string>("equip_store_item_success", (_storeItemInfo) => {
            Debug.Log("equip_store_item_success: " + _storeItemInfo);
            JStoreItemInfo storeItemInfo = JsonConvert.DeserializeObject<JStoreItemInfo>(_storeItemInfo);
            //Thay đổi hình ảnh hiển thị của Linh thú, Sân đấu, Chưởng lực được trang bị
            switch ((JStoreItemClass)Enum.Parse(typeof(JStoreItemClass), storeItemInfo.itemClass))
            {
                case JStoreItemClass.Tactician:
                    StoreManager.instance.tacticianEquip = storeItemInfo;
                    LobbyManager.instance.GetComponentInChildren<Lobby_MyPlayerInfo>().btnTactician.transform.GetChild(0).GetComponent<Image>().sprite = Resources.Load<Sprite>("textures/tacticians/" + storeItemInfo.background);
                    break;
                case JStoreItemClass.ArenaSkin:
                    StoreManager.instance.arenaSkinEquip = storeItemInfo;
                    LobbyManager.instance.GetComponentInChildren<Lobby_MyPlayerInfo>().btnArenaSkin.transform.GetChild(0).GetComponent<Image>().sprite = Resources.Load<Sprite>("textures/tacticians/" + storeItemInfo.background);
                    break;
                case JStoreItemClass.Boom:
                    StoreManager.instance.boomEquip = storeItemInfo;
                    LobbyManager.instance.GetComponentInChildren<Lobby_MyPlayerInfo>().btnBoom.transform.GetChild(0).GetComponent<Image>().sprite = Resources.Load<Sprite>("textures/tacticians/" + storeItemInfo.background);
                    break;
            }
        });

        SocketIO1.instance.socketManager.Socket.On<string>("equip_store_item_failure", (_failure) => {
            Debug.Log("equip_store_item_failure: " + _failure);
        });

        //Mở khóa vật phẩm thành công
        SocketIO1.instance.socketManager.Socket.On<string>("unlock_store_item_success", (_storeItemInfo) => {
            Debug.Log("unlock_store_item_success: " + _storeItemInfo);
            JStoreItemInfo storeItemInfo = JsonConvert.DeserializeObject<JStoreItemInfo>(_storeItemInfo);
            StoreManager.instance.UnlockItem(storeItemInfo);
        });

        SocketIO1.instance.socketManager.Socket.On<string>("unlock_store_item_failure", (_failure) => {
            Debug.Log("unlock_store_item_failure: " + _failure);
        });

        //Cập nhật số dư tiền tệ Vàng và Crystal
        SocketIO1.instance.socketManager.Socket.On<int, int>("update_currency", (_gold, _crystal) => {
            Debug.Log("update_currency: " + _gold + " - " + _crystal);
            StoreManager.instance.UpdateCurrency(_gold, _crystal);
        });
    }

    #region Emit (gửi sự kiện)
    public void Emit_GetStore()
    {
        SocketIO1.instance.socketManager.Socket.Emit("get_store");
    }

    public void Emit_EquipStoreItem(JStoreItemInfo storeItemInfo)
    {
        SocketIO1.instance.socketManager.Socket.Emit("equip_store_item", storeItemInfo.itemId);
    }

    public void Emit_UnlockStoreItem(JStoreItemInfo storeItemInfo)
    {
        SocketIO1.instance.socketManager.Socket.Emit("unlock_store_item", storeItemInfo.itemId);
    }
    #endregion
}

[Serializable]
public class JStoreItemInfo
{
    public string itemId;
    public string itemClass;
    public string name;
    public string background;
    public JStoreItemPrice price;
}

public enum JStoreItemClass
{
    Tactician,
    ArenaSkin,
    Boom
}

[Serializable]
public class JStoreItemPrice
{
    public int gold;
    public int crystal;
}

[Serializable]
public class JInventory
{
    public string uid;
    public int gold;
    public int crystal;
    public string[] tacticianUnlocked;
    public string[] arenaSkinUnlocked;
    public string[] boomUnlocked;
    public string tacticianEquip;
    public string arenaSkinEquip;
    public string boomEquip;
}