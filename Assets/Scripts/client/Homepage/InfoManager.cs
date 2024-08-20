using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class InfoManager : MonoBehaviour
{
    //public static InfoManager instance { get; private set; }
    //[SerializeField] private UserInfoJSON myInfo;
    //[SerializeField] private UserInventoryJSON myInventory;
    //[SerializeField] private TextMeshProUGUI text_MyName;
    //[SerializeField] private TextMeshProUGUI text_MyLevel;
    //[SerializeField] private TextMeshProUGUI text_MyRank;
    //[SerializeField] private TextMeshProUGUI text_MyGold;
    //[SerializeField] private TextMeshProUGUI text_MyCrystal;
    //[SerializeField] private TMP_InputField inputField_MyStatus;
    //[SerializeField] private Image image_MyProfileImage;
    //[SerializeField] private Image image_MyRank;

    //private void Awake()
    //{
    //    if (instance != null && instance != this)
    //        Destroy(this);
    //    else
    //        instance = this;
    //}

    //void Start()
    //{
    //    myInfo = SocketIO.instance._authenticationSocketIO._userInfo;
    //    myInventory = SocketIO.instance._inventoryClientSocketIO._userInventory;
    //    SetMyName(myInfo.username);
    //    SetMyLevel(myInfo.level);
    //    SetMyRank(myInfo.rank, myInfo.points);
    //    SetMyStatus(myInfo.status);
    //    SetMyCurrencies(myInventory.gold, myInventory.crystal);
    //    SetMyProfileImage(myInfo.profileImage);
    //}

    //public void SetMyName(string name)
    //{
    //    text_MyName.text = name;
    //}

    //public void SetMyLevel(int level)
    //{
    //    text_MyLevel.text = level.ToString();
    //}

    //public void SetMyRank(string rank, int points)
    //{
    //    text_MyRank.text = rank + " | " + points.ToString();
    //    image_MyRank.sprite = Resources.Load<Sprite>("textures/rankIcon/" + rank);
    //}

    //public void SetMyCurrencies(int gold, int crystal)
    //{
    //    text_MyGold.text = gold.ToString();
    //    text_MyCrystal.text = crystal.ToString();
    //}

    //public void SetMyProfileImage(string avatar)
    //{
    //    Sprite sprite = Resources.Load<Sprite>("textures/profileImage/" + avatar);
    //    image_MyProfileImage.sprite = sprite;
    //}

    //public void SetMyStatus(string status)
    //{
    //    inputField_MyStatus.text = status;
    //} 
}
