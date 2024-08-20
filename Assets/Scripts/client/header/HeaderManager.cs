using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class HeaderManager : MonoBehaviour
{
    [SerializeField] private Button btnPlay;
    [SerializeField] private Button btnRank;

    private void Awake()
    {
        btnPlay = this.transform.GetChild(0).GetComponent<Button>();
        btnRank = this.transform.GetChild(1).GetComponent<Button>();
    }

    private void OnEnable()
    {
        btnPlay.onClick.AddListener(OnClick_Play);
        btnRank.onClick.AddListener(OnClick_Rank);
    }

    private void OnDisable()
    {
        btnPlay.onClick.RemoveListener(OnClick_Play);
        btnRank.onClick.RemoveListener(OnClick_Rank);
    }

    void OnClick_Play()
    {
        if(LobbyManager.instance.lobbyInfo != null)
        {
            return;
        }
        LobbyListManager.instance.CreateLobby();
    }

    void OnClick_Rank()
    {

    }
}
