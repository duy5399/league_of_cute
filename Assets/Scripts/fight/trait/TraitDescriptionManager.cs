using System.Collections;
using System.Collections.Generic;
using TMPro;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class TraitDescriptionManager : MonoBehaviour
{
    public static TraitDescriptionManager instance { get; private set; }

    [SerializeField] private Transform tfDescription;
    [SerializeField] private Image imgIcon;
    [SerializeField] private TextMeshProUGUI txtName;
    [SerializeField] private TextMeshProUGUI txtDescription;
    [SerializeField] private TextMeshProUGUI txtBreakpoint;
    [SerializeField] private Transform tfComposition;
    [SerializeField] private List<GameObject> lstComposition;

    private void Awake()
    {
        if (instance != null && instance != this)
            Destroy(this);
        else
            instance = this;

        tfDescription = this.transform.GetChild(0);
        imgIcon = tfDescription.GetChild(0).GetChild(0).GetComponent<Image>();
        txtName = tfDescription.GetChild(0).GetChild(1).GetComponent<TextMeshProUGUI>();
        txtDescription = tfDescription.GetChild(1).GetComponent<TextMeshProUGUI>();
        txtBreakpoint = tfDescription.GetChild(2).GetComponent<TextMeshProUGUI>();
        tfComposition = tfDescription.GetChild(3);

        lstComposition = new List<GameObject>();
        for(int i = 0; i < tfComposition.childCount; i++)
        {
            lstComposition.Add(tfComposition.GetChild(i).gameObject);
        }
    }

    private void OnEnable()
    {
        tfDescription.gameObject.SetActive(false);
    }

    public void DisplayTraitInfo(bool isActive, JTrait jTrait = null, int currBreakpoint = 0)
    {
        Debug.Log("DisplayTraitInfo: " + jTrait);
        tfDescription.gameObject.SetActive(isActive);
        if (!isActive || jTrait == null)
        {
            return;
        }
        imgIcon.sprite = Resources.Load<Sprite>("textures/traits/" + jTrait.traitIcon);
        txtName.text = jTrait.traitName;
        txtDescription.text = jTrait.description;
        SetTextBreakpoint(jTrait.breakpoint, jTrait.detailBreakpoint, currBreakpoint);
        SetComposition(jTrait.composition);
    }

    public void SetImageIcon(string icon)
    {
        var sprite = Resources.Load<Sprite>("textures/traits/" + icon);
        imgIcon.sprite = sprite;
    }
    public void SetTextName(string traitName)
    {
        txtName.text = traitName;
    }
    public void SetTextDescription(string description)
    {
        txtDescription.text = description;
    }
    public void SetTextBreakpoint(int[] breakpoint, string[] detailBreakpoint, int currBreakpoint)
    {
        txtBreakpoint.text = "";
        for (int i = 0; i< breakpoint.Length; i++)
        {
            if (breakpoint[i] == currBreakpoint || (breakpoint[i] < currBreakpoint && currBreakpoint < breakpoint[i + 1]))
            {
                txtBreakpoint.text += "(" + breakpoint[i] + ") " + detailBreakpoint[i] + "\n";
            }
            else
            {
                txtBreakpoint.text += "<color=#808080>(" + breakpoint[i] + ") " + detailBreakpoint[i] + "</color>\n";
            }
        }
    }

    public void SetComposition(string[][] composition)
    {
        int i = 0;
        foreach (string[] compositionArray in composition)
        {
            var iconSprite = Resources.Load<Sprite>("textures/avatar/avatar_" + compositionArray[0]);
            var borderSprite = Resources.Load<Sprite>("textures/borderUnit/composition_border_" + compositionArray[1]);
            lstComposition[i].transform.GetChild(0).GetComponent<Image>().sprite = iconSprite;
            lstComposition[i].transform.GetChild(1).GetComponent<Image>().sprite = borderSprite;
            lstComposition[i].SetActive(true);
            i++;
        }
        for(int j = lstComposition.Count - 1; j >= i; j--)
        {
            lstComposition[j].SetActive(false);
        }
    }
}
