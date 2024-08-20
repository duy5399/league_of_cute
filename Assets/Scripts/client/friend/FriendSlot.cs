using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class FriendSlot : MonoBehaviour
{
    [SerializeField] protected JPlayerInfo requestInfo;
    [SerializeField] protected Image imgProfileImg;
    [SerializeField] protected TextMeshProUGUI txtNickname;
    [SerializeField] protected TextMeshProUGUI txtBio;

    protected virtual void Awake()
    {
        imgProfileImg = this.transform.GetChild(0).GetChild(0).GetComponent<Image>();
        txtNickname = this.transform.GetChild(2).GetComponent<TextMeshProUGUI>();
        txtBio = this.transform.GetChild(3).GetComponent<TextMeshProUGUI>();
    }

    public virtual void Info(JPlayerInfo requestInfo)
    {
        this.requestInfo = requestInfo;
        Debug.Log(requestInfo.profileImg);
        Debug.Log(requestInfo.nickname);
        Debug.Log(requestInfo.bio);
        //imgProfileImg.sprite = Resources.Load<Sprite>("textures/profileImage/" + requestInfo.profileImg);
        //txtNickname.text = requestInfo.nickname;
        //txtBio.text = requestInfo.bio;
    }
}
