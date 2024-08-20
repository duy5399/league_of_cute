using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UIClientManager : MonoBehaviour
{
    public static UIClientManager instance { get; private set; }

    //Bạn bè
    [SerializeField] private FriendListManager friendManager;
    [SerializeField] private AddFriendManager addFriendManager;
    [SerializeField] private FriendRequestsManager friendRequestsManager;

    //Danh sách phòng chơi
    [SerializeField] private LobbyListManager lobbyListManager;

    //Sảnh chờ
    [SerializeField] private LobbyManager lobbyManager;

    //Cửa hàng
    [SerializeField] private StoreManager storeManager;

    //Ghép trận thành công
    [SerializeField] private MatchFound matchFound;

    //Ghép trận thành công
    [SerializeField] private Leaderboard_TheEndGame_Manager leaderboard;

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

        //GameObject mainCameraPath = Resources.Load<GameObject>("prefab/camera/Main Camera");
        //mainCamera = Instantiate(mainCameraPath);

        //Bạn bè
        GameObject friendManagerPath = Resources.Load<GameObject>("prefabs/friend/friendList/Panel_FriendList");
        friendManager = Instantiate(friendManagerPath, this.transform).GetComponent<FriendListManager>();

        GameObject addFriendManagerPath = Resources.Load<GameObject>("prefabs/friend/addFriend/Panel_AddFriend");
        addFriendManager = Instantiate(addFriendManagerPath, this.transform).GetComponent<AddFriendManager>();

        GameObject friendRequestsManagerPath = Resources.Load<GameObject>("prefabs/friend/friendRequest/Panel_FriendRequests");
        friendRequestsManager = Instantiate(friendRequestsManagerPath, this.transform).GetComponent<FriendRequestsManager>();

        addFriendManager.gameObject.SetActive(false);
        friendRequestsManager.gameObject.SetActive(false);

        //Danh sách phòng chơi
        GameObject lobbyListManagerPath = Resources.Load<GameObject>("prefabs/lobby/Panel_LobbyList");
        lobbyListManager = Instantiate(lobbyListManagerPath, this.transform).GetComponent<LobbyListManager>();

        //Sảnh chờ
        GameObject lobbyManagerPath = Resources.Load<GameObject>("prefabs/lobby/Panel_Lobby");
        lobbyManager = Instantiate(lobbyManagerPath, this.transform).GetComponent<LobbyManager>();

        lobbyManager.gameObject.SetActive(false);

        //Cửa hàng
        GameObject storeManagerPath = Resources.Load<GameObject>("prefabs/store/Panel_Store");
        storeManager = Instantiate(storeManagerPath, this.transform).GetComponent<StoreManager>();

        storeManager.gameObject.SetActive(false);

        //Ghép trận thành công
        GameObject matchFoundPath = Resources.Load<GameObject>("prefabs/lobby/Panel_MatchFound");
        matchFound = Instantiate(matchFoundPath, this.transform).GetComponent<MatchFound>();

        matchFound.gameObject.SetActive(false);

        GameObject leaderboardPath = Resources.Load<GameObject>("prefabs/scoreboard/Panel_Leaderboard");
        leaderboard = Instantiate(leaderboardPath, this.transform).GetComponent<Leaderboard_TheEndGame_Manager>();

        leaderboard.gameObject.SetActive(false);
    }
}
