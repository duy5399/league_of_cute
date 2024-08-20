using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using static Animancer.AnimancerPlayable;
using static BestHTTP.SecureProtocol.Org.BouncyCastle.Asn1.Cmp.Challenge;


public class ScoreboardIO : MonoBehaviour
{
    private void Start()
    {
        ScoreboardIOStart();
    }

    public void ScoreboardIOStart()
    {
        SocketIO1.instance.socketManager.Socket.On<string>("update_scoreboard", (_scoreboard) => {
            Debug.Log("update_scoreboard: " + _scoreboard);
            List<JPlayerInfoScoreboard> scoreboard = JsonConvert.DeserializeObject<List<JPlayerInfoScoreboard>>(_scoreboard);
            ScoreboardManager.instance.UpdateScoreboard(scoreboard);
        });

        //Hiển thị kết quả phòng chơi
        SocketIO1.instance.socketManager.Socket.On<string, string>("display_scoreboard_success", (_scoreboard, _myInfo) => {
            Debug.Log("display_scoreboard_success: " + _scoreboard);
            List<JPlayerInfoScoreboard> scoreboard = JsonConvert.DeserializeObject<List<JPlayerInfoScoreboard>>(_scoreboard);
            JMyScoreboardInfo myInfo = JsonConvert.DeserializeObject<JMyScoreboardInfo>(_myInfo);
            LoadingScreenController.instance.LoadingScene("Client", () =>
            {
                Leaderboard_TheEndGame_Manager.instance.gameObject.SetActive(true);
                Leaderboard_TheEndGame_Manager.instance.DisplayScoreboardInfo(scoreboard, myInfo);
  
                LoadingScreenController.instance.gameObject.SetActive(false);
            });
        });
    }

    public void Emit_DisplayScoreboard()
    {
        SocketIO1.instance.socketManager.Socket.Emit("display_scoreboard");
    }
}



[Serializable]
public class JPlayerInfoScoreboard : JPlayerInfo
{
    public float hp;
    public float maxHP;
    public int place;
    public List<JUnitState> formation;
}

[Serializable]
public class JMyScoreboardInfo
{
    public string uid;
    public int points;
    public string rank;
    public int addPoint;
}