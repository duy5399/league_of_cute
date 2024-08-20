using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class Lobby_MyPlayerInfo : PlayerInfoDisplay
{
    //Thông tin của bản thân trong phòng chờ

    [SerializeField] protected Image _imgKey;
    [SerializeField] protected Button _btnTactician;
    [SerializeField] protected Button _btnArenaSkin;
    [SerializeField] protected Button _btnBoom;

    public Image imgKey
    {
        get { return _imgKey; }
    }

    public Button btnTactician
    {
        get { return _btnTactician; }
    }

    public Button btnArenaSkin
    {
        get { return _btnArenaSkin; }
    }

    public Button btnBoom
    {
        get { return _btnBoom; }
    }

    protected override void Awake()
    {
        imgProfileImg = this.transform.GetChild(0).GetChild(0).GetComponent<Image>();
        _imgKey = this.transform.GetChild(2).GetChild(0).GetComponent<Image>();
        txtNickname = this.transform.GetChild(2).GetChild(1).GetComponent<TextMeshProUGUI>();
        imgRank = this.transform.GetChild(3).GetChild(0).GetComponent<Image>();
        txtRankAndPoints = this.transform.GetChild(3).GetChild(1).GetComponent<TextMeshProUGUI>();
        _btnTactician = this.transform.GetChild(5).GetComponent<Button>();
        _btnArenaSkin = this.transform.GetChild(6).GetComponent<Button>();
        _btnBoom = this.transform.GetChild(7).GetComponent<Button>();
    }

    private void OnEnable()
    {
        _btnTactician.onClick.AddListener(OnClick_Tactician);
        _btnArenaSkin.onClick.AddListener(OnClick_ArenaSkin);
        _btnBoom.onClick.AddListener(OnClick_Boom);
        _imgKey.gameObject.SetActive(false);
    }

    private void OnDisable()
    {
        _btnTactician.onClick.RemoveListener(OnClick_Tactician);
        _btnArenaSkin.onClick.RemoveListener(OnClick_ArenaSkin);
        _btnBoom.onClick.RemoveListener(OnClick_Boom);
        _imgKey.gameObject.SetActive(false);
    }

    public override void Info(JPlayerInfo playerInfo)
    {
        this._playerInfo = playerInfo;
        if (playerInfo.uid == LobbyManager.instance.lobbyInfo.lobbyMaster.uid)
        {
            _imgKey.gameObject.SetActive(true);
        }
        else
        {
            _imgKey.gameObject.SetActive(false);
        }
        imgProfileImg.sprite = Resources.Load<Sprite>("textures/profileImage/" + playerInfo.profileImg);
        txtNickname.text = playerInfo.nickname;
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

        //TODO: Thêm việc xử lý Linh thú, Sân đấu và Chưởng lực
    }

    void OnClick_Tactician()
    {
        StoreManager.instance.gameObject.SetActive(true);
        StoreManager.instance.btnTacticians.onClick.Invoke();
    }

    void OnClick_ArenaSkin()
    {
        StoreManager.instance.gameObject.SetActive(true);
        StoreManager.instance.btnArenaSkins.onClick.Invoke();
    }

    void OnClick_Boom()
    {
        StoreManager.instance.gameObject.SetActive(true);
        StoreManager.instance.btnBooms.onClick.Invoke();
    }
}