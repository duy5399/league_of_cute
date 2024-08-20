using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;


public class StoreItem : MonoBehaviour
{
    [SerializeField] private JStoreItemInfo _storeItemInfo;
    [SerializeField] private bool unlocked;
    [SerializeField] private Image imgBackground;
    [SerializeField] private Image imgLocked;
    [SerializeField] private Button btnSelect;

    public JStoreItemInfo storeItemInfo
    {
        get { return _storeItemInfo; }
    }

    private void Awake()
    {
        imgBackground = this.transform.GetChild(0).GetChild(0).GetComponent<Image>();
        imgLocked = this.transform.GetChild(2).GetComponent<Image>();
        btnSelect = this.GetComponent<Button>();
    }

    private void OnEnable()
    {
        btnSelect.onClick.AddListener(OnClick_Select);
    }

    private void OnDisable()
    {
        btnSelect.onClick.RemoveListener(OnClick_Select);
    }

    //Hiển thị thông tin vật phẩm
    public void Info(JStoreItemInfo storeItemInfo, bool unlocked = false)
    {
        this._storeItemInfo = storeItemInfo;
        this.unlocked = unlocked;
        switch ((JStoreItemClass)Enum.Parse(typeof(JStoreItemClass), storeItemInfo.itemClass))
        {
            case JStoreItemClass.Tactician:
                imgBackground.sprite = Resources.Load<Sprite>("textures/tacticians/" + storeItemInfo.background);
                break;
            case JStoreItemClass.ArenaSkin:
                imgBackground.sprite = Resources.Load<Sprite>("textures/arenaSkin/" + storeItemInfo.background);
                break;
            case JStoreItemClass.Boom:
                imgBackground.sprite = Resources.Load<Sprite>("textures/booms/" + storeItemInfo.background);
                break;
        }
        if(!unlocked)
        {
            imgLocked.gameObject.SetActive(true);
            imgBackground.color = new Color32(113, 113, 113, 255);
            return;
        }
        imgLocked.gameObject.SetActive(false);
    }

    //Mở khóa vật phẩm
    public void Unlock()
    {
        unlocked = true;
        imgBackground.color = new Color32(255, 255, 255, 255);
        imgLocked.gameObject.SetActive(false);
    }

    public void OnClick_Select()
    {
        StoreManager.instance.DisplayItem(_storeItemInfo, unlocked);
    }
}
