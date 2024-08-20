using BestHTTP.SocketIO3;
using Newtonsoft.Json;

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;


[Serializable]
public class RankedSocketIO
{
    private SocketManager socketManager;
    //public void RankedSocketIOStart(SocketManager socketManager)
    //{
    //    this.socketManager = socketManager;
    //    socketManager.Socket.On<string>("get-my-ranking-success", (myRanking) => {
    //        On_GetMyRankingSuccess(myRanking);
    //    });
    //    socketManager.Socket.On<string>("get-ranked-success", (rankedData) => {
    //        On_GetRankedSuccess(rankedData);
    //    });
    //}
    //#region Listening to events
    //private void On_GetMyRankingSuccess(string myRanking)
    //{
    //    Debug.Log(myRanking);
    //    PlayerDataLoadingJSON data = JsonConvert.DeserializeObject<PlayerDataLoadingJSON>(myRanking);
    //    RankedManager.instance.SetImgCurrentRanking(data.rank);
    //    RankedManager.instance.SetTxtRanking(data.rank);
    //    RankedManager.instance.SetTxtPoints(data.points);
    //}
    //private void On_GetRankedSuccess(string rankedData)
    //{
    //    Debug.Log(rankedData);
    //    PlayerDataLoadingJSON[] data = JsonConvert.DeserializeObject<PlayerDataLoadingJSON[]>(rankedData);
    //    RankedManager.instance.SetBoardRanked(data);
    //}
    //#endregion

    //#region Emitting events
    //public void Emit_GetRanked(string rank)
    //{
    //    socketManager.Socket.Emit("get-ranked", rank);
    //}
    //public void Emit_GetCurrentMyRanking()
    //{
    //    socketManager.Socket.Emit("get-my-ranking");
    //}
    //#endregion
}
