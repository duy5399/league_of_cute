using BestHTTP.JSON;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class UnitShopIO : MonoBehaviour
{
    private void Start()
    {
        UnitShopIOStart();
    }

    public void UnitShopIOStart()
    {
        SocketIO1.instance.socketManager.Socket.On<string>("refresh_unit_shop_success", (_unitShop) => {
            Debug.Log("refresh_unit_shop_success: " + _unitShop);
            List<JUnitState> unitShop = JsonConvert.DeserializeObject<List<JUnitState>>(_unitShop);
            if (unitShop == null)
            {
                return;
            }
            UnitShopManager.instance.RefreshUnitShop(unitShop);
        });

        SocketIO1.instance.socketManager.Socket.On<string>("refresh_unit_shop_failure", (failure) => {
            Debug.Log("refresh_unit_shop_failure: " + failure);
        });

        SocketIO1.instance.socketManager.Socket.On<bool>("lock_unit_shop_success", (islock) => {
            Debug.Log("lock_unit_shop_success: " + islock);
            UnitShopManager.instance.LockUnitShop(islock);
        });

        SocketIO1.instance.socketManager.Socket.On<int>("buy_unit_success", (index) => {
            Debug.Log("buy_unit_success: " + index);
            UnitShopManager.instance.BuySuccess(index);
        });

        SocketIO1.instance.socketManager.Socket.On<string>("buy_unit_failure", (failure) => {
            Debug.Log("buy_unit_failure: " + failure);
        });

        //Cập nhật số vàng trong unitshop
        SocketIO1.instance.socketManager.Socket.On<int, int>("new_round", (stage, round) => {
            Debug.Log("new_round: " + stage + round);

        });

        //Cập nhật level
        SocketIO1.instance.socketManager.Socket.On<int>("level_up", (level) => {
            Debug.Log("level_up: " + level);

        });

        //Cập nhật số vàng trong unitshop
        SocketIO1.instance.socketManager.Socket.On<int>("update_gold", (gold) => {
            Debug.Log("update_gold: " + gold);
            UnitShopManager.instance.UpdateGold(gold);
        });

        //Cập nhật tỉ lệ roll
        SocketIO1.instance.socketManager.Socket.On<string>("change_rolling_odds", (_rollingOdds) => {
            Debug.Log("change_rolling_odds: " + _rollingOdds);
            JRollingOdds rollingOdds = JsonConvert.DeserializeObject<JRollingOdds>(_rollingOdds);
            UnitShopManager.instance.UpdateRollingOdds(rollingOdds);
        });
    }

    #region Emit (gửi sự kiện)
    public void Emit_RefreshUnitShop()
    {
        SocketIO1.instance.socketManager.Socket.Emit("refresh_unit_shop");
    }

    public void Emit_LockUnitShop()
    {
        SocketIO1.instance.socketManager.Socket.Emit("lock_unit_shop");
    }

    public void Emit_BuyUnit(int index)
    {
        SocketIO1.instance.socketManager.Socket.Emit("buy_unit", index);
    }

    public void Emit_SellUnit(JUnitState jUnitState)
    {
        SocketIO1.instance.socketManager.Socket.Emit("sell_unit", jUnitState);
    }
    #endregion
}

//Tỉ lệ roll tướng
[Serializable]
public class JRollingOdds
{
    public int tier1;
    public int tier2;
    public int tier3;
    public int tier4;
    public int tier5;
}


[Serializable]
public class JUnitState
{
    public string networkId;
    public string unitId;
    public string unitName;
    public int tier;
    public string background;
    public int level;
    public int buyPrice;
    public int sellPrice;
    public float attackDamage;
    public int attackRange;
    public float aspd;
    public float abilityPower;
    public float critRate;
    public float critDamage;
    public float arPen;
    public float arPenPer;
    public float mrPen;
    public float mrPenPer;
    public float hp;
    public float maxHP;
    public float sp;
    public float maxSP;
    public float moveSpd;
    public float ar;
    public float mr;
    public float hpRegen;
    public float spRegen;
    public float physicalVamp;
    public float spellVamp;
    public float shield;
    public bool dead;
    public string[] classes;
    public string[] origins;
    public string status;
    public string onArea;
    public string currTileId;
    public float[] currTileXY;
    public float[] position;
    public float[] rotation;
    public string tag;
    public JUnitAbility? ability;
}

[Serializable]
public class JUnitAbility
{
    public string skillIcon;
    public string skillName;
    public string skillDescription;
}

[Serializable]
public class JUnit
{
    public JUnitState state;
}