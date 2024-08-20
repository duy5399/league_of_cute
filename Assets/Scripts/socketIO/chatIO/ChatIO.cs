using BestHTTP.Examples;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ChatIO : MonoBehaviour
{
    private void Start()
    {
        ChatIOStart();
    }

    #region On (lắng nghe sự kiện)
    public void ChatIOStart()
    {
        #region Đăng nhập

        #endregion
    }
    #endregion

    #region Emit (gửi sự kiện)
    public void Emit_SendMsg(string msg, ChatChannel channel, string uid = null)
    {
        SocketIO1.instance.socketManager.Socket.Emit("create_character", msg, nameof(channel), uid);
    }
    #endregion
}
