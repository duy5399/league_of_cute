const server = require("../../server");
const { client } = require("../db/init.redis");
const uuid = require('uuid');
const { Room } = require("./room");
const { ConnectionState } = require("../enum/enum");

class RoomManager{
    constructor(){
        this.roomList = [];
    }

    async createRoom(playerList){
        console.log('_createRoom RoomManager');
        let room = new Room();
        room = await room.createRoom(playerList);
        this.roomList.push(room);
    }

    async joinRoom(roomId, player){
        console.log('_joinRoom: ' + roomId);
        let roomListDB = await client.json.get('roomListDB');
        let room = roomListDB[roomId];
        let foundPlayer = room.playerList.find(x => x.uid === player.uid);
        //Nếu room không tồn tại hoặc người chơi không có trong phòng này
        if(!room || !foundPlayer){
            return false;
        }
        //Thêm người chơi vào room
        foundPlayer.connectionState = ConnectionState.Connected;
        client.json.set('roomListDB', '$', roomListDB);
        if(room.playerList.includes(x => x.connectionState === ConnectionState.Connecting)){
            return false;
        }
        server.socketIO.in(room.roomId).emit('load_battle_scene_complete');
        return true;
    }
}

module.exports = { RoomManager };

