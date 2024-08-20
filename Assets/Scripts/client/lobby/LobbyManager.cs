using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class LobbyManager : MonoBehaviour
{
    public static LobbyManager instance { get; private set; }

    [SerializeField] private JLobbyInfo _lobbyInfo;
    public JPlayerInfo myInfo;
    [SerializeField] private TextMeshProUGUI txtLobbyId;
    [SerializeField] private Button btnStart;
    [SerializeField] private Button btnCancel;
    [SerializeField] private List<GameObject> lstPlayerInfoObj;

    [SerializeField] private float timeFindMatch;

    public JLobbyInfo lobbyInfo
    {
        get { return _lobbyInfo; }
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

        txtLobbyId = this.transform.GetChild(4).GetComponent<TextMeshProUGUI>();
        btnStart = this.transform.GetChild(5).GetComponent<Button>();
        btnCancel = this.transform.GetChild(6).GetComponent<Button>();
        lstPlayerInfoObj = new List<GameObject>()
        {
            this.transform.GetChild(0).gameObject,
            this.transform.GetChild(1).gameObject,
            this.transform.GetChild(2).gameObject,
            this.transform.GetChild(3).gameObject,
        };
    }

    private void OnEnable()
    {
        _lobbyInfo = null;
        txtLobbyId.text = string.Empty;
        btnStart.onClick.AddListener(OnClick_Start);
        btnCancel.onClick.AddListener(OnClick_Cancel);
    }

    private void OnDisable()
    {
        _lobbyInfo = null;
        txtLobbyId.text = string.Empty;
        btnStart.onClick.RemoveListener(OnClick_Start);
        btnCancel.onClick.RemoveListener(OnClick_Cancel);
        for (int i = 1; i < lstPlayerInfoObj.Count; i++)
        {
            Lobby_OtherPlayerInfo otherPlayerInfoDisplay = lstPlayerInfoObj[i].GetComponent<Lobby_OtherPlayerInfo>();
            otherPlayerInfoDisplay.Clear();
        }
    }

    private void FixedUpdate()
    {
        if ((LobbyStatus)Enum.Parse(typeof(LobbyStatus), lobbyInfo.lobbyStatus) == LobbyStatus.FindingMatch)
        {
            timeFindMatch += Time.fixedDeltaTime;
            btnStart.transform.GetChild(0).GetComponent<TextMeshProUGUI>().text = "ĐANG TÌM TRẬN " + DisplayTime(timeFindMatch);
        }
    }

    //Set thông tin phòng game
    public void Info(JLobbyInfo lobbyInfo, JPlayerInfo myInfo)
    {
        this._lobbyInfo = lobbyInfo;
        this.myInfo = myInfo;
        txtLobbyId.text = "#" + lobbyInfo.lobbyId;
        foreach(JPlayerInfo playerInfo in lobbyInfo.playerList)
        {
            if (playerInfo.uid == myInfo.uid)
            {
                lstPlayerInfoObj[0].GetComponent<PlayerInfoDisplay>().Info(playerInfo);
            }
            else
            {
                OtherPlayerJoinLobby(playerInfo);
            }
        }
    }

    //Hiển thị thông tin người chơi khác khi họ tham gia phòng thành công
    public void OtherPlayerJoinLobby(JPlayerInfo playerInfo)
    {
        for (int j = 1; j < 4; j++)
        {
            Lobby_OtherPlayerInfo otherPlayerInfoDisplay = lstPlayerInfoObj[j].GetComponent<Lobby_OtherPlayerInfo>();
            if (otherPlayerInfoDisplay.isEmpty == false)
            {
                continue;
            }
            otherPlayerInfoDisplay.Info(playerInfo);
            break;
        }
    }

    //Xóa thông tin người chơi khác khi họ thoát khỏi phòng
    public void OtherPlayerLeaveLobby(JLobbyInfo lobbyInfo, JPlayerInfo playerInfo)
    {
        this._lobbyInfo = lobbyInfo;
        for (int j = 1; j < 4; j++)
        {
            Lobby_OtherPlayerInfo otherPlayerInfoDisplay = lstPlayerInfoObj[j].GetComponent<Lobby_OtherPlayerInfo>();
            //Xóa thông tin tại vị trí mà người chơi rời đi
            if (otherPlayerInfoDisplay.isEmpty == false && otherPlayerInfoDisplay.playerInfo.uid == playerInfo.uid)
            {
                otherPlayerInfoDisplay.Clear();
            }
            //Kiểm tra các người chơi còn lại xem ai là RoomMaster mới thì hiển thị Key để nhận biết
            else
            {
                if(otherPlayerInfoDisplay.isEmpty == false && otherPlayerInfoDisplay.playerInfo.uid == lobbyInfo.lobbyMaster.uid)
                {
                    otherPlayerInfoDisplay.imgKey.gameObject.SetActive(true);
                }
            }
        }
        Lobby_MyPlayerInfo myPlayerInfoDisplay = lstPlayerInfoObj[0].GetComponent<Lobby_MyPlayerInfo>();
        if (myPlayerInfoDisplay.playerInfo.uid == lobbyInfo.lobbyMaster.uid)
        {
            myPlayerInfoDisplay.imgKey.gameObject.SetActive(true);
        }
    }

    //Bắt đầu tìm trận
    public void StartFindingMatch(string lobbyStatus)
    {
        _lobbyInfo.lobbyStatus = lobbyStatus;
        timeFindMatch = 0;
        btnStart.interactable = false;
    }

    //Hủy tìm trận
    public void StopFindingMatch(string lobbyStatus)
    {
        _lobbyInfo.lobbyStatus = lobbyStatus;
        timeFindMatch = 0;
        btnStart.interactable = true;
        btnStart.transform.GetChild(0).GetComponent<TextMeshProUGUI>().text = "TÌM TRẬN";
    }

    //Hiển thị thời gian dưới dạng: mm:ss
    private string DisplayTime(float time)
    {
        int minutes = (int)time / 60;
        int seconds = (int)time % 60;
        return string.Format("{0:00}:{1:00}", minutes, seconds);
    }


    //Tìm trận đấu
    public void OnClick_Start()
    {
        Lobby_MyPlayerInfo myPlayerInfoDisplay = lstPlayerInfoObj[0].GetComponent<Lobby_MyPlayerInfo>();
        if ((LobbyStatus)Enum.Parse(typeof(LobbyStatus), lobbyInfo.lobbyStatus) != LobbyStatus.None || myPlayerInfoDisplay.playerInfo.uid != lobbyInfo.lobbyMaster.uid)
        {
            return;
        }
        SocketIO1.instance.lobbyIO.Emit_StartFindMatch();
    }

    //Thoát khỏi phòng hoặc hủy việc tìm kiếm trận đấu
    void OnClick_Cancel()
    {
        if ((LobbyStatus)Enum.Parse(typeof(LobbyStatus), lobbyInfo.lobbyStatus) == LobbyStatus.None)
        {
            SocketIO1.instance.lobbyIO.Emit_LeaveLobby();
        }
        else if((LobbyStatus)Enum.Parse(typeof(LobbyStatus), lobbyInfo.lobbyStatus) == LobbyStatus.FindingMatch)
        {
            SocketIO1.instance.lobbyIO.Emit_StopFindMatch();
        }
    }
}