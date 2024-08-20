using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TMPro;
using Unity.Multiplayer.Tools.NetStats;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.UI;

public class UnitShopManager : MonoBehaviour
{
    public static UnitShopManager instance { get; private set; }

    [SerializeField] private Button btnRefreshShop;
    [SerializeField] private TextMeshProUGUI txtOddsTier1;
    [SerializeField] private TextMeshProUGUI txtOddsTier2;
    [SerializeField] private TextMeshProUGUI txtOddsTier3;
    [SerializeField] private TextMeshProUGUI txtOddsTier4;
    [SerializeField] private TextMeshProUGUI txtOddsTier5;
    [SerializeField] private TextMeshProUGUI txtGold;
    [SerializeField] private Button btnLockShop;
    [SerializeField] private bool lockUnitShop;

    [SerializeField] private List<GameObject> lstShopItem;

    [SerializeField] private Transform tfSellUnit;
    [SerializeField] private TextMeshProUGUI txtSellPrice;

    private void Awake()
    {
        if (instance != null && instance != this)
        {
            Destroy(this);
        }
        else
        {
            instance = this;
        }

        btnRefreshShop = this.transform.GetChild(0).GetComponent<Button>();
        txtOddsTier1 = this.transform.GetChild(1).GetComponent<TextMeshProUGUI>();
        txtOddsTier2 = this.transform.GetChild(2).GetComponent<TextMeshProUGUI>();
        txtOddsTier3 = this.transform.GetChild(3).GetComponent<TextMeshProUGUI>();
        txtOddsTier4 = this.transform.GetChild(4).GetComponent<TextMeshProUGUI>();
        txtOddsTier5 = this.transform.GetChild(5).GetComponent<TextMeshProUGUI>();
        txtGold = this.transform.GetChild(6).GetComponent<TextMeshProUGUI>();
        btnLockShop = this.transform.GetChild(7).GetComponent<Button>();
        lstShopItem = new List<GameObject>();
        lockUnitShop = false;
        for (int i = 0; i < 5; i++)
        {
            GameObject shopItemObj = this.transform.GetChild(8 + i).gameObject;
            shopItemObj.GetComponent<UnitShopItem>().index = i;
            lstShopItem.Add(shopItemObj);
        }
        tfSellUnit = this.transform.GetChild(13);
        txtSellPrice = this.transform.GetChild(13).GetChild(0).GetComponent<TextMeshProUGUI>();
    }

    private void OnEnable()
    {
        tfSellUnit.gameObject.SetActive(false);
        btnRefreshShop.onClick.AddListener(OnClick_RefreshUnitShop);
        btnLockShop.onClick.AddListener(OnClick_LockUnitShop);
    }

    private void OnDisable()
    {
        btnRefreshShop.onClick.RemoveListener(OnClick_RefreshUnitShop);
        btnLockShop.onClick.RemoveListener(OnClick_LockUnitShop);
    }

    //Làm mới shop thành công
    public void RefreshUnitShop(List<JUnitState> unitShop)
    {
        for (int i = 0; i < unitShop.Count; i++)
        {
            Debug.Log(unitShop[i].ability.skillDescription);
            UnitShopItem unitShopItem = lstShopItem[i].GetComponent<UnitShopItem>();
            unitShopItem.Info(unitShop[i]);
            unitShopItem.gameObject.SetActive(true);
        }
    }

    //Khóa shop thành công
    public void LockUnitShop(bool isLock)
    {
        if (isLock)
        {
            btnLockShop.GetComponent<Image>().sprite = Resources.Load<Sprite>("textures/unitShop/scene-battle_lock-shop");
        }
        else
        {
            btnLockShop.GetComponent<Image>().sprite = Resources.Load<Sprite>("textures/unitShop/scene-battle_open-shop");
        }
    }

    //Cập nhật số vàng hiện có
    public void UpdateGold(int gold)
    {
        txtGold.text = gold.ToString();
    }

    //Cập nhật tỉ lệ làm mới tướng
    public void UpdateRollingOdds(JRollingOdds rollingOdds)
    {
        txtOddsTier1.text = rollingOdds.tier1.ToString() + "%";
        txtOddsTier2.text = rollingOdds.tier2.ToString() + "%";
        txtOddsTier3.text = rollingOdds.tier3.ToString() + "%";
        txtOddsTier4.text = rollingOdds.tier4.ToString() + "%";
        txtOddsTier5.text = rollingOdds.tier5.ToString() + "%";
    }

    public void ActiveSellUnit(bool isActive, ChampionState champion = null)
    {
        if (champion)
        {
            txtSellPrice.text = "Bán được " + champion.jUnitState.sellPrice.ToString() + " vàng";
        }
        tfSellUnit.gameObject.SetActive(isActive);
    }

    public void BuySuccess(int index)
    {
        GameObject unitShopItemObj = lstShopItem.FirstOrDefault(x => x.GetComponent<UnitShopItem>().index == index);
        if (!unitShopItemObj)
        {
            return;
        }
        UnitShopItem unitShopItem = unitShopItemObj.GetComponent<UnitShopItem>();
        unitShopItem.BuySuccess();
    }

    void OnClick_RefreshUnitShop()
    {
        if (lockUnitShop)
        {
            return;
        }
        SocketIO1.instance.unitShopIO.Emit_RefreshUnitShop();
    }

    public void OnClick_LockUnitShop()
    {
        lockUnitShop = !lockUnitShop;
        SocketIO1.instance.unitShopIO.Emit_LockUnitShop();
    }

    public void BuyUnitSuccess(string slot)
    {
        //switch (slot)
        //{
        //    case "slot0":
        //        list_tf_Unit[0].gameObject.SetActive(false); break;
        //    case "slot1":
        //        list_tf_Unit[1].gameObject.SetActive(false); break;
        //    case "slot2":
        //        list_tf_Unit[2].gameObject.SetActive(false); break;
        //    case "slot3":
        //        list_tf_Unit[3].gameObject.SetActive(false); break;
        //    case "slot4":
        //        list_tf_Unit[4].gameObject.SetActive(false); break;
        //}
        //UnitShopManager.instance.ActiveSkillDescription(false, null, null, null);
    }


    public void ActiveSkillDescription(bool isActive, Sprite skillIcon, string skillName, string skillDescription)
    {
        //if (isActive)
        //{
        //    img_SkillIcon.sprite = skillIcon;
        //    text_SkillName.text = skillName;
        //    text_SkillDescription.text = skillDescription;
        //}
        //tf_UnitSkill.gameObject.SetActive(isActive);
    }

    public enum SlotUnitShop
    {
        slot0 = 0,
        slot1 = 1,
        slot2 = 2,
        slot3 = 3,
        slot4 = 4,
    }
}
