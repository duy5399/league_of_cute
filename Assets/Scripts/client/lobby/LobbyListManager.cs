using AYellowpaper.SerializedCollections;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class LobbyListManager : MonoBehaviour
{
    public static LobbyListManager instance { get; private set; }

    [SerializeField] private SerializedDictionary<JLobbyInfo, GameObject> lobbyList;
    [SerializeField] private Transform tfLobbyList;

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

        lobbyList = new SerializedDictionary<JLobbyInfo, GameObject>();
        tfLobbyList = this.transform.GetChild(0).GetComponent<ScrollRect>().content;
    }

    //Lấy danh sách các phòng chơi
    public void GetLobbyList()
    {
        Debug.Log("GetLobbyList()");
        SocketIO1.instance.lobbyIO.Emit_GetLobbyList();
    }

    //Cập nhật thông tin phòng chơi
    public void UpdateLobby(JLobbyInfo lobbyInfo)
    {
        GameObject lobbyObj = lobbyList.FirstOrDefault(x => x.Key.lobbyId == lobbyInfo.lobbyId).Value;
        if (!lobbyObj)
        {
            GameObject lobbySlotPath = Resources.Load<GameObject>("prefabs/lobby/inLobby/Lobby");
            lobbyObj = Instantiate(lobbySlotPath);
            lobbyObj.transform.parent = tfLobbyList;
            lobbyObj.transform.localScale = Vector3.one;
            lobbyList.Add(lobbyInfo, lobbyObj);
        }
        Lobby lobby = lobbyObj.GetComponent<Lobby>();
        lobby.Info(lobbyInfo);
    }

    //Xóa phòng chơi
    public void DeleteLobby(JLobbyInfo lobbyInfo)
    {
        GameObject lobbyObj = lobbyList.FirstOrDefault(x => x.Key.lobbyId == lobbyInfo.lobbyId).Value;
        if (!lobbyObj)
        {
            return;
        }
        lobbyList.Remove(lobbyInfo);
        Destroy(lobbyObj);
    }

    //Tạo phòng mới
    public void CreateLobby()
    {
        Debug.Log("CreateLobby()");
        SocketIO1.instance.lobbyIO.Emit_CreateLobby();
    }
}


