using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class Slot_RankedManager : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI txtTop;
    [SerializeField] private TextMeshProUGUI txtUsername;
    [SerializeField] private TextMeshProUGUI txtRanking;
    [SerializeField] private TextMeshProUGUI txtPoints;

    public void SetTxtTOP(int top)
    {
        txtTop.text = top.ToString();
    }
    public void SetTxtUsername(string username)
    {
        txtUsername.text = username;
    }
    public void SetTxtRanking(string ranking)
    {
        switch (ranking)
        {
            case "Bronze":
                txtRanking.text = "Đồng";
                break;
            case "Silver":
                txtRanking.text = "Bạc";
                break;
            case "Gold":
                txtRanking.text = "Vàng";
                break;
            case "Platinum":
                txtRanking.text = "Bạch Kim";
                break;
            case "Diamond":
                txtRanking.text = "Kim Cương";
                break;
            case "Master":
                txtRanking.text = "Cao Thủ";
                break;
            case "Grandmaster":
                txtRanking.text = "Đại Cao Thủ";
                break;
            case "Challenger":
                txtRanking.text = "Thách Đấu";
                break;
        }
    }
    public void SetTxtPoints(int points)
    {
        txtPoints.text = points.ToString();
    }
}
