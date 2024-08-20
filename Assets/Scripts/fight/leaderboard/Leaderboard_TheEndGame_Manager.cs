using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using static BestHTTP.SecureProtocol.Org.BouncyCastle.Asn1.Cmp.Challenge;

public class Leaderboard_TheEndGame_Manager : MonoBehaviour
{
    public static Leaderboard_TheEndGame_Manager instance { get; private set; }

    [SerializeField] private TextMeshProUGUI txtStanding;
    [SerializeField] private Image imgCurrentRanking;
    [SerializeField] private TextMeshProUGUI txtCurrentPoint;
    [SerializeField] private Transform tfBoard;

    private void Awake()
    {
        if (instance != null && instance != this)
            Destroy(this);
        else
            instance = this;
        txtStanding = this.transform.GetChild(1).GetComponent<TextMeshProUGUI>();
        tfBoard = this.transform.GetChild(2).transform;
        imgCurrentRanking = this.transform.GetChild(3).GetComponent<Image>();
        txtCurrentPoint = this.transform.GetChild(4).GetComponent<TextMeshProUGUI>();
        this.gameObject.SetActive(false);
    }

    public void DisplayScoreboardInfo(List<JPlayerInfoScoreboard> scoreboard, JMyScoreboardInfo myInfo)
    {
        foreach (JPlayerInfoScoreboard player in scoreboard)
        {
            Debug.Log(player.ToString());
            GameObject prefab = Resources.Load<GameObject>("prefabs/fight/leaderboard/Slot_Board");
            GameObject obj = Instantiate(prefab, tfBoard);
            bool isMine = player.uid == myInfo.uid ? true : false;
            obj.GetComponent<Slot_Leaderboard_TheEndGame>().SetImgStanding(player.place);
            obj.GetComponent<Slot_Leaderboard_TheEndGame>().SetTxtStanding(player.place + 1, isMine);
            obj.GetComponent<Slot_Leaderboard_TheEndGame>().SetImgAvatar(player.profileImg);
            obj.GetComponent<Slot_Leaderboard_TheEndGame>().SetTxtPlayerName(player.nickname, isMine);
            obj.GetComponent<Slot_Leaderboard_TheEndGame>().SetArmy(player.formation);
            if (isMine)
            {
                SetTxtStanding(player.place);
            }
        }
        SetCurrentRanking(myInfo.rank);
        SetCurrentPoint(myInfo.points, myInfo.addPoint);
    }

    public void SetTxtStanding(int standing)
    {
        switch (standing)
        {
            case 0:
                txtStanding.text = "HẠNG NHẤT";
                break;
            case 1:
                txtStanding.text = "HẠNG NHÌ";
                break;
            case 2:
                txtStanding.text = "HẠNG BA";
                break;
            case 3:
                txtStanding.text = "HẠNG TƯ";
                break;
            case 4:
                txtStanding.text = "HẠNG NĂM";
                break;
            case 5:
                txtStanding.text = "HẠNG SÁU";
                break;
            case 6:
                txtStanding.text = "HẠNG BẢY";
                break;
            case 7:
                txtStanding.text = "HẠNG TÁM";
                break;
        }
    }

    public void SetCurrentRanking(string currentRanking)
    {
        switch(currentRanking)
        {
            case "Bronze":
                imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Bronze");
                break;
            case "Silver":
                imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Silver");
                break;
            case "Gold":
                imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Gold");
                break;
            case "Platinum":
                imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Platinum");
                break;
            case "Diamond":
                imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Diamond");
                break;
            case "Master":
                imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Master");
                break;
            case "Grandmaster":
                imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Grandmaster");
                break;
            case "Challenger":
                imgCurrentRanking.sprite = Resources.Load<Sprite>("textures/rankIcon/Season_2023_-_Challenger");
                break;
        }
    }

    public void SetCurrentPoint(int currentPoint, int addPoint)
    {
        if(addPoint > 0)
        {
            txtCurrentPoint.text = currentPoint.ToString() + "<color=green> (+" + addPoint.ToString() + ")</color>";
        }
        else
        {
            txtCurrentPoint.text = currentPoint.ToString() + "<color=red> (-" + addPoint.ToString() + ")</color>";
        }
    }

    public void OnClick_CloseLeaderboard()
    {
        this.gameObject.SetActive(false);
    }
}
