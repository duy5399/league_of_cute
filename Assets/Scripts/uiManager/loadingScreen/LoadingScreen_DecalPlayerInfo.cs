using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using static BestHTTP.SecureProtocol.Org.BouncyCastle.Asn1.Cmp.Challenge;

public class LoadingScreen_DecalPlayerInfo : PlayerInfoDisplay
{
    [SerializeField] private Image imgChampion;
    [SerializeField] private Image imgRankBorder;

    protected override void Awake()
    {
        imgChampion = this.transform.GetChild(0).GetChild(0).GetComponent<Image>();
        imgProfileImg = this.transform.GetChild(1).GetChild(0).GetComponent<Image>();
        imgRankBorder = this.transform.GetChild(3).GetComponent<Image>();
        imgRank = this.transform.GetChild(4).GetComponent<Image>();
        txtRankAndPoints = this.transform.GetChild(5).GetComponent<TextMeshProUGUI>();
        txtNickname = this.transform.GetChild(6).GetComponent<TextMeshProUGUI>();
    }

    public override void Info(JPlayerInfo playerInfo)
    {
        this._playerInfo = playerInfo;
        imgChampion.sprite = Resources.Load<Sprite>("textures/tacticians/" + playerInfo.tacticianEquip.background);
        imgProfileImg.sprite = Resources.Load<Sprite>("textures/profileImage/" + playerInfo.profileImg);
        imgRankBorder.sprite = Resources.Load<Sprite>("textures/rankBorder/" + playerInfo.rank);
        imgRank.sprite = Resources.Load<Sprite>("textures/rankIcon/" + playerInfo.rank);
        txtRankAndPoints.text = playerInfo.points.ToString();
        txtNickname.text = playerInfo.nickname;
    }
}
