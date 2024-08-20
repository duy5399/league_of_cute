using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;


public class FriendRequest : FriendSlot
{
    [SerializeField] private Button btnAccept;
    [SerializeField] private Button btnDecline;

    protected override void Awake()
    {
        base.Awake();
        btnAccept = this.transform.GetChild(4).GetComponent<Button>();
        btnDecline = this.transform.GetChild(5).GetComponent<Button>();
    }


    private void OnEnable()
    {
        btnAccept.onClick.AddListener(OnClick_AcceptRequest);
        btnDecline.onClick.AddListener(OnClick_DeclineRequest);
    }

    private void OnDisable()
    {
        btnAccept.onClick.RemoveListener(OnClick_AcceptRequest);
        btnDecline.onClick.RemoveListener(OnClick_DeclineRequest);
    }

    public void OnClick_AcceptRequest()
    {
        //SocketIO1.instance._friendSocketIO.Emit_AccpectRequestWaitingResponse(requestInfo);
    }

    public void OnClick_DeclineRequest()
    {
        //SocketIO1.instance._friendSocketIO.Emit_DeclineRequestWaitingResponse(userInfo.username);
    }
}
