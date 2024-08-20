using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class TacticianHealthbar : UnitHealthbar
{
    [SerializeField] private TacticianState tacticianState;
    [SerializeField] private TextMeshProUGUI txtNickname;
    [SerializeField] private TextMeshProUGUI txtLevel;

    protected override void Awake()
    {
        tacticianState = this.GetComponent<TacticianState>();
        healthbar = this.GetComponentInChildren<Canvas>();
        rectMaxHP = (RectTransform)healthbar.transform.GetChild(1);
        rectHP = (RectTransform)healthbar.transform.GetChild(1).GetChild(0);
        txtNickname = healthbar.transform.GetChild(2).GetComponent<TextMeshProUGUI>();
        txtLevel = healthbar.transform.GetChild(3).GetComponent<TextMeshProUGUI>();
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

    public void Nickname(string name)
    {
        txtNickname.text = name;
    }

    protected override void UpdateHP()
    {
        if (tacticianState.jTacticianState.hp < 0 || tacticianState.jTacticianState.dead)
        {
            return;
        }
        float currHP = (tacticianState.jTacticianState.hp / tacticianState.jTacticianState.maxHP) * rectMaxHP.rect.width;
        rectHP.sizeDelta = new Vector2(currHP, rectHP.rect.height);
    }

    protected override void UpdateShield()
    {
        
    }

    protected override void UpdateSP()
    {
        
    }

    public override void Level(int level)
    {
        txtLevel.text = level.ToString();
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

