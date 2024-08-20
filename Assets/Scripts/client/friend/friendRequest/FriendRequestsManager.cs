using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class FriendRequestsManager : MonoBehaviour
{
    public static FriendRequestsManager instance { get; private set; }

    [SerializeField] private Button btnClose;
    [SerializeField] private Button btnDone;
    [SerializeField] private Transform tfFriendRequests;

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

        btnClose = this.transform.GetChild(1).GetComponent<Button>();
        btnDone = this.transform.GetChild(2).GetComponent<Button>();
        tfFriendRequests = this.transform.GetChild(3).GetComponent<ScrollRect>().content;
    }

    private void OnEnable()
    {
        btnClose.onClick.AddListener(OnClick_Close);
        btnDone.onClick.AddListener(OnClick_Close);
    }

    private void OnDisable()
    {
        btnClose.onClick.RemoveListener(OnClick_Close);
        btnDone.onClick.RemoveListener(OnClick_Close);
    }

    //Lấy danh sách yêu cầu kết bạn mà bản thân nhận được
    public void GetFriendRequests()
    {
        Debug.Log("GetFriendRequests");
        SocketIO1.instance.friendIO.Emit_GetFriendRequests();
    }

    //Hiển thị yêu cầu kết bạn
    public void AddFriendRequest(JPlayerInfo requestInfo)
    {
        GameObject friendRequestPath = Resources.Load<GameObject>("prefabs/friend/friendRequest/FriendRequest");
        GameObject friendRequestObj = Instantiate(friendRequestPath, tfFriendRequests);
        FriendRequest friendRequest = friendRequestObj.GetComponent<FriendRequest>();
        friendRequest.Info(requestInfo);
    }

    void OnClick_Close()
    {
        this.gameObject.SetActive(false);
    }
}
