using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ChampionHealthbar : UnitHealthbar
{
    [SerializeField] private ChampionState chState;
    [SerializeField] private RectTransform rectShield;
    [SerializeField] private RectTransform rectMaxSP;
    [SerializeField] private RectTransform rectSP;

    protected override void Awake()
    {
        base.Awake();
        chState = this.GetComponent<ChampionState>();
        rectShield = (RectTransform)healthbar.transform.GetChild(0).GetChild(1);
        rectMaxSP = (RectTransform)healthbar.transform.GetChild(1);
        rectSP = (RectTransform)healthbar.transform.GetChild(1).GetChild(0);
    }

    protected override void Start()
    {

    }

    protected override void Update()
    {
        base.Update();
        UpdateShield();
        UpdateSP();
    }

    protected override void UpdateHP()
    {
        if(chState.jUnitState.hp < 0 || chState.jUnitState.dead)
        {
            return;
        }
        float currHP = 0;
        if (chState.jUnitState.hp + chState.jUnitState.shield > chState.jUnitState.maxHP)
        {
            currHP = (float)(chState.jUnitState.hp / (float)(chState.jUnitState.hp + chState.jUnitState.shield)) * rectMaxHP.rect.width;
        }
        else
        {
            currHP = (float)(chState.jUnitState.hp / chState.jUnitState.maxHP) * rectMaxHP.rect.width;
        }
        rectHP.sizeDelta = new Vector2(currHP, rectHP.rect.height);
    }

    protected override void UpdateShield()
    {
        if (chState.jUnitState.hp < 0 || chState.jUnitState.dead)
        {
            return;
        }
        if (chState.jUnitState.shield <= 0)
        {
            rectShield.gameObject.SetActive(false);
            return;
        }
        float currShield = 0;
        if (chState.jUnitState.shield + chState.jUnitState.hp > chState.jUnitState.maxHP)
        {
            currShield = (float)(chState.jUnitState.shield / (float)(chState.jUnitState.hp + chState.jUnitState.shield)) * rectMaxHP.rect.width;
        }
        else
        {
            currShield = (float)(chState.jUnitState.shield / chState.jUnitState.maxHP) * rectMaxHP.rect.width;
        }
        rectShield.sizeDelta = new Vector2(currShield, rectHP.rect.height);
        rectShield.gameObject.SetActive(true);
    }

    protected override void UpdateSP()
    {
        if (chState.jUnitState.hp < 0 || chState.jUnitState.dead)
        {
            return;
        }
        float currSP = (float)(chState.jUnitState.sp / chState.jUnitState.maxSP) * rectMaxSP.rect.width;
        rectSP.sizeDelta = new Vector2(currSP, rectSP.rect.height);
    }

    public override void Level(int level)
    {
        switch (level)
        {
            case 0:
                healthbar.GetComponent<Image>().sprite = Resources.Load<Sprite>("textures/healthbar/healthbar-1-star");
                break;
            case 1:
                healthbar.GetComponent<Image>().sprite = Resources.Load<Sprite>("textures/healthbar/healthbar-2-star");
                break;
            case 2:
                healthbar.GetComponent<Image>().sprite = Resources.Load<Sprite>("textures/healthbar/healthbar-3-star");
                break;
        }
    }

    public void SetDamagePopup(float value, ColorStyle valueStyle)
    {
        //try
        //{
        //    GameObject floatingText = lst_FloatingTextPopup.FirstOrDefault(x => x.activeSelf == false);
        //    if (floatingText != null)
        //    {
        //        floatingText.GetComponent<FloatingTextPopupManager>().SetActive(true);
        //        floatingText.GetComponent<FloatingTextPopupManager>().SetParent(GetComponentInParent<PhotonView>().ViewID, "Weakness");
        //        floatingText.transform.localScale = Vector3.one;
        //        switch (valueStyle)
        //        {
        //            case ColorStyle.PhysicalDamage:
        //            case ColorStyle.MagicalDamage:
        //                floatingText.GetComponent<FloatingTextPopupManager>().FloatingTextJumpDown(Math.Round(value).ToString(), valueStyle);
        //                break;
        //            case ColorStyle.CriticalDamage:
        //            case ColorStyle.TrueDamage:
        //                floatingText.GetComponent<FloatingTextPopupManager>().FloatingTextDiagonalUp(Math.Round(value).ToString(), valueStyle);
        //                break;
        //            case ColorStyle.Heal:
        //                floatingText.GetComponent<FloatingTextPopupManager>().FloatingTextUp("+" + Math.Round(value).ToString(), valueStyle);
        //                break;
        //        }
        //    }
        //    else
        //    {
        //        var prefab_FloatingText = Resources.Load<GameObject>("prefabs/fight/floating-text/DamagePopup");
        //        GameObject newFloatingText = PhotonNetwork.Instantiate(Path.Combine("prefabs/fight/floating-text", prefab_FloatingText.name), transform.position, prefab_FloatingText.transform.rotation);
        //        newFloatingText.name = "DamagePopup" + base.info.chStat._id;
        //        newFloatingText.GetComponent<FloatingTextPopupManager>().SetParent(GetComponentInParent<PhotonView>().ViewID, "Weakness");
        //        newFloatingText.transform.localScale = Vector3.one;
        //        switch (valueStyle)
        //        {
        //            case ColorStyle.PhysicalDamage:
        //            case ColorStyle.MagicalDamage:
        //                newFloatingText.GetComponent<FloatingTextPopupManager>().FloatingTextJumpDown(Math.Round(value).ToString(), valueStyle);
        //                break;
        //            case ColorStyle.CriticalDamage:
        //            case ColorStyle.TrueDamage:
        //                newFloatingText.GetComponent<FloatingTextPopupManager>().FloatingTextDiagonalUp(Math.Round(value).ToString(), valueStyle);
        //                break;
        //            case ColorStyle.Heal:
        //                newFloatingText.GetComponent<FloatingTextPopupManager>().FloatingTextUp(Math.Round(value).ToString(), valueStyle);
        //                break;
        //        }
        //        lst_FloatingTextPopup.Add(newFloatingText);
        //    }
        //}
        //catch
        //{

        //}
    }
}
