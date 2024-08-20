using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class Friend : FriendSlot, IPointerEnterHandler, IPointerExitHandler
{
    [SerializeField] private Image imgActive;

    protected override void Awake()
    {
        base.Awake();
    }

    public override void Info(JPlayerInfo friendInfo)
    {
        base.Info(friendInfo);
    }

    public void SetImageStatus(bool isOnline)
    {
        if (isOnline)
            imgActive.color = new Color(2, 158, 61);
        else
            imgActive.color = new Color(161, 155, 141);
    }

    public void OnPointerEnter(PointerEventData eventData)
    {
        //InfoFriendManager.instance.ActiveInfoFriend(true, userInfo);
    }

    public void OnPointerExit(PointerEventData eventData)
    {
        //InfoFriendManager.instance.ActiveInfoFriend(false, null);
    }
}
