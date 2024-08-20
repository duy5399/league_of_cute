using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class PlayerInfoDisplay : MonoBehaviour
{
    [SerializeField] protected JPlayerInfo _playerInfo;
    [SerializeField] protected Image imgProfileImg;
    [SerializeField] protected TextMeshProUGUI txtNickname;
    [SerializeField] protected Image imgRank;
    [SerializeField] protected TextMeshProUGUI txtRankAndPoints;
    [SerializeField] protected TextMeshProUGUI txtBio;

    public JPlayerInfo playerInfo
    {
        get { return _playerInfo; }
    }

    protected virtual void Awake()
    {
        imgProfileImg = this.transform.GetChild(0).GetChild(0).GetComponent<Image>();
        txtNickname = this.transform.GetChild(2).GetComponent<TextMeshProUGUI>();
        txtBio = this.transform.GetChild(3).GetComponent<TextMeshProUGUI>();
    }

    public virtual void Info(JPlayerInfo playerInfo)
    {
        this._playerInfo = playerInfo;
        Debug.Log(playerInfo.profileImg);
        Debug.Log(playerInfo.nickname);
        Debug.Log(playerInfo.bio);
        //imgProfileImg.sprite = Resources.Load<Sprite>("textures/profileImage/" + playerInfo.profileImg);
        //txtNickname.text = playerInfo.nickname;
        //txtBio.text = playerInfo.bio;
    }

    public virtual void Clear()
    {

    }
}
