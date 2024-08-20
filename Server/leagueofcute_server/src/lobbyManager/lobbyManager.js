const server = require("../../server");
const { client } = require("../db/init.redis");
const { LobbyStatus } = require("../enum/enum");

class LobbyManager{
    constructor(){
        this.lobbyList = [];
    }

    async createLobby(player){
        console.log('_createLobby');
        player.acceptMatchFound = false;
        let lobby = {
            lobbyId : Math.random().toString(36).substring(2, 8).toUpperCase(),
            lobbyMaster : player,
            maxPlayer : 2,
            password : null,
            playerList : [player],
            lobbyStatus : LobbyStatus.None
        }

        //Thêm dữ liệu lobby vào redis
        let lobbyListDB = await client.json.get('lobbyListDB');
        if(lobbyListDB === null){
            lobbyListDB = {};
        }
        lobbyListDB[lobby.lobbyId] = lobby;
        client.json.set('lobbyListDB', '$', lobbyListDB);
        return lobby;
    }

    async joinLobby(lobbyId, player){
        console.log('_joinLobby');
        let lobbyListDB = await client.json.get('lobbyListDB');
        let lobby = lobbyListDB[lobbyId];
        //Nếu lobby không tồn tại hoặc đã chứa tối đa người chơi hoặc đã vào trạng thái tìm trận, tải trận, trong trận thì không thể tham gia nữa
        if(!lobby || lobby.playerList.length >= lobby.maxPlayer || lobby.lobbyStatus !== LobbyStatus.None ){
            return null;
        }
        //Thêm người chơi vào lobby
        lobby.playerList.push(player);
        client.json.set('lobbyListDB', '$', lobbyListDB);
        return lobby;
    }

    async leaveLobby(lobbyId, player){
        console.log('_leaveLobby');
        let lobbyListDB = await client.json.get('lobbyListDB');
        let lobby = lobbyListDB[lobbyId];
        if(!lobby){
            return null;
        }
        //Xóa người chơi khỏi lobby
        lobby.playerList = lobby.playerList.filter(x => x.uid !== player.uid);
        //Nếu không còn người chơi trong lobby thì xóa lobby 
        if(lobby.playerList.length === 0){
            delete lobbyListDB[lobbyId];
            client.json.set('lobbyListDB', '$', lobbyListDB);
            return lobby;
        }
        //Nếu người chơi rời đi là chủ lobby thì thay đổi quyền chủ lobby sang một người chơi khác trong lobby
        if(player.uid === lobby.lobbyMaster.uid){
            lobby.lobbyMaster = lobby.playerList[0];
        }
        client.json.set('lobbyListDB', '$', lobbyListDB);
        return lobby;
    }

    async deleteLobby(lobbyId){
        console.log('_leaveLobby');
    }

    async getLobbyList(){
        console.log('_getLobbyList');
        let lobbyListDB = await client.json.get('lobbyListDB');
        if(lobbyListDB === null){
            return [];
        }
        return Object.values(lobbyListDB);
    }

    async startFindMatch(lobbyId, player){
        console.log('_startFindMatch');
        let lobbyListDB = await client.json.get('lobbyListDB');
        let lobby = lobbyListDB[lobbyId];
        //Nếu lobby không tồn tại hoặc không phải là chủ lobby thì không thể tìm trận
        if(!lobby || lobby.lobbyStatus != LobbyStatus.None || player.uid !== lobby.lobbyMaster.uid){
            return null;
        }

        //Chuyển trạng thái lobby sang 'Tìm trận'
        lobby.lobbyStatus = LobbyStatus.FindingMatch;
        client.json.set('lobbyListDB', '$', lobbyListDB);

        //Nếu người chơi trong lobby đủ số lượng yêu cầu thì có thể bắt đầu trận đấu
        if(lobby.playerList.length >= lobby.maxPlayer){
            return [lobby];
        }

        //Tìm kiếm trong danh sách các lobby còn lại, nếu có lobby đạt đủ yêu cầu về số lượng người chơi thì bắt đầu
        //TH1:  lobby 1 (2 người) + lobby 3 (2 người) => đủ 4 người
        let otherLobby = null;
        otherLobby = Object.values(lobbyListDB).find(x => x.lobbyId !== lobbyId && x.lobbyStatus === LobbyStatus.FindingMatch && x.playerList.length === lobby.maxPlayer - lobby.playerList.length);
        if(otherLobby){
            return [lobby, otherLobby];
        }
        //TH2: lobby 1 (2 người) + lobby 2 (1 người) + lobby 5 (1 người) => đủ 4 người
        otherLobby = [];
        let counter = 0;
        for (const [key, value] of Object.entries(lobbyListDB)) {
            if(value.lobbyId === lobbyId || value.lobbyStatus !== LobbyStatus.FindingMatch || value.playerList.length + counter > lobby.maxPlayer - lobby.playerList.length){
                continue;
            }
            otherLobby.push(value);
            counter += value.playerList.length;
            if(counter >= lobby.maxPlayer - lobby.playerList.length){
                break;
            }
        }
        //Nếu không đạt yêu cầu
        if(counter !== lobby.maxPlayer - lobby.playerList.length){
            return [];
        }
        return [...[lobby], ...otherLobby];
    }

    async stopFindMatch(lobbyId){
        console.log('_stopFindMatch');
        let lobbyListDB = await client.json.get('lobbyListDB');
        let lobby = lobbyListDB[lobbyId];
        //Nếu lobby không tồn tại hoặc không phải trong trạng thái tìm trận
        if(!lobby || lobby.lobbyStatus != LobbyStatus.FindingMatch){
            return null;
        }

        //Chuyển trạng thái lobby sang 'None'
        lobby.lobbyStatus = LobbyStatus.None;
        client.json.set('lobbyListDB', '$', lobbyListDB);
        return lobby;
    }

    async acceptMatchFound(lobbyId, player){
        console.log('_acceptMatchFound');
        let lobbyListDB = await client.json.get('lobbyListDB');
        let lobby = lobbyListDB[lobbyId];
        //Nếu lobby không tồn tại hoặc không phải trong trạng thái tìm trận
        if(!lobby || lobby.lobbyStatus != LobbyStatus.FindingMatch){
            return false;
        }

        lobby.playerList.find(x => x.uid === player.uid).acceptMatchFound = true;
        client.json.set('lobbyListDB', '$', lobbyListDB);
        return true;
    }

    async declineMatchFound(lobbyId, player){
        console.log('_declineMatchFound');
        return true;
    }

    async matchFound(lobbys){
        console.log('_matchFound');
        let lobbysUnready = [];
        //Duyệt qua các lobby được ghép trận với nhau
        let lobbyListDB = await client.json.get('lobbyListDB');
        for(let i = 0; i < lobbys.length; i++){
            let lobby = lobbyListDB[lobbys[i].lobbyId];
            if(!lobby || lobby.lobbyStatus != LobbyStatus.FindingMatch){
                continue;
            }
            //Duyệt qua từng người chơi trong lobby
            lobby.playerList.forEach(x => {
                //Nếu người chơi không đồng ý ghép trận và lobbysUnready chưa chứa thông tin lobby này
                if(x.acceptMatchFound === false && lobbysUnready.some(x => x.lobbyId === lobby.lobbyId) === false){
                    lobbysUnready.push(lobby);
                }
                x.acceptMatchFound = false;
            });
        }

        if(lobbysUnready.length > 0){
            //Duyệt qua lobbysUnready và xem các lobby từ chối ghép trận và tạm dừng việc ghép trận của lobby đó
            for(let i = 0; i < lobbysUnready.length; i++){
                lobbysUnready[i].lobbyStatus = LobbyStatus.None;
                server.socketIO.in(lobbysUnready[i].lobbyId).emit('stop_find_match_success', 'None');
                server.socketIO.in(lobbysUnready[i].lobbyId).emit('match_found_failure');
            }
        }
        else{
            let playerList = [];
            //Duyệt qua lobbys và gửi sự kiện ghép đội thành công
            for(let i = 0; i < lobbys.length; i++){
                let lobby = lobbyListDB[lobbys[i].lobbyId];
                lobby.lobbyStatus = LobbyStatus.Ingame;
                server.socketIO.in(lobby.lobbyId).emit('stop_find_match_success', 'Ingame');
                server.socketIO.in(lobby.lobbyId).emit('match_found_success');
                playerList = [...playerList, ...lobby.playerList];
            }
            server.roomManager.createRoom(playerList);
        }
        client.json.set('lobbyListDB', '$', lobbyListDB);
    }
}

module.exports = { LobbyManager };

