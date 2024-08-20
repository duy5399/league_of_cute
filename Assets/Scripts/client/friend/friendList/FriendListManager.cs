using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;


public class FriendListManager : MonoBehaviour
{
    public static FriendListManager instance { get; private set; }

    [SerializeField] private Button btnAddFriend;
    [SerializeField] private Button btnFriendRequests;
    [SerializeField] private Button btnFilter;
    [SerializeField] private Transform tfFriendList;

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

        btnAddFriend = this.transform.GetChild(2).GetComponent<Button>();
        btnFriendRequests = this.transform.GetChild(3).GetComponent<Button>();
        btnFilter = this.transform.GetChild(4).GetComponent<Button>();
        tfFriendList = this.transform.GetChild(5).GetComponent<ScrollRect>().content;
    }

    private void OnEnable()
    {
        btnAddFriend.onClick.AddListener(OnClick_AddFriend);
        btnFriendRequests.onClick.AddListener(OnClick_FriendRequests);
    }

    private void OnDisable()
    {
        btnAddFriend.onClick.RemoveListener(OnClick_AddFriend);
        btnFriendRequests.onClick.RemoveListener(OnClick_FriendRequests);
    }

    //Lấy danh sách bạn bè
    public void GetFriendList()
    {
        Debug.Log("getFriendList");
        SocketIO1.instance.friendIO.Emit_GetFriendList();
    }

    //Hiển thị thông tin bạn bè
    public void AddFriendList(JPlayerInfo friendInfo)
    {
        GameObject friendSlotPath = Resources.Load<GameObject>("prefabs/friend/friendList/Friend");
        GameObject friendSlot = Instantiate(friendSlotPath, tfFriendList);
        Friend friend = friendSlot.GetComponent<Friend>();
        friend.Info(friendInfo);
    }

    void OnClick_AddFriend()
    {
        AddFriendManager.instance.gameObject.SetActive(true);
    }

    void OnClick_FriendRequests()
    {
        FriendRequestsManager.instance.gameObject.SetActive(true);
    }
}
