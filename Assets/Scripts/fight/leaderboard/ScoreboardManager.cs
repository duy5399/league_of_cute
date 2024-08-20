using BestHTTP.Extensions;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class ScoreboardManager : MonoBehaviour
{
    public static ScoreboardManager instance { get; private set; }

    [SerializeField] private Transform tfLeaderboard;
    [SerializeField] private Dictionary<string, GameObject> dictLeaderboard;

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
        tfLeaderboard = this.transform.GetChild(0);
        dictLeaderboard = new Dictionary<string, GameObject>();
    }

    private void Start()
    {
        
    }

    public void UpdateScoreboard(List<JPlayerInfoScoreboard> scoreboard)
    {
        for(int i = 0; i < scoreboard.Count; i++)
        {
            if (!dictLeaderboard.ContainsKey(scoreboard[i].uid))
            {
                GameObject prefab = Resources.Load<GameObject>("prefabs/fight/leaderboard/Prefab_PlayerInfo");
                GameObject obj = Instantiate(prefab, tfLeaderboard);
                ScoreboardPlayerInfoManager info = obj.GetComponent<ScoreboardPlayerInfoManager>();
                info.SetPlayerName(scoreboard[i].nickname);
                info.SetAvatar(scoreboard[i].profileImg);
                info.SetHP(scoreboard[i].hp, scoreboard[i].maxHP);
                dictLeaderboard.Add(scoreboard[i].uid, obj);
            }
            else
            {
                dictLeaderboard[scoreboard[i].uid].GetComponent<ScoreboardPlayerInfoManager>().SetHP(scoreboard[i].hp, scoreboard[i].maxHP);
                dictLeaderboard[scoreboard[i].uid].transform.SetSiblingIndex(i);
            }
        }
    }
}
