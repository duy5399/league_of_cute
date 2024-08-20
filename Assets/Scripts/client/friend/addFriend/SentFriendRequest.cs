using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class SentFriendRequest : FriendSlot
{
    [SerializeField] private Button btnCancel;

    protected override void Awake()
    {
        base.Awake();
        btnCancel = this.transform.GetChild(4).GetComponent<Button>();
    }

    private void OnEnable()
    {
        btnCancel.onClick.AddListener(OnClick_CancelRequest);
    }

    private void OnDisable()
    {
        btnCancel.onClick.RemoveListener(OnClick_CancelRequest);
    }

    public override void Info(JPlayerInfo requestInfo)
    {
        base.Info(requestInfo);
    }

    void OnClick_CancelRequest()
    {
        //SocketIO1.instance..Emit_CancelFriendRequest(requestInfo.nickname);
    }
}
