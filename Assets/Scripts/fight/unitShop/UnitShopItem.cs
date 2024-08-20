using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class UnitShopItem : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler
{
    public int index;
    [SerializeField] private JUnitState jUnitState;
    [SerializeField] private Image imgBackground;
    [SerializeField] private Image imgBorder;
    [SerializeField] private TextMeshProUGUI txtChampionName;
    [SerializeField] private TextMeshProUGUI txtCost;
    [SerializeField] private Image imgClass;
    [SerializeField] private TextMeshProUGUI txtClass;
    [SerializeField] private Image imgOrigin;
    [SerializeField] private TextMeshProUGUI txtOrigin;
    [SerializeField] private Button btnBuy;

    private void Awake()
    {
        imgBackground = this.transform.GetChild(0).GetComponent<Image>();
        imgBorder = this.transform.GetChild(1).GetComponent<Image>();
        txtChampionName = this.transform.GetChild(2).GetComponent<TextMeshProUGUI>();
        txtCost = this.transform.GetChild(3).GetComponent<TextMeshProUGUI>();
        imgClass = this.transform.GetChild(4).GetComponent<Image>();
        txtClass = this.transform.GetChild(5).GetComponent<TextMeshProUGUI>();
        imgOrigin = this.transform.GetChild(6).GetComponent<Image>();
        txtOrigin = this.transform.GetChild(7).GetComponent<TextMeshProUGUI>();
        btnBuy = this.GetComponent<Button>();
    }

    private void OnEnable()
    {
        btnBuy.onClick.AddListener(OnClick_BuyUnit);
    }

    private void OnDisable()
    {
        btnBuy.onClick.RemoveListener(OnClick_BuyUnit);
    }

    public void Info(JUnitState jUnitState)
    {
        this.jUnitState = jUnitState;
        switch (jUnitState.tier)
        {
            case 1:
                imgBorder.sprite = Resources.Load<Sprite>("textures/borderUnit/Gray");
                break;
            case 2:
                imgBorder.sprite = Resources.Load<Sprite>("textures/borderUnit/Green");
                break;
            case 3:
                imgBorder.sprite = Resources.Load<Sprite>("textures/borderUnit/Blue");
                break;
            case 4:
                imgBorder.sprite = Resources.Load<Sprite>("textures/borderUnit/Purple");
                break;
            case 5:
                imgBorder.sprite = Resources.Load<Sprite>("textures/borderUnit/Gold");
                break;
        }
        imgBackground.sprite = Resources.Load<Sprite>("textures/cardBig/" + jUnitState.background);
        txtChampionName.text = jUnitState.unitName;
        txtCost.text = jUnitState.buyPrice.ToString();
        UnitDescriptionManager.instance.SetClassesOrigins(jUnitState.classes, imgClass, txtClass);
        UnitDescriptionManager.instance.SetClassesOrigins(jUnitState.origins, imgOrigin, txtOrigin);
    }

    public void BuySuccess()
    {
        jUnitState = null;
        this.gameObject.SetActive(false);
    }

    public void OnClick_BuyUnit()
    {
        if(jUnitState == null)
        {
            return;
        }
        SocketIO1.instance.unitShopIO.Emit_BuyUnit(index);
        SkillDescription.instance.DisplaySkillInfo(false);
    }

    public void OnPointerEnter(PointerEventData eventData)
    {
        SkillDescription.instance.DisplaySkillInfo(true, jUnitState);
    }

    public void OnPointerExit(PointerEventData eventData)
    {
        SkillDescription.instance.DisplaySkillInfo(false);
    }
}
