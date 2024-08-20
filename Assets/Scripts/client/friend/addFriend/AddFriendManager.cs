using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class AddFriendManager : MonoBehaviour
{
    public static AddFriendManager instance { get; private set; }

    [SerializeField] private TMP_InputField inputFriendName;
    [SerializeField] private Button btnSend;
    [SerializeField] private Button btnClose;
    [SerializeField] private Button btnDone;
    [SerializeField] private Transform tfSentRequests;
    [SerializeField] private TextMeshProUGUI _txtAlert;

    public TextMeshProUGUI txtAlert
    {
        get { return _txtAlert; } 
        set { _txtAlert = value;}
    }

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

        inputFriendName = this.transform.GetChild(1).GetComponent<TMP_InputField>();
        btnSend = this.transform.GetChild(2).GetComponent<Button>();
        btnClose = this.transform.GetChild(3).GetComponent<Button>();
        btnDone = this.transform.GetChild(4).GetComponent<Button>();
        tfSentRequests = this.transform.GetChild(5).GetComponent<ScrollRect>().content;
        txtAlert = this.transform.GetChild(6).GetComponent<TextMeshProUGUI>();
    }

    private void OnEnable()
    {
        inputFriendName.text = string.Empty;
        btnSend.onClick.AddListener(OnClick_AddFriend);
        btnClose.onClick.AddListener(OnClick_Close);
        btnDone.onClick.AddListener(OnClick_Close);
        txtAlert.text = string.Empty;
    }

    private void OnDisable()
    {
        inputFriendName.text = string.Empty;
        btnSend.onClick.RemoveListener(OnClick_AddFriend);
        btnClose.onClick.RemoveListener(OnClick_Close);
        btnDone.onClick.RemoveListener(OnClick_Close);
        txtAlert.text = string.Empty;
    }

    //Lấy danh sách lời mời kết bạn của bản thân đã gửi đi
    public void GetSentRequests()
    {
        Debug.Log("GetSentRequests");
        SocketIO1.instance.friendIO.Emit_GetSentRequests();
    }

    //Hiển thị yêu cầu kết bạn mà bản thân đã gửi đi
    public void AddSentFriendRequest(JPlayerInfo requestInfo)
    {
        GameObject sentFriendRequestPath = Resources.Load<GameObject>("prefabs/friend/addFriend/SentFriendRequest");
        GameObject sentFriendRequestObj = Instantiate(sentFriendRequestPath, tfSentRequests);
        SentFriendRequest sendFriendRequest = sentFriendRequestObj.GetComponent<SentFriendRequest>();
        sendFriendRequest.Info(requestInfo);
    }

    //Gửi yêu cầu kết bạn
    void OnClick_AddFriend()
    {
        if (inputFriendName.text == string.Empty)
        {
            return;
        }
        SocketIO1.instance.friendIO.Emit_SendFriendRequest(inputFriendName.text);
    }

    void OnClick_Close()
    {
        this.gameObject.SetActive(false);
    }
}
