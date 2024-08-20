using AYellowpaper.SerializedCollections;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TMPro;
using UnityEngine;
using UnityEngine.UI;


public class StoreManager : MonoBehaviour
{
    public static StoreManager instance { get; private set; }

    [SerializeField] private JStoreItemInfo _tacticianEquip;
    [SerializeField] private JStoreItemInfo _arenaSkinEquip;
    [SerializeField] private JStoreItemInfo _boomEquip;

    [SerializeField] private JStoreItemInfo selectingItem;
    [SerializeField] private bool selectingItemIsUnlocked;

    [SerializeField] private Button _btnTacticians;
    [SerializeField] private Button _btnArenaSkins;
    [SerializeField] private Button _btnBooms;
    [SerializeField] private Transform tfContentTacticians;
    [SerializeField] private Transform tfContentArenaSkins;
    [SerializeField] private Transform tfContentBooms;
    [SerializeField] private TextMeshProUGUI txtGold;
    [SerializeField] private TextMeshProUGUI txtCrystal;

    [SerializeField] private Image imgSelectItem;
    [SerializeField] private Image imgLocked;
    [SerializeField] private TextMeshProUGUI txtItemName;
    [SerializeField] private Button btnEquip;
    [SerializeField] private Button btnUnlock;
    [SerializeField] private Button btnClose;
    [SerializeField] private SerializedDictionary<JStoreItemInfo, GameObject> dictStoreItem;

    public JStoreItemInfo tacticianEquip
    {
        get { return _tacticianEquip; }
        set { _tacticianEquip = value; }
    }

    public JStoreItemInfo arenaSkinEquip
    {
        get { return _arenaSkinEquip; }
        set { _arenaSkinEquip = value; }
    }

    public JStoreItemInfo boomEquip
    {
        get { return _boomEquip; }
        set { _boomEquip = value; }
    }
    public Button btnTacticians
    {
        get { return _btnTacticians; }
    }

    public Button btnArenaSkins
    {
        get { return _btnArenaSkins; }
    }

    public Button btnBooms
    {
        get { return _btnBooms; }
    }

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

        _btnTacticians = this.transform.GetChild(1).GetComponent<Button>();
        _btnArenaSkins = this.transform.GetChild(2).GetComponent<Button>();
        _btnBooms = this.transform.GetChild(3).GetComponent<Button>();
        tfContentTacticians = this.transform.GetChild(4).GetChild(0).GetChild(0);
        tfContentArenaSkins = this.transform.GetChild(4).GetChild(0).GetChild(1);
        tfContentBooms = this.transform.GetChild(4).GetChild(0).GetChild(2);
        txtGold = this.transform.GetChild(5).GetComponent<TextMeshProUGUI>();
        txtCrystal = this.transform.GetChild(6).GetComponent<TextMeshProUGUI>();
        imgSelectItem = this.transform.GetChild(8).GetComponent<Image>();
        imgLocked = this.transform.GetChild(9).GetComponent<Image>();
        txtItemName = this.transform.GetChild(10).GetComponent<TextMeshProUGUI>();
        btnEquip = this.transform.GetChild(11).GetComponent<Button>();
        btnUnlock = this.transform.GetChild(12).GetComponent<Button>();
        btnClose = this.transform.GetChild(13).GetComponent<Button>();
        dictStoreItem = new SerializedDictionary<JStoreItemInfo, GameObject>();
    }

    private void Start()
    {
        
    }

    private void OnEnable()
    {
        _btnTacticians.onClick.AddListener(OnClick_Tacticians);
        _btnArenaSkins.onClick.AddListener(OnClick_ArenaSkins);
        _btnBooms.onClick.AddListener(OnClick_Booms);
        btnEquip.onClick.AddListener(OnClick_Equip);
        btnUnlock.onClick.AddListener(OnClick_Unlock);
        btnClose.onClick.AddListener(OnClick_Close);
        _btnTacticians.onClick.Invoke();
    }

    private void OnDisable()
    {
        _btnTacticians.onClick.RemoveListener(OnClick_Tacticians);
        _btnArenaSkins.onClick.RemoveListener(OnClick_ArenaSkins);
        _btnBooms.onClick.RemoveListener(OnClick_Booms);
        btnEquip.onClick.RemoveListener(OnClick_Equip);
        btnUnlock.onClick.RemoveListener(OnClick_Unlock);
        btnClose.onClick.RemoveListener(OnClick_Close);
    }

    public void GetStore()
    {
        SocketIO1.instance.storeIO.Emit_GetStore();
    }

    //Thêm và hiển thị vật phẩm mới vào store
    public void AddItem(JStoreItemInfo storeItemInfo, bool unlocked = false)
    {
        GameObject storeItemObj = dictStoreItem.FirstOrDefault(x => x.Key.itemId == storeItemInfo.itemId).Value;
        if (!storeItemObj)
        {
            GameObject storeItemPath = Resources.Load<GameObject>("prefabs/store/Prefab_Item");
            storeItemObj = Instantiate(storeItemPath);
            switch ((JStoreItemClass)Enum.Parse(typeof(JStoreItemClass), storeItemInfo.itemClass))
            {
                case JStoreItemClass.Tactician:
                    storeItemObj.transform.parent = tfContentTacticians;
                    break;
                case JStoreItemClass.ArenaSkin:
                    storeItemObj.transform.parent = tfContentArenaSkins;
                    break;
                case JStoreItemClass.Boom:
                    storeItemObj.transform.parent = tfContentBooms;
                    break;
            }
            storeItemObj.transform.localScale = Vector3.one;
            dictStoreItem.Add(storeItemInfo, storeItemObj);
        }
        StoreItem storeItem = storeItemObj.GetComponent<StoreItem>();
        storeItem.Info(storeItemInfo, unlocked);
    }

    //Hiển thị thông tin vật phẩm đang được lựa chọn để xem
    public void DisplayItem(JStoreItemInfo storeItemInfo, bool unlocked)
    {
        selectingItem = storeItemInfo;
        selectingItemIsUnlocked = unlocked;
        txtItemName.text = storeItemInfo.name;
        switch ((JStoreItemClass)Enum.Parse(typeof(JStoreItemClass), storeItemInfo.itemClass))
        {
            case JStoreItemClass.Tactician:
                imgSelectItem.sprite = Resources.Load<Sprite>("textures/tacticians/" + storeItemInfo.background);
                break;
            case JStoreItemClass.ArenaSkin:
                imgSelectItem.sprite = Resources.Load<Sprite>("textures/arenaSkin/" + storeItemInfo.background);
                break;
            case JStoreItemClass.Boom:
                imgSelectItem.sprite = Resources.Load<Sprite>("textures/booms/" + storeItemInfo.background);
                break;
        }
        if (unlocked)
        {
            btnEquip.gameObject.SetActive(true);
            imgLocked.gameObject.SetActive(false);
            imgSelectItem.color = new Color32(255, 255, 255, 255);
            btnUnlock.gameObject.SetActive(false);
        }
        else
        {
            btnEquip.gameObject.SetActive(false);
            imgLocked.gameObject.SetActive(true);
            imgSelectItem.color = new Color32(113, 113, 113, 255);
            btnUnlock.gameObject.SetActive(true);
            btnUnlock.transform.GetChild(0).GetComponent<TextMeshProUGUI>().text = storeItemInfo.price.gold.ToString();
            btnUnlock.transform.GetChild(0).GetChild(0).GetComponent<Image>().sprite = Resources.Load<Sprite>("textures/store/currency_icon-gold");
        }
    }

    //Mở khóa vật phẩm
    public void UnlockItem(JStoreItemInfo storeItemInfo)
    {
        GameObject storeItemObj = dictStoreItem.FirstOrDefault(x => x.Key.itemId == storeItemInfo.itemId).Value;
        if(storeItemObj == null)
        {
            return;
        }
        StoreItem storeItem = storeItemObj.GetComponent<StoreItem>();
        storeItem.Unlock();
    }

    //Cập nhật số dư tiền tệ Vàng và Crystal
    public void UpdateCurrency(int gold, int crystal)
    {
        txtGold.text = gold.ToString();
        txtCrystal.text = crystal.ToString();
    }

    void OnClick_Tacticians()
    {
        tfContentTacticians.gameObject.SetActive(true);
        tfContentArenaSkins.gameObject.SetActive(false);
        tfContentBooms.gameObject.SetActive(false);
    }

    void OnClick_ArenaSkins()
    {
        tfContentTacticians.gameObject.SetActive(false);
        tfContentArenaSkins.gameObject.SetActive(true);
        tfContentBooms.gameObject.SetActive(false);
    }

    void OnClick_Booms()
    {
        tfContentTacticians.gameObject.SetActive(false);
        tfContentArenaSkins.gameObject.SetActive(false);
        tfContentBooms.gameObject.SetActive(true);
    }

    void OnClick_Equip()
    {
        if(selectingItem == null || selectingItemIsUnlocked == false)
        {
            return;
        }
        SocketIO1.instance.storeIO.Emit_EquipStoreItem(selectingItem);
    }

    void OnClick_Unlock()
    {
        if (selectingItem == null || selectingItemIsUnlocked == true)
        {
            return;
        }
        SocketIO1.instance.storeIO.Emit_UnlockStoreItem(selectingItem);
    }

    void OnClick_Close()
    {
        this.gameObject.SetActive(false);
    }
}
