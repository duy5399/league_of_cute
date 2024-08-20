using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ItemDescription : MonoBehaviour
{
    public static ItemDescription instance { get; private set; }

    [SerializeField] private Transform tfBackground;
    [SerializeField] private Button btnClose;
    [SerializeField] private Transform tfItemInfo;
    [SerializeField] private Image imgItemIcon;
    [SerializeField] private TextMeshProUGUI txtItemName;
    [SerializeField] private TextMeshProUGUI txtItemStats;
    [SerializeField] private TextMeshProUGUI txtItemPassive;

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
        tfBackground = this.transform.GetChild(0);
        btnClose = tfBackground.GetComponent<Button>();
        tfItemInfo = this.transform.GetChild(1);
        imgItemIcon = tfItemInfo.GetChild(0).GetChild(0).GetComponent<Image>();
        txtItemName = tfItemInfo.GetChild(0).GetChild(1).GetChild(0).GetComponent<TextMeshProUGUI>();
        txtItemStats = tfItemInfo.GetChild(0).GetChild(1).GetChild(1).GetComponent<TextMeshProUGUI>();
        txtItemPassive = tfItemInfo.GetChild(1).GetComponent<TextMeshProUGUI>();
    }

    private void OnEnable()
    {
        btnClose.onClick.AddListener(OnClick_Close);
        tfBackground.gameObject.SetActive(false);
        tfItemInfo.gameObject.SetActive(false);
    }

    private void OnDisable()
    {
        btnClose.onClick.RemoveListener(OnClick_Close);
    }

    public void DisplayItemInfo(bool isActive, JItemInfo jItemInfo = null)
    {
        tfBackground.gameObject.SetActive(isActive);
        tfItemInfo.gameObject.SetActive(isActive);
        if (!isActive || jItemInfo == null)
        {
            return;
        }
        imgItemIcon.sprite = Resources.Load<Sprite>("textures/items/" + jItemInfo.itemIcon);
        txtItemName.text = jItemInfo.itemName;
        txtItemStats.text = jItemInfo.descriptionStat;
        txtItemPassive.text = jItemInfo.descriptionPassive;
    }

    void OnClick_Close()
    {
        DisplayItemInfo(false);
    }
}
