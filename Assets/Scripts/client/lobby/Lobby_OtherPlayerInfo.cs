using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class Lobby_OtherPlayerInfo : PlayerInfoDisplay
{
    //Thông tin của người chơi khác trong phòng chờ

    [SerializeField] protected Image _imgKey;
    [SerializeField] protected Button btnKick;
    [SerializeField] private bool _isEmpty;

    public Image imgKey
    {
        get { return _imgKey; }
    }

    public bool isEmpty
    {
        get { return _isEmpty; }
    }

    protected override void Awake()
    {
        imgProfileImg = this.transform.GetChild(0).GetChild(0).GetComponent<Image>();
        _imgKey = this.transform.GetChild(2).GetChild(0).GetComponent<Image>();
        txtNickname = this.transform.GetChild(2).GetChild(1).GetComponent<TextMeshProUGUI>();
        imgRank = this.transform.GetChild(3).GetChild(0).GetComponent<Image>();
        txtRankAndPoints = this.transform.GetChild(3).GetChild(1).GetComponent<TextMeshProUGUI>();
        btnKick = this.transform.GetChild(4).GetComponent<Button>();
        _isEmpty = true;
    }

    private void OnEnable()
    {
        _imgKey.gameObject.SetActive(false);
        btnKick.gameObject.SetActive(false);
    }

    public override void Info(JPlayerInfo playerInfo)
    {
        this._playerInfo = playerInfo;
        _isEmpty = false;
        if (playerInfo.uid == LobbyManager.instance.lobbyInfo.lobbyMaster.uid)
        {
            imgKey.gameObject.SetActive(true);
        }
        else
        {
            imgKey.gameObject.SetActive(false);
        }
        if (LobbyManager.instance.myInfo.uid == LobbyManager.instance.lobbyInfo.lobbyMaster.uid)
        {
            btnKick.gameObject.SetActive(true);
        }
        else
        {
            btnKick.gameObject.SetActive(false);
        }
        imgProfileImg.gameObject.SetActive(true);
        imgProfileImg.sprite = Resources.Load<Sprite>("textures/profileImage/" + playerInfo.profileImg);
        txtNickname.text = playerInfo.nickname;
        imgRank.gameObject.SetActive(true);
        imgRank.sprite = Resources.Load<Sprite>("textures/rankIcon/" + playerInfo.rank);
        switch ((Rank)Enum.Parse(typeof(Rank), playerInfo.rank))
        {
            case Rank.Bronze:
                txtRankAndPoints.text = "Đồng " + playerInfo.points + "LP"; break;
            case Rank.Silver:
                txtRankAndPoints.text = "Bạc " + playerInfo.points + "LP"; break;
            case Rank.Gold:
                txtRankAndPoints.text = "Vàng " + playerInfo.points + "LP"; break;
            case Rank.Platinum:
                txtRankAndPoints.text = "Bạch Kim " + playerInfo.points + "LP"; break;
            case Rank.Diamond:
                txtRankAndPoints.text = "Kim Cương " + playerInfo.points + "LP"; break;
            case Rank.Master:
                txtRankAndPoints.text = "Cao Thủ " + playerInfo.points + "LP"; break;
            case Rank.Grandmaster:
                txtRankAndPoints.text = "Đại Cao Thủ " + playerInfo.points + "LP"; break;
            case Rank.Challenger:
                txtRankAndPoints.text = "Thách Đấu " + playerInfo.points + "LP"; break;
        }
    }

    public override void Clear()
    {
        this._playerInfo = null;
        _isEmpty = true;
        _imgKey.gameObject.SetActive(false);
        imgProfileImg.gameObject.SetActive(false);
        txtNickname.text = string.Empty;
        imgRank.gameObject.SetActive(false);
        txtRankAndPoints.text = string.Empty;
    }

    protected void OnClick_KickPlayer()
    {
        if (playerInfo == null || playerInfo.uid == LobbyManager.instance.lobbyInfo.lobbyMaster.uid || LobbyManager.instance.myInfo.uid != LobbyManager.instance.lobbyInfo.lobbyMaster.uid)
        {
            return;
        }

    }
}
