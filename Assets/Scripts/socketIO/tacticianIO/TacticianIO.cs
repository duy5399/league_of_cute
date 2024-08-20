using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.AI;

public class TacticianIO : MonoBehaviour
{
    private void Start()
    {
        TacticianIOStart();
    }

    public void TacticianIOStart()
    {

    }
}

public class TacticianStateIO : MonoBehaviour
{
    private void Start()
    {
        TacticianStateIOStart();
    }

    public void TacticianStateIOStart()
    {
        //gây ST
        SocketIO1.instance.socketManager.Socket.On<string, string>("tactician_deal_damage", (_tacticianState, _target) => {
            Debug.Log("tactician_deal_damage: " + _tacticianState);
            JTacticianState jTacticianState = JsonConvert.DeserializeObject<JTacticianState>(_tacticianState);
            JTacticianState jTargetState = JsonConvert.DeserializeObject<JTacticianState>(_target);
            GameObject tactician = RoomManager1.instance.otherTactician.Concat(new List<GameObject>() { RoomManager1.instance.myTactician }).FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == jTacticianState.networkId);
            GameObject target = RoomManager1.instance.otherTactician.Concat(new List<GameObject>() { RoomManager1.instance.myTactician }).FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == jTargetState.networkId);
            if (!tactician || !target)
            {
                return;
            }
            TacticianState tacticianState = tactician.GetComponent<TacticianState>();
            TacticianAnim tacticianAnim = tactician.GetComponent<TacticianAnim>();
            if (!tacticianState || !tacticianAnim)
            {
                return;
            }
            tacticianAnim.TriggerAnim("castSkill", 1f, true);
            tacticianState.DealDamage(target, 0);
        });

        //nhận ST
        SocketIO1.instance.socketManager.Socket.On<string>("tactician_take_damage", (_tacticianState) => {
            Debug.Log("tactician_take_damage: " + _tacticianState);
            JTacticianState tacticianState = JsonConvert.DeserializeObject<JTacticianState>(_tacticianState);
            GameObject tactician = RoomManager1.instance.otherTactician.Concat(new List<GameObject>() { RoomManager1.instance.myTactician }).FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == tacticianState.networkId);
            if (!tactician)
            {
                return;
            }
            TacticianState state = tactician.GetComponent<TacticianState>();
            TacticianAnim anim = tactician.GetComponent<TacticianAnim>();
            if (!state || !anim)
            {
                return;
            }
            state.jTacticianState = tacticianState;
            anim.TriggerAnim("beHitted", 1f, true);
        });
    }
}

public class TacticianAnimIO : MonoBehaviour
{
    private void Start()
    {
        UnitAnimIOStart();
    }

    public void UnitAnimIOStart()
    {
        //Hoạt ảnh
        SocketIO1.instance.socketManager.Socket.On<string, string, float, bool>("tactician_trigger_anim_success", (_tacticianState, animName, animSpeed, force) => {
            Debug.Log("tactician_trigger_anim_success: " + _tacticianState + animName + animSpeed + force);
            JTacticianState tacticianState = JsonConvert.DeserializeObject<JTacticianState>(_tacticianState);
            GameObject unit = RoomManager1.instance.otherTactician.Concat(new List<GameObject>() { RoomManager1.instance.myTactician}).FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == tacticianState.networkId);
            if (!unit)
            {
                return;
            }
            TacticianAnim anim = unit.GetComponent<TacticianAnim>();
            if (!anim)
            {
                return;
            }
            anim.TriggerAnim(animName, animSpeed, force);
        });
    }
}



public class TacticianMoveIO : MonoBehaviour
{
    private void Start()
    {
        TacticianMoveIOStart();
    }

    public void TacticianMoveIOStart()
    {
        //Di chuyển
        SocketIO1.instance.socketManager.Socket.On<string, float[]>("tactician_move_success", (networkId, _position) => {
            Vector3 position = new Vector3(_position[0], _position[1], _position[2]);
            GameObject tactician = RoomManager1.instance.otherTactician.FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == networkId);
            if (!tactician)
            {
                return;
            }
            tactician.transform.position = position;
        });

        SocketIO1.instance.socketManager.Socket.On<string, float[]>("tactician_rotate_success", (networkId, _rotation) => {
            Quaternion rotation = new Quaternion(_rotation[0], _rotation[1], _rotation[2], _rotation[3]);
            GameObject tactician = RoomManager1.instance.otherTactician.FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == networkId);
            if (!tactician)
            {
                return;
            }
            tactician.transform.rotation = rotation;
        });

        SocketIO1.instance.socketManager.Socket.On<string>("tactician_stop_success", (networkId) => {
            GameObject tactician = RoomManager1.instance.otherTactician.Concat(new List<GameObject>() { RoomManager1.instance.myTactician }).FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == networkId);
            if (!tactician)
            {
                return;
            }
            TacticianAnim tacticianAnim = tactician.GetComponent<TacticianAnim>();
            tacticianAnim.TriggerAnim("idle");
        });

        //Di chuyển Linh thú sang sân đấu đối phương
        SocketIO1.instance.socketManager.Socket.On<string, string, bool>("arrival_tactitcian_to_other_arena", (arenaId, _jTacticianState, isHome) => {
            Debug.Log("arrival_unit_to_other_arena: " + arenaId);
            GameObject arena = RoomManager1.instance.otherArena.Concat(new List<GameObject>() { RoomManager1.instance.myArena }).FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == arenaId);
            if (!arena)
            {
                return;
            }
            JTacticianState jTacticianState = JsonConvert.DeserializeObject<JTacticianState>(_jTacticianState);
            GameObject tactician = RoomManager1.instance.otherTactician.Concat(new List<GameObject>() { RoomManager1.instance.myTactician }).FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == jTacticianState.networkId);
            if (!tactician)
            {
                return;
            }
            TacticianMove tacticianMove = tactician.GetComponent<TacticianMove>();
            if (isHome)
            {
                tacticianMove.SetTacticianHome(arena.transform.position);
            }
            else
            {
                tacticianMove.SetTacticianAway(arena.transform.position);
            }
        });
    }

    #region Emit (gửi sự kiện)
    public void Emit_TacticianMove(Vector3 position)
    {
        SocketIO1.instance.socketManager.Socket.Emit("tactician_move", new float[] { position.x, position.y, position.z });
    }

    public void Emit_TacticianRotate(Quaternion rotation)
    {
        SocketIO1.instance.socketManager.Socket.Emit("tactician_rotate", new float[] { rotation.x, rotation.y, rotation.z, rotation.w });
    }

    public void Emit_TacticianStop()
    {
        SocketIO1.instance.socketManager.Socket.Emit("tactician_stop");
    }
    #endregion
}

[Serializable]
public class JTacticianState
{
    public string networkId;
    public JItemInfo tacticianInfo;
    public string nickname;
    public float hp;
    public float maxHP;
    public int level;
    public float[] position;
    public float[] rotation;
    public bool dead;
}