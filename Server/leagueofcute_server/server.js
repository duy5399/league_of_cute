var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
const PORT = 3000;

const connectToMongoDB = require("./src/db/init.mongodb");
const { connectToRedis } = require("./src/db/init.redis");
const { AccountController } = require("./src/account/accountController");
const { ChatController } = require("./src/chat/chatController");
const { PlayerInfo } = require("./src/player/playerInfo");
const { FriendController } = require("./src/friendControlloer/friendController");
const { LobbyManager } = require("./src/lobbyManager/lobbyManager");
const { RoomManager } = require("./src/roomManager/roomManager");
const { StoreController } = require("./src/store/storeController");
const { Store } = require("./src/models/store.model");
const { RollingOdds } = require("./src/models/rollingOdds.model");
const { Champion } = require("./src/models/champion.model");
const { Monster } = require("./src/models/monster.model");
const Skill = require("./src/models/skill.model");

server.listen(PORT, async () => {
    await connectToMongoDB();
    await connectToRedis();
    console.log('listening on *: ' + PORT);
});

//middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token === 'leagueofcute_duy123') {
        //console.log(socket.handshake);
        next();
    } else {
        //console.log('Invalid token 1');
        next(new Error('Invalid token'));
    }
});

//let store = new Store();
//let rollingOdds = new RollingOdds();
//let champion = new Champion();
//let monster = new Monster();
//let skill = new Skill();

let lobbyManager = new LobbyManager();
let roomManager = new RoomManager();

io.on("connection", async function(socket){
    socket.accountController = new AccountController(socket.id);
    socket.playerInfo = new PlayerInfo(socket.id);
    socket.chatController = new ChatController(socket.playerInfo);
    socket.friendController = new FriendController(socket.playerInfo);
    socket.storeController = new StoreController(socket.playerInfo);

    socket.on('reconnect', (attemptNumber) => {
        //Kết nối lại thành công.
    });

    socket.on('reconnect_failed', () => {
        //Không thể kết nối lại được nữa.
    });

    socket.on('disconnect', () => {
        //Ngắt kết nối
    });

    //#region Account
    socket.on('login', async (loginData) => {
        try{
            let character = await socket.accountController.login(loginData);
            if(character === null){
                return;
            }
            socket.playerInfo.awake(character);
        }
        catch{
            socket.emit('login_failure', 'Có lỗi khi Đăng nhập, hãy thử lại');
        }
    });

    socket.on('register', async (registerData) => {
        try{
            await socket.accountController.register(registerData);
        }
        catch{
            socket.emit('register_failure', 'Có lỗi khi Đăng ký, hãy thử lại');
        }
    });

    socket.on('create_character', async (nickname) => {
        try{
            await socket.accountController.createCharacter(nickname);
        }
        catch{
            socket.emit('create_character_failure', 'Có lỗi khi Tạo nhân vật, hãy thử lại');
        }
    });
    //#endregion

    //#region Chat
    socket.on('send_msg', async (channel, msg, uid) => {
        try{
            await socket.chatController.sendMessage(channel, msg, uid);
        }
        catch{
            socket.emit('login_failure', 'Có lỗi khi Đăng nhập, hãy thử lại');
        }
    });
    //#endregion

    //#region Friend
    //Lấy danh sách bạn bè
    socket.on('get_friend_list', async () => {
        try{
            await socket.friendController.getFriendList();
        }
        catch{
            socket.emit('get_friend_list_failure', 'Có lỗi khi khởi tạo danh sách bạn bè, hãy thử lại');
        }
    });
    //Lấy danh sách yêu cầu kết bạn đã gửi
    socket.on('get_sent_friend_requests', async () => {
        try{
            await socket.friendController.getSentFriendRequests();
        }
        catch{
            socket.emit('get_sent_friend_request_failure', 'Có lỗi khi khởi tạo danh sách kết bạn đã gửi, hãy thử lại');
        }
    });
    //Lấy danh sách yêu cầu kết bạn được nhận
    socket.on('get_friend_requests', async () => {
        try{
            await socket.friendController.getFriendRequests();
        }
        catch{
            socket.emit('get_friend_requests_failure', 'Có lỗi khi khởi tạo danh sách yêu cầu kết bạn được nhận, hãy thử lại');
        }
    });
    //Gửi yêu cầu kết bạn đến người chơi khác
    socket.on('send_friend_request', async (nickname) => {
        try{
            await socket.friendController.sendFriendRequest(nickname);
        }
        catch{
            socket.emit('get_friend_list_success', 'Có lỗi khi gửi yêu cầu kết bạn, hãy thử lại');
        }
    });
    //#endregion

    //#region Lobby
    //Lấy danh sách phòng chờ
    socket.on('get_lobby_list', async () => {
        let lobbyList = await lobbyManager.getLobbyList();
        socket.emit('get_lobby_list_success', JSON.stringify(lobbyList));
        try{
            
        }
        catch{
            socket.emit('get_lobby_list_failure', 'Có lỗi khi lấy danh sách phòng chờ, hãy thử lại');
        }
    });
    //Tạo phòng chờ mới
    socket.on('create_lobby', async () => {
        socket.currentLobby = await lobbyManager.createLobby(socket.playerInfo.getInfo());
        socket.join(socket.currentLobby.lobbyId);
        socket.emit('create_lobby_success', JSON.stringify(socket.currentLobby), JSON.stringify(socket.playerInfo.getInfo()));
        socket.broadcast.emit('update_lobby_info', JSON.stringify(socket.currentLobby));
        try{

        }
        catch{
            socket.emit('create_lobby_failure', 'Có lỗi khi tạo phòng chờ mới, hãy thử lại');
        }
    });

    //Tham gia phòng chờ
    socket.on('join_lobby', async (lobbyId) => {
        try{
            socket.currentLobby = await lobbyManager.joinLobby(lobbyId, socket.playerInfo.getInfo());
            if(socket.currentLobby === null){
                socket.emit('join_lobby_failure', 'Phòng không tồn tại');
                return; 
            }
            socket.join(lobbyId);
            socket.emit('join_lobby_success', JSON.stringify(socket.currentLobby), JSON.stringify(socket.playerInfo.getInfo()));
            socket.to(lobbyId).emit('other_player_join_lobby', JSON.stringify(socket.playerInfo.getInfo()));
            io.emit('update_lobby_info', JSON.stringify(socket.currentLobby));
        }
        catch{
            socket.emit('join_lobby_failure', 'Có lỗi khi tham gia phòng chờ, hãy thử lại');
        }
    });

    //Rời phòng chờ
    socket.on('leave_lobby', async () => {
        try{
            let lobby = await lobbyManager.leaveLobby(socket.currentLobby.lobbyId, socket.playerInfo.getInfo());
            if(lobby === null){
                socket.emit('leave_lobby_failure', 'Thoát thất bại');
                return; 
            }
            socket.leave(socket.currentLobby.lobbyId);
            socket.emit('leave_lobby_success', JSON.stringify(lobby));
            socket.to(socket.currentLobby.lobbyId).emit('other_player_leave_lobby', JSON.stringify(lobby), JSON.stringify(socket.playerInfo.getInfo()));
            io.emit('update_lobby_info', JSON.stringify(lobby));
            socket.currentLobby = null;
        }
        catch{
            socket.emit('leave_lobby_failure', 'Có lỗi khi thoát khỏi phòng chờ, hãy thử lại');
        }
    });

    //Bắt đầu tìm trận
    socket.on('start_find_match', async () => {
        let lobbys = await lobbyManager.startFindMatch(socket.currentLobby.lobbyId, socket.playerInfo.getInfo());
        if(lobbys === null){
            socket.emit('start_find_match_failure', 'Có lỗi khi tìm kiếm trận đấu, hãy thử lại');
            return; 
        }
        io.to(socket.currentLobby.lobbyId).emit('start_find_match_success', 'FindingMatch');
        if(lobbys.length <= 0){
            return;
        }
        //Đạt yêu cầu ghép trận thì gửi sự kiện match_found về cho client ở các phòng chờ
        for(let i = 0; i < lobbys.length; i++){
            io.to(lobbys[i].lobbyId).emit('match_found');
        }
        //Sau 5s kiểm tra xem các client ở các phòng chờ có chấp nhận ghép đội hay không
        setTimeout(() => {
            lobbyManager.matchFound(lobbys);
        }, 5000);
        try{
            
        }
        catch{
            socket.emit('start_find_match_failure', 'Có lỗi khi tìm kiếm trận đấu, hãy thử lại');
        }
    });

    //Dừng việc tìm trận
    socket.on('stop_find_match', async () => {
        try{
            let lobbys = await lobbyManager.stopFindMatch(socket.currentLobby.lobbyId);
            if(lobbys === null){
                socket.emit('stop_find_match_failure', 'Có lỗi khi hủy việc tìm kiếm trận đấu, hãy thử lại');
                return; 
            }
            io.to(socket.currentLobby.lobbyId).emit('stop_find_match_success', 'None');
        }
        catch{
            socket.emit('stop_find_match_failure', 'Có lỗi khi hủy việc tìm kiếm trận đấu, hãy thử lại');
        }
    });

    //Chấp nhận ghép trận
    socket.on('accept_match_found', async () => {
        try{
            let result = await lobbyManager.acceptMatchFound(socket.currentLobby.lobbyId, socket.playerInfo.getInfo());
            if(result === false){
                console.log('Có lỗi khi chấp nhận ghép trận, hãy thử lại');
                return; 
            }
            console.log('Chấp nhận ghép trận thành công');
        }
        catch{
            console.log('Có lỗi khi chấp nhận ghép trận, hãy thử lại');
        }
    });

    //Hủy ghép trận
    socket.on('decline_match_found', async () => {
        try{
            let result = await lobbyManager.declineMatchFound(socket.currentLobby.lobbyId, socket.playerInfo.getInfo());
            console.log('Hủy ghép trận thành công');
        }
        catch{
            console.log('Có lỗi khi hủy ghép trận, hãy thử lại');
        }
    });
    //#endregion

    //#region Room
    //Tham gia phòng chơi
    socket.on('join_room', async () => {
        await socket.currentRoom.joinRoom(socket.playerInfo.getInfo());
        try{
            
        }
        catch{
            console.log('Có lỗi khi tham gia phòng chơi, hãy thử lại');
            //socket.emit('join_room_failure', 'Có lỗi khi tham gia phòng chơi, hãy thử lại');
        }
    });

    //#endregion

    //#region Store
    socket.on('get_store', async () => {
        try{
            await socket.storeController.getStore();
        }
        catch{
            console.log('Có lỗi khi lấy thông tin cửa hàng, hãy thử lại');
        }
    });

    socket.on('equip_store_item', async (itemId) => {
        await socket.storeController.equipItem(itemId);
        try{
            
        }
        catch{
            console.log('Có lỗi khi trang bị vật phẩm, hãy thử lại');
        }
    });

    socket.on('unlock_store_item', async (itemId) => {
        await socket.storeController.unlockItem(itemId);
        try{

        }
        catch{
            console.log('Có lỗi khi mở khóa vật phẩm, hãy thử lại');
        }
    });
    //#endregion

    //#region UnitShop
    socket.on('lock_unit_shop', async () => {
        await socket.playerController.lockUnitShop();
        try{
            ;
        }
        catch{
            console.log('Có lỗi khi lấy thông tin cửa hàng, hãy thử lại');
        }
    });

    socket.on('refresh_unit_shop', async () => {
        await socket.playerController.refreshUnitShop(socket.playerController.unitShop.costRefreshShop);
        try{
            
        }
        catch{
            console.log('Có lỗi khi trang bị vật phẩm, hãy thử lại');
        }
    });

    socket.on('buy_unit', async (index) => {
        await socket.playerController.buyUnit(index);
        try{
            
        }
        catch{
            console.log('Có lỗi khi mua đơn vị, hãy thử lại');
        }
    });

    socket.on('sell_unit', async (unitState) => {
        await socket.playerController.sellUnit(unitState);
        try{
            
        }
        catch{
            console.log('Có lỗi khi bán đơn vị, hãy thử lại');
        }
    });

    socket.on('drag_drop_unit', async (unitState, tile) => {
        await socket.playerController.dragDropUnit(unitState, tile);
        try{
            
        }
        catch{
            console.log('Có lỗi khi bán đơn vị, hãy thử lại');
        }
    });
    //#endregion

    //#region Linh thú
    socket.on('tactician_move', (position) => {
        socket.playerController.tacticianMove(position);
    });
    
    socket.on('tactician_rotate', (rotation) => {
        socket.playerController.tacticianRotate(rotation);
    });
    
    socket.on('tactician_stop', () => {
        socket.playerController.tacticianStop();
    });
    //#endregion

    //#region Vật phẩm
    socket.on('pick_up_item', (itemBase) => {
        socket.playerController.pickupItem(itemBase);
    });

    socket.on('equip_item', async (unitState, itemBase) => {
        await socket.playerController.equipItem(unitState, itemBase);
    });
    //#endregion

    socket.on('display_scoreboard', async () => {
        let scoreboardInfo = await socket.currentRoom.getScoreboard();
        let myInfo = await socket.playerController.getInfo();
        socket.emit('display_scoreboard_success', JSON.stringify(scoreboardInfo), JSON.stringify(myInfo));
    });
});

const socketIoObject = io;
module.exports.socketIO = socketIoObject;
module.exports.roomManager = roomManager;