using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MoveIO : MonoBehaviour
{
    private void Start()
    {
        MoveIOStart();
    }

    public void MoveIOStart()
    {
        //
        SocketIO1.instance.socketManager.Socket.On<string, float[]>("tactician_move_success", (networkId, _position) => {
            Vector3 position = new Vector3(_position[0], _position[1], _position[2]);
            RoomManager1.instance.TacticianMove(networkId, position);
        });

        SocketIO1.instance.socketManager.Socket.On<string, float[]>("tactician_rotate_success", (networkId, _rotation) => {
            Quaternion rotation = new Quaternion(_rotation[0], _rotation[1], _rotation[2], _rotation[3]);
            RoomManager1.instance.TacticianRotate(networkId, rotation);
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
    #endregion
}

