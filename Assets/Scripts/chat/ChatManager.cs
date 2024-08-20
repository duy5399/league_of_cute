using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ChatManager : MonoBehaviour
{
    [SerializeField] protected Transform tfChatView;
    [SerializeField] protected TMP_InputField inputMsg;
    [SerializeField] protected Button btnSendMsg;

    protected virtual void OnEnable()
    {
        inputMsg.text = string.Empty;
        btnSendMsg.onClick.AddListener(OnClick_SendMsg);
    }

    protected virtual void OnDisable()
    {
        inputMsg.text = string.Empty;
        btnSendMsg.onClick.RemoveListener(OnClick_SendMsg);
    }

    protected virtual void OnClick_SendMsg()
    {
        if (inputMsg.text == string.Empty)
        {
            return;
        }
    }

    public virtual void SendMsg()
    {

    }

    public virtual void ReceiveMsg()
    {

    }
}

public enum ChatChannel
{
    World,
    InRoom,
    Private
}
