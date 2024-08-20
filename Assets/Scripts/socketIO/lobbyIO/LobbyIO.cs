using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LobbyIO : MonoBehaviour
{
    private void Start()
    {
        LobbyIOStart();
    }

    #region On (lắng nghe sự kiện)
    public void LobbyIOStart()
    {
    #region Lấy danh sách các phòng chờ
        SocketIO1.instance.socketManager.Socket.On<string>("get_lobby_list_success", (_lobbyList) => {
            Debug.Log("get_lobby_list_success: " + _lobbyList);
            List<JLobbyInfo> lobbyList = JsonConvert.DeserializeObject<List<JLobbyInfo>>(_lobbyList);
            //Duyệt qua từ thông tin phòng chờ và hiển thị nó
            foreach (JLobbyInfo lobbyInfo in lobbyList)
            {
                LobbyListManager.instance.UpdateLobby(lobbyInfo);
            }
        });

        SocketIO1.instance.socketManager.Socket.On<string>("get_lobby_list_failure", (failure) => {
            Debug.Log("get_lobby_list_failure: " + failure);
        });
    #endregion

    #region Tạo phòng mới thành công
        SocketIO1.instance.socketManager.Socket.On<string, string>("create_lobby_success", (_lobbyInfo, _myInfo) => {
            Debug.Log("create_lobby_success: " + _lobbyInfo);

            //Ẩn LobbyList và hiển thị và cập nhật thông tin LobbyManager
            JLobbyInfo lobbyInfo = JsonConvert.DeserializeObject<JLobbyInfo>(_lobbyInfo);
            LobbyListManager.instance.gameObject.SetActive(false);

            JPlayerInfo myInfo = JsonConvert.DeserializeObject<JPlayerInfo>(_myInfo);
            LobbyManager.instance.gameObject.SetActive(true);
            LobbyManager.instance.Info(lobbyInfo, myInfo);
        });

        SocketIO1.instance.socketManager.Socket.On<string>("create_lobby_failure", (failure) => {
            Debug.Log("create_lobby_failure: " + failure);
        });
    #endregion
        
    //Tham gia phòng thành công
        SocketIO1.instance.socketManager.Socket.On<string, string>("join_lobby_success", (_lobbyInfo, _myInfo) => {
            Debug.Log("join_lobby_success: " + _lobbyInfo);

            //Ẩn LobbyList và hiển thị và cập nhật thông tin LobbyManager
            JLobbyInfo lobbyInfo = JsonConvert.DeserializeObject<JLobbyInfo>(_lobbyInfo);
            LobbyListManager.instance.gameObject.SetActive(false);

            JPlayerInfo myInfo = JsonConvert.DeserializeObject<JPlayerInfo>(_myInfo);
            LobbyManager.instance.gameObject.SetActive(true);
            LobbyManager.instance.Info(lobbyInfo, myInfo);
        });

        SocketIO1.instance.socketManager.Socket.On<string>("join_lobby_failure", (failure) => {
            Debug.Log("join_lobby_failure: " + failure);
        });

    //Thoát khỏi phòng thành công
        SocketIO1.instance.socketManager.Socket.On<string>("leave_lobby_success", (_lobbyInfo) => {
            Debug.Log("leave_lobby_success: " + _lobbyInfo);

            //Ẩn LobbyManager và hiển thị LobbyList
            LobbyManager.instance.gameObject.SetActive(false);
            LobbyListManager.instance.gameObject.SetActive(true);
        });

        SocketIO1.instance.socketManager.Socket.On<string>("leave_lobby_failure", (failure) => {
            Debug.Log("leave_lobby_failure: " + failure);
        });

    //Cập nhật thông tin phòng chơi
        SocketIO1.instance.socketManager.Socket.On<string>("update_lobby_info", (_lobbyInfo) => {
            try
            {
                Debug.Log("update_lobby_info: " + _lobbyInfo);
                JLobbyInfo lobbyInfo = JsonConvert.DeserializeObject<JLobbyInfo>(_lobbyInfo);
                //Nếu người chơi trong phòng > 0 thì cập nhật thông tin cho phòng đó, còn không thì xóa phòng khỏi LobbyList
                if (lobbyInfo.playerList.Count > 0)
                {
                    LobbyListManager.instance.UpdateLobby(lobbyInfo);
                }
                else
                {
                    LobbyListManager.instance.DeleteLobby(lobbyInfo);
                }
            }
            catch
            {
                Debug.Log("update_lobby_info: error");
            }
        });

    //Khi có người chơi khác tham gia phòng thành công
        SocketIO1.instance.socketManager.Socket.On<string>("other_player_join_lobby", (_playerInfo) => {
            Debug.Log("other_player_join_lobby: " + _playerInfo);
            JPlayerInfo playerInfo = JsonConvert.DeserializeObject<JPlayerInfo>(_playerInfo);
            //Hiển thị thông tin người chơi mới tham gia phòng
            LobbyManager.instance.OtherPlayerJoinLobby(playerInfo);
        });

    //Khi có người chơi khác rời khỏi phòng
        SocketIO1.instance.socketManager.Socket.On<string, string>("other_player_leave_lobby", (_lobbyInfo, _playerInfo) => {
            Debug.Log("other_player_leave_lobby: " + _lobbyInfo);
            JLobbyInfo lobbyInfo = JsonConvert.DeserializeObject<JLobbyInfo>(_lobbyInfo);
            JPlayerInfo playerInfo = JsonConvert.DeserializeObject<JPlayerInfo>(_playerInfo);
            //Cập nhật thông tin người chơi mới rời khỏi phòng
            LobbyManager.instance.OtherPlayerLeaveLobby(lobbyInfo, playerInfo);
        });

    //Bắt đầu tìm trận
        SocketIO1.instance.socketManager.Socket.On<string>("start_find_match_success", (lobbyStatus) => {
            Debug.Log("start_find_match_success: " + lobbyStatus);
            LobbyManager.instance.StartFindingMatch(lobbyStatus);
        });

        SocketIO1.instance.socketManager.Socket.On<string>("start_find_match_failure", (failure) => {
            Debug.Log("start_find_match_failure: " + failure);
        });

    //Dừng việc tìm trận
        SocketIO1.instance.socketManager.Socket.On<string>("stop_find_match_success", (lobbyStatus) => {
            Debug.Log("stop_find_match_success: ");
            LobbyManager.instance.StopFindingMatch(lobbyStatus);
        });

        SocketIO1.instance.socketManager.Socket.On<string>("stop_find_match_failure", (failure) => {
            Debug.Log("stop_find_match_failure: " + failure);
        });

    //Tìm đội thành công
        SocketIO1.instance.socketManager.Socket.On("match_found", () => {
            Debug.Log("match_found: ");
            MatchFound.instance.gameObject.SetActive(true);
        });
    //Ghép đội thành công
        SocketIO1.instance.socketManager.Socket.On("match_found_success", () => {
            Debug.Log("match_found_success: ");
            MatchFound.instance.gameObject.SetActive(false);
        });
    //Ghép đội thất bại
        SocketIO1.instance.socketManager.Socket.On("match_found_failure", () => {
            Debug.Log("match_found_failure: ");
            MatchFound.instance.gameObject.SetActive(false);
        });
    }
        
    #endregion

    #region Emit (gửi sự kiện)
    public void Emit_GetLobbyList()
    {
        SocketIO1.instance.socketManager.Socket.Emit("get_lobby_list");
    }

    public void Emit_CreateLobby()
    {
        SocketIO1.instance.socketManager.Socket.Emit("create_lobby");
    }

    public void Emit_JoinLobby(JLobbyInfo lobbyInfo)
    {
        SocketIO1.instance.socketManager.Socket.Emit("join_lobby", lobbyInfo.lobbyId);
    }

    public void Emit_LeaveLobby()
    {
        SocketIO1.instance.socketManager.Socket.Emit("leave_lobby");
    }

    public void Emit_StartFindMatch()
    {
        SocketIO1.instance.socketManager.Socket.Emit("start_find_match");
    }

    public void Emit_StopFindMatch()
    {
        SocketIO1.instance.socketManager.Socket.Emit("stop_find_match");
    }

    public void Emit_AcceptMatchFound()
    {
        SocketIO1.instance.socketManager.Socket.Emit("accept_match_found");
    }

    public void Emit_DeclineMatchFound()
    {
        SocketIO1.instance.socketManager.Socket.Emit("decline_match_found");
    }
    #endregion
}

public enum LobbyStatus
{
    None,
    FindingMatch,
    Loading,
    Ingame
}

[Serializable]
public class JLobbyInfo
{
    public string lobbyId;
    public JPlayerInfo lobbyMaster;
    public int maxPlayer;
    public List<JPlayerInfo> playerList;
    public string lobbyStatus;
}