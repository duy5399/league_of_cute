using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class WorldChatManager : ChatManager
{
    public static WorldChatManager instance { get; private set; }

    private void Awake()
    {
        if (instance != null && instance != this)
        {
            Destroy(this);
        }
        else
        {
            instance = this;
        }
        tfChatView = this.transform.GetChild(0).GetChild(1).GetComponent<ScrollRect>().content;
        inputMsg = this.transform.GetChild(1).GetChild(0).GetComponent<TMP_InputField>();
        btnSendMsg = this.transform.GetChild(1).GetChild(1).GetComponent<Button>();
    }

    protected override void OnEnable()
    {
        base.OnEnable();
    }

    protected override void OnDisable()
    {
        base.OnDisable();
    }

    protected override void OnClick_SendMsg()
    {
        base.OnClick_SendMsg();
        SocketIO1.instance.chatIO.Emit_SendMsg(inputMsg.text, ChatChannel.World);
    }

    public override void SendMsg()
    {
        GameObject myChatObjPath = Resources.Load<GameObject>("prefabs/chat/MyChatMessage");
        GameObject myChatObj = Instantiate(myChatObjPath, tfChatView);
        //Set thông tin lần lượt: avatar, khung, tên hiển thị, cấp độ, nội dung tin nhắn
        //myChatObj.transform.GetChild(0).GetComponent<Image>().sprite = ;
        //myChatObj.transform.GetChild(1).GetComponent<Image>().sprite = ;
        //myChatObj.transform.GetChild(2).GetComponent<TextMeshProUGUI>().text = ;
        //myChatObj.transform.GetChild(3).GetComponent<TextMeshProUGUI>().text = ;
        //myChatObj.transform.GetChild(5).GetComponent<TextMeshProUGUI>().text = ;
    }

    public override void ReceiveMsg()
    {
        GameObject otherChatObjPath = Resources.Load<GameObject>("prefabs/chat/OtherChatMessage");
        GameObject otherChatObj = Instantiate(otherChatObjPath, tfChatView);
        //Set thông tin lần lượt: avatar, khung, tên hiển thị, cấp độ, nội dung tin nhắn
        //otherChatObj.transform.GetChild(0).GetComponent<Image>().sprite = ;
        //otherChatObj.transform.GetChild(1).GetComponent<Image>().sprite = ;
        //otherChatObj.transform.GetChild(2).GetComponent<TextMeshProUGUI>().text = ;
        //otherChatObj.transform.GetChild(3).GetComponent<TextMeshProUGUI>().text = ;
        //otherChatObj.transform.GetChild(5).GetComponent<TextMeshProUGUI>().text = ;
    }
}
