using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using static BestHTTP.SecureProtocol.Org.BouncyCastle.Asn1.Cmp.Challenge;


public class RankedManager : MonoBehaviour
{
    //public static RankedManager instance { get; private set; }

    //[SerializeField] private Dropdown dropdown;
    //[SerializeField] private ScrollRect scrollRect;
    //[SerializeField] private Image imgCurrentRanking;
    //[SerializeField] private TextMeshProUGUI txtCurrentRaking;
    //[SerializeField] private TextMeshProUGUI txtCurrentPoints;
    //[SerializeField] private GameObject prefabSlotRanked;

    //private void Awake()
    //{
    //    if (instance != null && instance != this)
    //        Destroy(this);
    //    else
    //        instance = this;
    //    this.gameObject.SetActive(false);
    //}

    //private void OnEnable()
    //{
    //    SocketIO.instance.rankedSocketIO.Emit_GetCurrentMyRanking();
    //    SocketIO.instance.rankedSocketIO.Emit_GetRanked("Challenger");
    //}

    //private void OnDisable()
    //{
        
    //}
    //private void Start()
    //{
    //    dropdown.onValueChanged.AddListener(delegate { DropdownSelected(); });
    //}

    //public void DropdownSelected()
    //{
    //    int index = dropdown.value;
    //    string rank = string.Empty;
    //    switch (index)
    //    {
    //        case 0:
    //            rank = "Challenger"; break;
    //        case 1:
    //            rank = "Grandmaster"; break;
    //        case 2:
    //            rank = "Master"; break;
    //        case 3:
    //            rank = "Diamond"; break;
    //        case 4:
    //            rank = "Platinum"; break;
    //        case 5:
    //            rank = "Gold"; break;
    //        case 6:
    //            rank = "Silver"; break;
    //        case 7:
    //            rank = "Bronze"; break;
    //    }
    //    Debug.Log(rank);
    //    SocketIO.instance.rankedSocketIO.Emit_GetRanked(rank);
    //}

    //public void SetBoardRanked(PlayerDataLoadingJSON[] rankedData)
    //{
    //    int child = 0;
    //    foreach (var data in rankedData)
    //    {
    //        if (child < scrollRect.content.childCount)
    //        {
    //            scrollRect.content.GetChild(child).GetComponent<Slot_RankedManager>().SetTxtTOP(child + 1);
    //            scrollRect.content.GetChild(child).GetComponent<Slot_RankedManager>().SetTxtUsername(data.username);
    //            scrollRect.content.GetChild(child).GetComponent<Slot_RankedManager>().SetTxtRanking(data.rank);
    //            scrollRect.content.GetChild(child).GetComponent<Slot_RankedManager>().SetTxtPoints(data.points);
    //        }
    //        else
    //        {
    //            GameObject obj = Instantiate(prefabSlotRanked, scrollRect.content);
    //            obj.GetComponent<Slot_RankedManager>().SetTxtTOP(child + 1);
    //            obj.GetComponent<Slot_RankedManager>().SetTxtUsername(data.username);
    //            obj.GetComponent<Slot_RankedManager>().SetTxtRanking(data.rank);
    //            obj.GetComponent<Slot_RankedManager>().SetTxtPoints(data.points);
    //        }
    //        child++;
    //    }
    //    for(int i = scrollRect.content.childCount - 1; i >= child; i--)
    //    {
    //        Destroy(scrollRect.content.GetChild(i).gameObject);
    //    }
    //}

    //public void SetImgCurrentRanking(string currentRanking)
    //{
    //    switch (currentRanking)
    //    {
    //        case "Bronze":
    //            imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Bronze");
    //            break;
    //        case "Silver":
    //            imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Silver");
    //            break;
    //        case "Gold":
    //            imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Gold");
    //            break;
    //        case "Platinum":
    //            imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Platinum");
    //            break;
    //        case "Diamond":
    //            imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Diamond");
    //            break;
    //        case "Master":
    //            imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Master");
    //            break;
    //        case "Grandmaster":
    //            imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Grandmaster");
    //            break;
    //        case "Challenger":
    //            imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Challenger");
    //            break;
    //    }
    //}
    //public void SetTxtRanking(string currentRanking)
    //{
    //    switch (currentRanking)
    //    {
    //        case "Bronze":
    //            txtCurrentRaking.text = "Đồng";
    //            break;
    //        case "Silver":
    //            txtCurrentRaking.text = "Bạc";
    //            break;
    //        case "Gold":
    //            txtCurrentRaking.text = "Vàng";
    //            break;
    //        case "Platinum":
    //            txtCurrentRaking.text = "Bạch Kim";
    //            break;
    //        case "Diamond":
    //            txtCurrentRaking.text = "Kim Cương";
    //            break;
    //        case "Master":
    //            txtCurrentRaking.text = "Cao Thủ";
    //            break;
    //        case "Grandmaster":
    //            txtCurrentRaking.text = "Đại Cao Thủ";
    //            break;
    //        case "Challenger":
    //            txtCurrentRaking.text = "Thách Đấu";
    //            break;
    //    }
    //}
    //public void SetTxtPoints(int points)
    //{
    //    txtCurrentPoints.text = points.ToString();
    //}
}

public enum Rank
{
    Bronze,
    Silver,
    Gold,
    Platinum,
    Diamond,
    Master,
    Grandmaster,
    Challenger
}
