using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;


public class RoomIO : MonoBehaviour
{
    private void Start()
    {
        RoomIOStart();
    }

    public void RoomIOStart()
    {
        //Màn hình tải trận và hiển thị thêm thông tin của tất cả người chơi trong phòng, sau khi tải xong cảnh thì gửi thông tin lên server
        SocketIO1.instance.socketManager.Socket.On<string>("loading_battle_screen", (_playerInfo) => {
            Debug.Log("loading_battle_screen: " + _playerInfo);
            List<JPlayerInfo> playerInfo = JsonConvert.DeserializeObject<List<JPlayerInfo>>(_playerInfo);
            LoadingScreenController.instance.LoadingScene("Battle", () =>
            {
                Emit_JoinRoom();
            });
            LoadingScreenController.instance.DisplayListPlayerInfo(playerInfo);
        });

        SocketIO1.instance.socketManager.Socket.On("load_battle_scene_complete", () => {
            Debug.Log("load_battle_scene_complete: " );
            LoadingScreenController.instance.gameObject.SetActive(false);
        });

        //Tải Linh thú
        SocketIO1.instance.socketManager.Socket.On<string, string, float[]>("instantiate_tactician", (owner, _jTacticianState, _position) => {
            Debug.Log("instantiate_tactician: " + _jTacticianState + " - " + _position);
            JTacticianState jTacticianState = JsonConvert.DeserializeObject<JTacticianState>(_jTacticianState);
            Vector3 position = new Vector3(_position[0], _position[1], _position[2]);
            bool isOwner = SocketIO1.instance.socketManager.Socket.Id == owner ? true : false;
            RoomManager1.instance.InstantiateTactician(jTacticianState, position, isOwner);
        });

        //Tải Chưởng lực
        SocketIO1.instance.socketManager.Socket.On<string, string, string>("instantiate_boom", (owner, _jTacticianState, _jBoomInfo) => {
            Debug.Log("instantiate_boom: " + _jBoomInfo);
            JTacticianState jTacticianState = JsonConvert.DeserializeObject<JTacticianState>(_jTacticianState);
            JItemInfo jBoomInfo = JsonConvert.DeserializeObject<JItemInfo>(_jBoomInfo);
            GameObject tactician = RoomManager1.instance.otherTactician.Concat(new List<GameObject>() { RoomManager1.instance.myTactician }).FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == jTacticianState.networkId);
            var boomPrefab = Resources.Load<GameObject>("prefabs/fight/booms/" + jBoomInfo.itemId);
            tactician.GetComponent<TacticianState>().myBoom = boomPrefab;
        });

        //Tải Sân đấu
        SocketIO1.instance.socketManager.Socket.On<string, string, float[], string>("instantiate_arena_skin", (owner, _arenaSkin, _position, networdId) => {
            Debug.Log("instantiate_arena_skin: " + _arenaSkin + " - " + _position);
            JStoreItemInfo arenaSkin = JsonConvert.DeserializeObject<JStoreItemInfo>(_arenaSkin);
            Vector3 position = new Vector3(_position[0], _position[1], _position[2]);
            bool isOwner = SocketIO1.instance.socketManager.Socket.Id == owner ? true : false;
            RoomManager1.instance.InstantiateArenaSkin(arenaSkin, position, networdId, isOwner);
        });

        //Tải Hàng chờ
        SocketIO1.instance.socketManager.Socket.On<string, string, string>("instantiate_bench", (owner, _listTile, networdId) => {
            Debug.Log("instantiate_bench: " + _listTile);
            List<JBenchTile> listTile = JsonConvert.DeserializeObject<List<JBenchTile>>(_listTile);
            bool isOwner = SocketIO1.instance.socketManager.Socket.Id == owner ? true : false;
            for (int i = 0; i < listTile.Count;  i++)
            {
                RoomManager1.instance.InstantiateBench(listTile[i], networdId, isOwner);
            }
        });

        SocketIO1.instance.socketManager.Socket.On<string, string, string>("instantiate_battlefield", (owner, _listTile, networdId) => {
            Debug.Log("instantiate_battlefield: " + _listTile);
            List<JBattlefieldTile> listTile = JsonConvert.DeserializeObject<List<JBattlefieldTile>>(_listTile);
            bool isOwner = SocketIO1.instance.socketManager.Socket.Id == owner ? true : false;
            for (int i = 0; i < listTile.Count; i++)
            {
                RoomManager1.instance.InstantiateBattlefield(listTile[i], networdId, isOwner);
            }
        });

        SocketIO1.instance.socketManager.Socket.On<string, string, string>("instantiate_item_inventory", (owner, _listTile, networdId) => {
            Debug.Log("instantiate_item_inventory: " + _listTile);
            List<JItemInventoryTile> listTile = JsonConvert.DeserializeObject<List<JItemInventoryTile>>(_listTile);
            bool isOwner = SocketIO1.instance.socketManager.Socket.Id == owner ? true : false;
            for (int i = 0; i < listTile.Count; i++)
            {
                RoomManager1.instance.InstantiateItemInventory(listTile[i], networdId, isOwner);
            }
        });

        //Thêm đơn vị mới vào hàng chờ
        SocketIO1.instance.socketManager.Socket.On<string, string, string>("add_unit_on_bench", (owner, _tile, _unitState) => {
            Debug.Log("add_unit_on_bench: " + _tile);
            Debug.Log("add_unit_on_bench1: " + _unitState);
            bool isOwner = SocketIO1.instance.socketManager.Socket.Id == owner ? true : false;
            JBenchTile tile = JsonConvert.DeserializeObject<JBenchTile>(_tile);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            BenchManager.instance.AddUnit(tile, unitState, isOwner);
        });

        //Nâng cấp đơn vị
        SocketIO1.instance.socketManager.Socket.On<string>("upgrade_unit", (_unitState) => {
            Debug.Log("upgrade_unit: " + _unitState);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            RoomManager1.instance.UpgradeUnit(unitState);
        });

        //Xóa đơn vị
        SocketIO1.instance.socketManager.Socket.On<string>("delete_unit", (_unitState) => {
            Debug.Log("delete_unit: " + _unitState);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            RoomManager1.instance.DeleteUnit(unitState);
        });

        //Xóa đơn vị
        SocketIO1.instance.socketManager.Socket.On<string, string, string>("drag_drop_unit_success", (owner, _tile, _unitState) => {
            Debug.Log("drag_drop_unit_success: " + _tile);
            Debug.Log("drag_drop_unit_success1: " + _unitState);
            bool isOwner = SocketIO1.instance.socketManager.Socket.Id == owner ? true : false;
            JTile tile = JsonConvert.DeserializeObject<JTile>(_tile);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            RoomManager1.instance.DragDropUnit(tile, unitState, isOwner);
        });

        //Đếm giờ
        SocketIO1.instance.socketManager.Socket.On<int, int>("new_round", (currStage, currRound) => {
            Debug.Log("new_round: " + currStage + currRound);
            StageTrackerManager.instance.Stage(currStage.ToString() + "-" + currRound.ToString());
        });

        //Đếm giờ
        SocketIO1.instance.socketManager.Socket.On<string>("new_phase", (_currPhase) => {
            Debug.Log("new_phase: " + _currPhase);
            Phases currPhase = (Phases)Enum.Parse(typeof(Phases), _currPhase);
            if(currPhase == Phases.Arrival || currPhase == Phases.End)
            {
                return;
            }
            string phase = "";
            switch (currPhase)
            {
                case Phases.Planning:
                    phase = "Dàn Trận"; break;
                case Phases.Battle:
                    phase = "Giao Chiến"; break;
            }
            StageTrackerManager.instance.Phase(phase);
        });

        //Đếm giờ
        SocketIO1.instance.socketManager.Socket.On<float>("countdownTimer", (duration) => {
            Debug.Log("countdownTimer: " + duration);
            StageTrackerManager.instance.CountdownTimer(duration);
        });

        //Thêm quái vật vào sân đấu
        SocketIO1.instance.socketManager.Socket.On<string, string>("add_monster_pve", (owner, _tile) => {
            Debug.Log("add_monster_pve: " + owner + _tile);
            bool isOwner = SocketIO1.instance.socketManager.Socket.Id == owner ? true : false;
            List<JUnitState> units = JsonConvert.DeserializeObject<List<JUnitState>>(_tile);
            for(int i = 0; i < units.Count; i++)
            {
                BattlefieldManager.instance.AddMonster(units[i], isOwner);
            }
        });

        //Chuyển camera và linh thú đến sàn đấu đối thủ
        SocketIO1.instance.socketManager.Socket.On<string>("arrival_camera_to_other_arena", (arenaId) => {
            Debug.Log("arrival_camera_to_other_arena: " + arenaId);
            if(RoomManager1.instance.myArena.GetComponent<NetworkObject>().networkId == arenaId)
            {
                CameraController.instance.SetCameraHome(RoomManager1.instance.myArena.transform.position);
                return;
            }
            GameObject arena = RoomManager1.instance.otherArena.FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == arenaId);
            if (!arena)
            {
                return;
            }
            CameraController.instance.SetCameraAway(arena.transform.position);
        });

        SocketIO1.instance.socketManager.Socket.On("on_dead", () => {
            Debug.Log("on_dead: ");
            BattleResultManager.instance.gameObject.SetActive(true);
            BattleResultManager.instance.OnDisableScreen();
        });

        SocketIO1.instance.socketManager.Socket.On<int>("end_game", (place) => {
            Debug.Log("end_game: ");
            BattleResultManager.instance.gameObject.SetActive(true);
            BattleResultManager.instance.OnSetBattleResult(place);
        });
    }

    #region Emit (gửi sự kiện)
    public void Emit_JoinRoom()
    {
        SocketIO1.instance.socketManager.Socket.Emit("join_room");
    }

    public void Emit_DragDropUnit(JUnitState unitState, JTile tile)
    {
        SocketIO1.instance.socketManager.Socket.Emit("drag_drop_unit", JsonUtility.ToJson(unitState), JsonUtility.ToJson(tile));
    }
    #endregion
}

[Serializable]
public class JPlayerInfo
{
    public string uid;
    public string nickname;
    public string profileImg;
    public int level;
    public string bio;
    public string rank;
    public int points;
    public bool online;
    public string status;
    public string lastLogin;
    public JStoreItemInfo tacticianEquip;
}


[Serializable]
public class JTile
{
    public string networkId;
    public int x;
    public int y;
    public string tag;
    public float[] position;
    public bool canUse;
}

[Serializable]
public class JBenchTile : JTile
{
    public JUnit unit;
}

[Serializable]
public class JBattlefieldTile : JTile
{
    public JUnit unit;
    public bool walkable;
}

[Serializable]
public class JItemInventoryTile : JTile
{
    
}

public enum TileTag
{
    Bench,
    Battlefield
}

public enum Phases
{
    Planning,
    Arrival,
    Battle,
    End
}