using System;
using System.Collections;
using System.Collections.Generic;
using System.Xml.Linq;
using TMPro;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.UI;

public class UnitDescriptionManager : MonoBehaviour
{
    public static UnitDescriptionManager instance { get; private set; }

    [SerializeField] private Transform tfBackground;
    [SerializeField] private Button btnClose;

    [SerializeField] private Transform tfUnitDescription;
    [SerializeField] private Image imgUnitIcon;
    [SerializeField] private Image imgLevel;
    [SerializeField] private Image imgSkillIcon;
    [SerializeField] private Image imgItem1;
    [SerializeField] private Image imgItem2;
    [SerializeField] private Image imgItem3;
    [SerializeField] private TextMeshProUGUI txtUnitName;
    [SerializeField] private Slider sliderHp;
    [SerializeField] private Slider sliderSp;
    [SerializeField] private TextMeshProUGUI txtHp;
    [SerializeField] private TextMeshProUGUI txtSp;
    [SerializeField] private Image imgClassIcon;
    [SerializeField] private TextMeshProUGUI txtClassName;
    [SerializeField] private Image imgOriginIcon;
    [SerializeField] private TextMeshProUGUI txtOriginName;
    [SerializeField] private TextMeshProUGUI txtAdStat;
    [SerializeField] private TextMeshProUGUI txtApStat;
    [SerializeField] private TextMeshProUGUI txtArStat;
    [SerializeField] private TextMeshProUGUI txtMrStat;
    [SerializeField] private TextMeshProUGUI txtAspdStat;
    [SerializeField] private TextMeshProUGUI txtAtkRangeStat;
    [SerializeField] private TextMeshProUGUI txtCritRateStat;
    [SerializeField] private TextMeshProUGUI txtCritDmgStat;

    private void Awake()
    {
        if (instance != null && instance != this)
            Destroy(this);
        else
            instance = this;

        tfBackground = this.transform.GetChild(0);
        btnClose = tfBackground.GetComponent<Button>();

        tfUnitDescription = transform.GetChild(1);
        imgUnitIcon = tfUnitDescription.GetChild(0).GetComponent<Image>();
        imgLevel = tfUnitDescription.GetChild(1).GetComponent<Image>();
        imgSkillIcon = tfUnitDescription.GetChild(2).GetComponent<Image>();
        imgItem1 = tfUnitDescription.GetChild(3).GetComponent<Image>();
        imgItem2 = tfUnitDescription.GetChild(4).GetComponent<Image>();
        imgItem3 = tfUnitDescription.GetChild(5).GetComponent<Image>();
        txtUnitName = tfUnitDescription.GetChild(6).GetComponent<TextMeshProUGUI>();
        sliderHp = tfUnitDescription.GetChild(7).GetComponent<Slider>();
        sliderSp = tfUnitDescription.GetChild(8).GetComponent<Slider>();
        txtHp = tfUnitDescription.GetChild(9).GetComponent<TextMeshProUGUI>();
        txtSp = tfUnitDescription.GetChild(10).GetComponent<TextMeshProUGUI>();
        imgClassIcon = tfUnitDescription.GetChild(11).GetComponent<Image>();
        txtClassName = tfUnitDescription.GetChild(12).GetComponent<TextMeshProUGUI>();
        imgOriginIcon = tfUnitDescription.GetChild(13).GetComponent<Image>();
        txtOriginName = tfUnitDescription.GetChild(14).GetComponent<TextMeshProUGUI>();
        txtAdStat = tfUnitDescription.GetChild(17).GetComponent<TextMeshProUGUI>();
        txtApStat = tfUnitDescription.GetChild(19).GetComponent<TextMeshProUGUI>();
        txtArStat = tfUnitDescription.GetChild(21).GetComponent<TextMeshProUGUI>();
        txtMrStat = tfUnitDescription.GetChild(23).GetComponent<TextMeshProUGUI>();
        txtAspdStat = tfUnitDescription.GetChild(25).GetComponent<TextMeshProUGUI>();
        txtAtkRangeStat = tfUnitDescription.GetChild(27).GetComponent<TextMeshProUGUI>();
        txtCritRateStat = tfUnitDescription.GetChild(29).GetComponent<TextMeshProUGUI>();
        txtCritDmgStat = tfUnitDescription.GetChild(31).GetComponent<TextMeshProUGUI>();
    }

    public Transform unitDescription
    {
        get { return tfUnitDescription; }
        set { tfUnitDescription = value; }
    }

    private void Start()
    {
        
    }

    private void OnEnable()
    {
        btnClose.onClick.AddListener(OnClick_Close);
        tfBackground.gameObject.SetActive(false);
        tfUnitDescription.gameObject.SetActive(false);
    }

    private void OnDisable()
    {
        imgItem1.sprite = null;
        imgItem1.color = new Color32(118, 118, 118, 255);
        imgItem2.sprite = null;
        imgItem2.color = new Color32(118, 118, 118, 255);
        imgItem3.sprite = null;
        imgItem3.color = new Color32(118, 118, 118, 255);
        btnClose.onClick.RemoveListener(OnClick_Close);
    }

    public void DisplayUnitDescription(bool isActive, ChampionState chState = null)
    {
        tfBackground.gameObject.SetActive(isActive);
        tfUnitDescription.gameObject.SetActive(isActive);
        if (!isActive || chState == null)
        {
            return;
        }
        SetImgUnitIcon(chState.jUnitState.background);
        SetImgLevel(chState.jUnitState.level);
        SetImgSkillIcon(chState.jUnitState.ability.skillIcon);
        SetTxtName(chState.jUnitState.unitName);
        SetHp((int)chState.jUnitState.hp, (int)chState.jUnitState.maxHP);
        SetSp((int)chState.jUnitState.sp, (int)chState.jUnitState.maxSP);
        SetClassesOrigins(chState.jUnitState.classes, imgClassIcon, txtClassName);
        SetClassesOrigins(chState.jUnitState.origins, imgOriginIcon, txtOriginName);
        txtAdStat.text = chState.jUnitState.attackDamage.ToString();
        txtApStat.text = chState.jUnitState.abilityPower.ToString();
        txtArStat.text = chState.jUnitState.ar.ToString();
        txtMrStat.text = chState.jUnitState.mr.ToString();
        txtAspdStat.text = chState.jUnitState.aspd.ToString();
        txtAtkRangeStat.text = chState.jUnitState.attackRange.ToString();
        txtCritRateStat.text = (int)(chState.jUnitState.critRate * 100) + "%";
        txtCritDmgStat.text = (int)(chState.jUnitState.critDamage * 100) + "%";
        imgSkillIcon.GetComponent<DetectSkillDescription>().jUnitState = chState.jUnitState;
        List<GameObject> itemLst = chState.gameObject.GetComponent<UnitItem>().itemObj;
        for (int i = 0; i < itemLst.Count; i++)
        {
            JItemBase jItemBase = itemLst[i].GetComponent<ItemBase1>().jItemBase;
            switch (i)
            {
                case 0:
                    imgItem1.sprite = Resources.Load<Sprite>("textures/items/" + jItemBase.itemInfo.itemIcon);
                    imgItem1.color = new Color32(255, 255, 255, 255);
                    imgItem1.GetComponent<DetectItemDescription>().jItemBase = jItemBase; 
                    break;
                case 1:
                    imgItem2.sprite = Resources.Load<Sprite>("textures/items/" + jItemBase.itemInfo.itemIcon);
                    imgItem2.color = new Color32(255, 255, 255, 255);
                    imgItem2.GetComponent<DetectItemDescription>().jItemBase = jItemBase; 
                    break;
                case 2:
                    imgItem3.sprite = Resources.Load<Sprite>("textures/items/" + jItemBase.itemInfo.itemIcon);
                    imgItem3.color = new Color32(255, 255, 255, 255);
                    imgItem3.GetComponent<DetectItemDescription>().jItemBase = jItemBase; 
                    break;
            }
        }
    }

    public void SetImgUnitIcon(string unitIcon)
    {
        imgUnitIcon.sprite = Resources.Load<Sprite>("textures/cardBig/" + unitIcon); ;
    }

    public void SetImgLevel(int level)
    {
        imgLevel.sprite = Resources.Load<Sprite>("textures/hub/unit-des-" + level + "-star");
    }

    public void SetImgSkillIcon(string skillIcon = null)
    {
        if (skillIcon == null)
        {
            imgSkillIcon.sprite = null;
            imgSkillIcon.color = new Color32(118, 118, 118, 255);
        }
        else
        {
            imgSkillIcon.sprite = Resources.Load<Sprite>("textures/heroSkill/" + skillIcon);
            imgSkillIcon.color = new Color32(255, 255, 255, 255);
        }
    }

    public void SetClassesOrigins(string[] trait, Image icon, TextMeshProUGUI name)
    {
        for (int i = 0; i < trait.Length; i++)
        {
            switch ((TraitId)Enum.Parse(typeof(TraitId), trait[i]))
            {
                case TraitId.Ranger:
                    icon.sprite = Resources.Load<Sprite>("textures/traits/trait_icon_ranger");
                    name.text = "Cung Thủ";
                    break;
                case TraitId.Assassin:
                    icon.sprite = Resources.Load<Sprite>("textures/traits/trait_icon_assassin");
                    name.text = "Sát Thủ";
                    break;
                case TraitId.Brawler:
                    icon.sprite = Resources.Load<Sprite>("textures/traits/trait_icon_brawler");
                    name.text = "Đấu Sĩ";
                    break;
                case TraitId.Mystic:
                    icon.sprite = Resources.Load<Sprite>("textures/traits/trait_icon_mystic");
                    name.text = "Bí Ẩn";
                    break;
                case TraitId.Defender:
                    icon.sprite = Resources.Load<Sprite>("textures/traits/trait_icon_defender");
                    name.text = "Hộ Vệ";
                    break;
                case TraitId.Sorcerer:
                    icon.sprite = Resources.Load<Sprite>("textures/traits/trait_icon_sorcerer");
                    name.text = "Pháp Sư";
                    break;
                case TraitId.Skirmisher:
                    icon.sprite = Resources.Load<Sprite>("textures/traits/trait_icon_skirmisher");
                    name.text = "Chiến Binh";
                    break;
                case TraitId.Mascot:
                    icon.sprite = Resources.Load<Sprite>("textures/traits/trait_icon_mascot");
                    name.text = "Linh Vật";
                    break;
                case TraitId.Hextech:
                    icon.sprite = Resources.Load<Sprite>("textures/traits/trait_icon_hextech");
                    name.text = "Công Nghệ";
                    break;
                case TraitId.Yordle:
                    icon.sprite = Resources.Load<Sprite>("textures/traits/trait_icon_yordle");
                    name.text = "Yordle";
                    break;
                case TraitId.Nightbringer:
                    icon.sprite = Resources.Load<Sprite>("textures/traits/trait_icon_nightbringer");
                    name.text = "Ma Sứ";
                    break;
                case TraitId.Dawnbringer:
                    icon.sprite = Resources.Load<Sprite>("textures/traits/trait_icon_dawnbringer");
                    name.text = "Thần Sứ";
                    break;
                case TraitId.Duelist:
                    icon.sprite = Resources.Load<Sprite>("textures/traits/trait_icon_duelist");
                    name.text = "Song Đấu";
                    break;
            }
        }
    }

    public void SetImageItem1(string item = null)
    {
        if(item == null)
        {
            imgItem1.sprite = null;
            imgItem1.color = new Color32(118, 118, 118, 255);
        }
        else
        {
            var sprite = Resources.Load<Sprite>("textures/items/" + item);
            imgItem1.sprite = sprite;
            imgItem1.color = new Color32(255, 255, 255, 255);
        }
    }

    public void SetImageItem2(string item = null)
    {
        if (item == null)
        {
            imgItem2.sprite = null;
            imgItem2.color = new Color32(118, 118, 118, 255);
        }
        else
        {
            var sprite = Resources.Load<Sprite>("textures/items/" + item);
            imgItem2.sprite = sprite;
            imgItem2.color = new Color32(255, 255, 255, 255);
        }
    }
    public void SetImageItem3(string item = null)
    {
        if (item == null)
        {
            imgItem3.sprite = null;
            imgItem3.color = new Color32(118, 118, 118, 255);
        }
        else
        {
            var sprite = Resources.Load<Sprite>("textures/items/" + item);
            imgItem3.sprite = sprite;
            imgItem3.color = new Color32(255, 255, 255, 255);
        }
    }

    public void SetTxtName(string unitName)
    {
        txtUnitName.text = unitName;
    }

    public void SetHp(int currHp, int maxHp)
    {
        sliderHp.value = (float)currHp / maxHp;
        txtHp.text = currHp.ToString() + "/" + maxHp.ToString();
    }

    public void SetSp(int currSp, int maxSp)
    {
        sliderSp.value = (float)currSp / maxSp;
        txtSp.text = currSp.ToString() + "/" + maxSp.ToString();
    }
    void OnClick_Close()
    {
        DisplayUnitDescription(false);
    }
}
