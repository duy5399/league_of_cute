using AYellowpaper.SerializedCollections;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class Lobby : MonoBehaviour
{
    [SerializeField] private JLobbyInfo lobbyInfo;
    [SerializeField] private TextMeshProUGUI txtLobbyId;
    [SerializeField] private TextMeshProUGUI txtNumberPlayer;
    [SerializeField] private Transform tfPlayerList;
    [SerializeField] private SerializedDictionary<JPlayerInfo, GameObject> dictPlayerList;
    [SerializeField] private Button btnJoin;

    private void Awake()
    {
        txtLobbyId = this.transform.GetChild(1).GetComponent<TextMeshProUGUI>();
        txtNumberPlayer = this.transform.GetChild(2).GetComponent<TextMeshProUGUI>();
        tfPlayerList = this.transform.GetChild(3);
        btnJoin = this.GetComponent<Button>();
    }

    private void OnEnable()
    {
        txtLobbyId.text = string.Empty;
        txtNumberPlayer.text = string.Empty;
        btnJoin.onClick.AddListener(OnClick_JoinLobby);
    }

    private void OnDisable()
    {
        txtLobbyId.text = string.Empty;
        txtNumberPlayer.text = string.Empty;
        btnJoin.onClick.RemoveListener(OnClick_JoinLobby);
    }

    public void Info(JLobbyInfo lobbyInfo)
    {
        this.lobbyInfo = lobbyInfo;
        txtLobbyId.text = "#" + lobbyInfo.lobbyId;
        txtNumberPlayer.text = "Số người: " + lobbyInfo.playerList.Count + "/" + lobbyInfo.maxPlayer;
        int i = 0;
        foreach (var playerInfo in lobbyInfo.playerList)
        {
            GameObject playerObj = i < dictPlayerList.Count ? dictPlayerList.ElementAt(i).Value : null;
            if (!playerObj)
            {
                GameObject playerPath = Resources.Load<GameObject>("prefabs/lobby/inLobby/PlayerInfo");
                playerObj = Instantiate(playerPath, tfPlayerList);
                dictPlayerList.Add(playerInfo, playerObj);
            }
            playerObj.transform.GetChild(0).GetChild(0).GetComponent<Image>().sprite = Resources.Load<Sprite>("textures/profileImage/" + playerInfo.profileImg);
            playerObj.transform.GetChild(2).GetComponent<Image>().sprite = Resources.Load<Sprite>("textures/rankIcon/" + playerInfo.rank);
            i++;
        }
        for (int j = dictPlayerList.Count - 1; j >= i; j--)
        {
            Destroy(dictPlayerList.ElementAt(j).Value);
            dictPlayerList.Remove(dictPlayerList.ElementAt(j).Key);
        }
    }

    void OnClick_JoinLobby()
    {
        if(lobbyInfo == null)
        {
            return;
        }
        SocketIO1.instance.lobbyIO.Emit_JoinLobby(lobbyInfo);
    }
}
