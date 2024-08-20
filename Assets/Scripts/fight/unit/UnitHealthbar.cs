using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class UnitHealthbar : MonoBehaviour
{
    [SerializeField] protected Canvas healthbar;
    [SerializeField] protected RectTransform rectMaxHP;
    [SerializeField] protected RectTransform rectHP;

    [SerializeField] private List<GameObject> lst_FloatingTextPopup = new List<GameObject>();

    protected virtual void Awake()
    {
        healthbar = this.GetComponentInChildren<Canvas>();
        rectMaxHP = (RectTransform)healthbar.transform.GetChild(0);
        rectHP = (RectTransform)healthbar.transform.GetChild(0).GetChild(0);
    }

    protected virtual void Start()
    {

    }


    protected virtual void Update()
    {
        //healthbar.transform.LookAt(Camera.main.transform, Vector3.up);
        healthbar.transform.LookAt(new Vector3(this.transform.position.x, Camera.main.transform.position.y, Camera.main.transform.position.z));
        UpdateHP();
    }

    protected virtual void UpdateHP()
    {
        
    }

    protected virtual void UpdateShield()
    {
        
    }

    protected virtual void UpdateSP()
    {
        
    }

    public virtual void Level(int level)
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

    public void SetDamagePopup(float value, ColorStyle1 valueStyle)
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
public enum ColorStyle1
{
    PhysicalDamage = 0,
    MagicalDamage = 1,
    CriticalDamage = 2,
    TrueDamage = 3,
    Heal = 4,
    Miss = 5
}