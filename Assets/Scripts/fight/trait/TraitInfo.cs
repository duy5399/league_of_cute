using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class TraitInfo : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler
{
    public JTrait jTrait;
    public int currBreakpoint;
    public int breakpointActive;
    [SerializeField] private Image imgBorder;
    [SerializeField] private Image imgIcon;
    [SerializeField] private TextMeshProUGUI txtCurrBreakpoint;
    [SerializeField] private TextMeshProUGUI txtNameTrait;
    [SerializeField] private TextMeshProUGUI txtBreakpoint;

    private void Awake()
    {
        currBreakpoint = 0;
        breakpointActive = 0;
        imgBorder = this.transform.GetChild(1).GetComponent<Image>();
        imgIcon = this.transform.GetChild(2).GetComponent<Image>();
        txtCurrBreakpoint = this.transform.GetChild(0).GetChild(0).GetChild(0).GetComponent<TextMeshProUGUI>();
        txtNameTrait = this.transform.GetChild(0).GetChild(1).GetChild(0).GetComponent<TextMeshProUGUI>();
        txtBreakpoint = this.transform.GetChild(0).GetChild(1).GetChild(1).GetComponent<TextMeshProUGUI>();
    }
    public void Info(JTrait jTrait, int currBreakpoint)
    {
        this.jTrait = jTrait;
        this.currBreakpoint = currBreakpoint;
        SetImgBorder();
        SetImgIcon();
        SetTxtCurrBreakpoint();
        SetTxtNameTrait();
        SetBreakpoint();
    }

    public void UpdateCurrBreakpoint(int currBreakpoint)
    {
        this.currBreakpoint = currBreakpoint;
        SetTxtCurrBreakpoint();
        SetImgIcon();
        SetImgBorder();
    }

    public void SetImgBorder()
    {
        if (currBreakpoint < jTrait.breakpoint[0])
        {
            this.imgBorder.sprite = Resources.Load<Sprite>("textures/traits/traits_border_none");
            breakpointActive = 0;
        }
        else if (currBreakpoint >= jTrait.breakpoint[jTrait.breakpoint.Length - 1])
        {
            this.imgBorder.sprite = Resources.Load<Sprite>("textures/traits/traits_border_gold");
            breakpointActive = 3;
        }
        else if (currBreakpoint >= jTrait.breakpoint[0] && currBreakpoint < jTrait.breakpoint[1])
        {
            if (jTrait.breakpoint.Length == 2)
            {
                this.imgBorder.sprite = Resources.Load<Sprite>("textures/traits/traits_border_silver");
                breakpointActive = 2;
            }
            else
            {
                this.imgBorder.sprite = Resources.Load<Sprite>("textures/traits/traits_border_bronze");
                breakpointActive = 1;
            }
        }
        else
        {
            this.imgBorder.sprite = Resources.Load<Sprite>("textures/traits/traits_border_silver");
            breakpointActive = 2;
        }
    }
    public void SetImgIcon()
    {
        imgIcon.sprite = Resources.Load<Sprite>("textures/traits/" + jTrait.traitIcon);
        if (currBreakpoint < jTrait.breakpoint[0])
        {
            imgIcon.color = Color.gray;
        }
        else
        {
            imgIcon.color = Color.black;
        }
    }
    public void SetTxtCurrBreakpoint()
    {
        txtCurrBreakpoint.text = currBreakpoint.ToString();
    }
    public void SetTxtNameTrait()
    {
        txtNameTrait.text = jTrait.traitName;
    }
    public void SetBreakpoint()
    {
        txtBreakpoint.text = jTrait.breakpoint[0].ToString();
        for (int i = 1; i < jTrait.breakpoint.Length; i++)
        {
            txtBreakpoint.text += " > " + jTrait.breakpoint[i].ToString();
        }
    }

    public void OnPointerEnter(PointerEventData eventData)
    {
        TraitDescriptionManager.instance.DisplayTraitInfo(true, jTrait, currBreakpoint);
    }
    public void OnPointerExit(PointerEventData eventData)
    {
        TraitDescriptionManager.instance.DisplayTraitInfo(false);
    }
}
