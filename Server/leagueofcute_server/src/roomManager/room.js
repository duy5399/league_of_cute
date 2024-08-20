const server = require("../../server");
const { client } = require("../db/init.redis");
const uuid = require('uuid');
const _ = require('lodash');
const {parse, stringify, toJSON, fromJSON} = require('flatted');
const PlayerController = require("../playerInfo/playerController");
const { Inventory } = require("../models/inventory.model");
const { ConnectionState, Phases, UnitStatus, RoundMode, OnArea, Rank } = require("../enum/enum");
const MonsterState = require("../monster/monsterState");
const Battlefield = require("../arena/battlefield");
const Arena = require("../arena/arena");
const { MonsterAim } = require("../monster/monsterAnim");
const { UnitSkill } = require("../unit/unitSkill");
const { UnitBuff } = require("../unit/unitBuff");
const { MonsterMove } = require("../monster/monsterMove");
const { MonsterBT } = require("../monster/monsterBT");
const { UnitItem } = require("../unit/unitItem");
const { User } = require('../models/user.model');
const { Character } = require("../models/character.model");
const TACTICIAN_FIXED_POSITION = [[0,0,1], [46,0,0], [0,0,-40], [46,0,-40]];
const ARENA_FIXED_POSITION = [[0,0,0], [50,0,0], [0,0,-50], [50,0,-50]];
const DMG_PER_LOSS = [2, 4, 6];
const PLANNING_DURATION = [30, 35]; //30
const ARRIVAL_DURATION = 5; //5
const BATTLE_DURATION = 30; //30
const END_DURATION = 5; //5
const GOLD_PER_LOSS = 2;
const GOLD_GAIN = [2, 4, 8, 2, 6, 3, 7, 4, 12, 5, 5, 16, 17];
const STAGES = {
    1: [
        {   
            round: 1, goldGain: 10, level: 1, mode: RoundMode.PvE, 
            monsters: [
                { monsterId: 'MeleeMinion', currTile: { x: 5, y: 2}, drop: { gold : [{ odds: 1, min : 2, max : 4}], items : [{ odds: 1, min : 0, max : 1, itemType : "Component" }]}}, 
                { monsterId: 'MeleeMinion', currTile: { x: 5, y: 4}, drop: { gold : [{ odds: 1, min : 2, max : 4}], items : [{ odds: 1, min : 0, max : 1, itemType : "Component" }]}}
            ]
        }
    ],
    2: [
        { 
            round: 1, goldGain: 5, level: 2, mode: RoundMode.PvE,
            monsters: [
                { monsterId: 'RangedMinion', currTile: { x: 4, y: 2}, drop: { gold : [{ odds: 1, min : 2, max : 4}], items : [{ odds: 1, min : 0, max : 1, itemType : "Component" }]}}, 
                { monsterId: 'RangedMinion', currTile: { x: 4, y: 4}, drop: { gold : [{ odds: 1, min : 2, max : 4}], items : [{ odds: 1, min : 0, max : 1, itemType : "Component" }]}},
                { monsterId: 'RangedMinion', currTile: { x: 5, y: 1}, drop: { gold : [{ odds: 1, min : 2, max : 4}], items : [{ odds: 1, min : 0, max : 1, itemType : "Component" }]}}, 
                { monsterId: 'RangedMinion', currTile: { x: 5, y: 4}, drop: { gold : [{ odds: 1, min : 2, max : 4}], items : [{ odds: 1, min : 0, max : 1, itemType : "Component" }]}}
            ]
        } //goldGain: 5 //2,3
    ],
    3: [
        { round: 1, mode: RoundMode.PvP, goldGain: 10,  level: 3},//goldGain: 8 
        { round: 2, mode: RoundMode.PvP, goldGain: 20,  level: 3}
    ],
    4: [
        { round: 1, mode: RoundMode.PvP, goldGain: 10, level: 4},//goldGain: 6
        { round: 2, mode: RoundMode.PvP, goldGain: 20, level: 4}
    ],
    5: [
        { round: 1, mode: RoundMode.PvE, monsters: [{ monsterId: 'Krug', positionX: 4, positionY: 0},
                                            { monsterId: 'Krug', positionX: 4, positionY: 4},
                                            { monsterId: 'Krug', positionX: 5, positionY: 1}], goldGain: 20, level: 5},//goldGain: 7 
        { round: 2, mode: RoundMode.PvP, goldGain: 20, level: 5}//goldGain: 4 
    ],
    6: [
        { round: 1, mode: RoundMode.PvE, monsters: [{ monsterId: 'Murk Wolf', positionX: 4, positionY: 2},
                                            { monsterId: 'Murk Wolf', positionX: 4, positionY: 4},
                                            { monsterId: 'Murk Wolf', positionX: 5, positionY: 1},
                                            { monsterId: 'Murk Wolf', positionX: 5, positionY: 4} ,], goldGain: 12, level: 6},
        { round: 2, mode: RoundMode.PvP, goldGain: 20, level: 6},//goldGain: 5 
        { round: 3, mode: RoundMode.PvP, goldGain: 5, level: 6}
    ],
    7: [
        { round: 1, mode: RoundMode.PvE, monsters: [
            { monsterId: 'BlueSentinel', currTile: { x: 4, y: 3}, drop: { gold : [{ odds: 1, min : 5, max : 10}], items : [{ odds: 1, min : 0, max : 1, itemType : "Core" }]}}
        ], goldGain: 16, level: 7},
        { round: 2, mode: RoundMode.PvP, goldGain: 16, level: 7},
        { round: 2, mode: RoundMode.PvP, goldGain: 7, level: 7}
    ],
    8: [
        { round: 1, mode: RoundMode.PvE, monsters: [
            { monsterId: 'RedBrambleback', currTile: { x: 4, y: 3}, drop: { gold : [{ odds: 1, min : 5, max : 10}], items : [{ odds: 1, min : 0, max : 1, itemType : "Core" }]}}
        ], goldGain: 17, level: 8},
        { round: 2, mode: RoundMode.PvP, goldGain: 10, level: 8},
        { round: 3, mode: RoundMode.PvP, goldGain: 10, level: 8}
    ],
    9: [
        { round: 1, mode: RoundMode.PvE, monsters: [
            { monsterId: 'Dragon', currTile: { x: 4, y: 3}, drop: { gold : [{ odds: 1, min : 10, max : 20}], items : [{ odds: 1, min : 0, max : 1, itemType : "Core" }, { odds: 1, min : 0, max : 1, itemType : "Core" }]}}
        ], goldGain: 10, level: 9},
        { round: 2, mode: RoundMode.PvP, goldGain: 10, level: 9},
        { round: 3, mode: RoundMode.PvP, goldGain: 10, level: 9},
        { round: 5, mode: RoundMode.PvP, goldGain: 10, level: 9},
        { round: 4, mode: RoundMode.PvP, goldGain: 10, level: 9},
    ],
}

class Room{
    constructor(){
        this.playerList = [];
        this.gameDuration = 0;  
        this.gameDurationIntervalId = null;
        this.checkBattleTimeId = null;
        this.loadedMap = false;
        this.started = false;

        this.dmgPerLoss = DMG_PER_LOSS[0];
        this.planningDuration = PLANNING_DURATION[0];
        this.arrivalDuration = ARRIVAL_DURATION;
        this.battleDuration = BATTLE_DURATION;
        this.endDuration = END_DURATION;
        this.goldPerLoss = GOLD_PER_LOSS;
        this.goldGain = GOLD_GAIN[0];
        this.currStage = 0;
        this.currRound = 0;
        this.nextPhaseTimeoutId = null;
        this.currPhase = Phases.End;
        this.nextPhase = true;

        this.arena = [];
    }

    async createRoom(playerList){
        console.log('_createRoom Room');
        //Tạo thông tim phòng
        this.roomId = uuid.v4();
        this.maxPlayer = 2;
        this.password = null;
        
        let storeDB = await client.json.get('storeDB');
        //Tạo thông tin khởi đầu cơ bản cho mỗi người chơi
        for(let i = 0; i < playerList.length; i++){
            let inventory = await Inventory.findOne({ uid : playerList[i].uid });
            playerList[i].tacticianEquip = storeDB[inventory.tacticianEquip];
            playerList[i].arenaSkinEquip = storeDB[inventory.arenaSkinEquip];
            playerList[i].boomEquip = storeDB[inventory.boomEquip];
            playerList[i].connectionState = ConnectionState.Connecting;

            let playerInfo = new PlayerController(this.roomId, playerList[i], i);
            this.playerList.push(playerInfo);

            const socket = server.socketIO.sockets.sockets.get(playerList[i].socketId);
            socket.join(this.roomId);
            socket.currentRoom = this;
            socket.playerController = playerInfo;

            //Tạo các bản sao sàn đấu của người chơi
            this.arena.push(_.cloneDeep(playerInfo.battlefield));
        }
        //Thêm dữ liệu room vào redis
        let roomListDB = await client.json.get('roomListDB');
        if(roomListDB === null){
            roomListDB = {};
        }
        roomListDB[this.roomId] = stringify(this);
        client.json.set('roomListDB', '$', roomListDB);  
        server.socketIO.in(this.roomId).emit('loading_battle_screen', JSON.stringify(playerList));  
        return this;
    }

    async joinRoom(player){
        console.log('_joinRoom: ');
        let foundPlayer = this.playerList.find(x => x.uid === player.uid);
        //Nếu người chơi không có trong phòng này
        if(!foundPlayer){
            return;
        }
        //Thêm người chơi vào room
        foundPlayer.connectionState = ConnectionState.Connected;
        let roomListDB = await client.json.get('roomListDB');
        roomListDB[this.roomId] = stringify(this);
        client.json.set('roomListDB', '$', roomListDB);
        await this.loadMap();
        this.playerList.forEach(x => {
            console.log(x.uid + ' - ' + x.connectionState)
        })
        
        //Kiểm tra đã hoàn thành tải map hay chưa
        if(this.playerList.some(x => x.connectionState === ConnectionState.Connecting) || this.started){
            return;
        }
        this.started = true;
        this.planningPhase();
        server.socketIO.in(this.roomId).emit('load_battle_scene_complete');
        return;
    }

    async loadMap(){
        if(this.loadedMap){
            return;
        }
        this.loadedMap = true;
        console.log('_loadMap: ');
        for(let i = 0; i < this.playerList.length; i++){
            server.socketIO.in(this.roomId).emit('instantiate_tactician', this.playerList[i].socketId, JSON.stringify(this.playerList[i].tactician1.state.toJSON()), TACTICIAN_FIXED_POSITION[i]);
            server.socketIO.in(this.roomId).emit('instantiate_boom', this.playerList[i].socketId, JSON.stringify(this.playerList[i].tactician1.state.toJSON()), JSON.stringify(this.playerList[i].boomEquip));
            server.socketIO.in(this.roomId).emit('instantiate_arena_skin', this.playerList[i].socketId, JSON.stringify(this.playerList[i].arenaSkinEquip), ARENA_FIXED_POSITION[i], this.playerList[i].arena.networkId);
            server.socketIO.in(this.roomId).emit('instantiate_bench', this.playerList[i].socketId, JSON.stringify(this.playerList[i].bench.listTile), this.playerList[i].arena.networkId);
            server.socketIO.in(this.roomId).emit('instantiate_battlefield', this.playerList[i].socketId, JSON.stringify(this.playerList[i].battlefield.listTile), this.playerList[i].arena.networkId);
            server.socketIO.in(this.roomId).emit('instantiate_item_inventory', this.playerList[i].socketId, JSON.stringify(this.playerList[i].itemInventory.listTile), this.playerList[i].arena.networkId);
            server.socketIO.in(this.roomId).emit('instantiate_item_inventory', this.playerList[i].socketId, JSON.stringify(this.playerList[i].itemInventory.listTile), this.playerList[i].arena.networkId);
            server.socketIO.to(this.playerList[i].socketId).emit('arrival_camera_to_other_arena', this.playerList[i].arena.networkId);
        } 
    }

    initMatch(){
        
    }

    startMatch(){

    }

    pauseMatch(){

    }

    resumeMatch(){

    }

    endMatch(){

    }

    checkBattle(){
        let allBattleOver = true;
        //Kiểm tra từng Sâu đấu xem đã kết thúc trận chiến hay chưa?
        for(let i = 0; i < this.arena.length; i++){
            if(this.arena[i].battleOver || (!this.arena[i].home && !this.arena[i].away)){
                continue;
            }
            //Kiểm tra tất cả đơn vị của đội khách hoặc đội chủ nhà đã bị hạ gục hết hay chưa?
            let checkHome = this.arena[i].homeTeamComps.some(x => x.state.hp > 0 || !x.state.dead);
            let checkAway = this.arena[i].awayTeamComps.some(x => x.state.hp > 0 || !x.state.dead);
            //Cả 2 đội vẫn còn đơn vị đang chiến đấu
            if(checkHome && checkAway){
                //console.log('checkHome && checkAway: ' + checkHome + checkAway);
                allBattleOver = false;
                continue;
            }
            //Một trong 2 đội không còn đơn vị nào tồn tại
            this.arena[i].battleOver = true;
            this.stopBattlefield(this.arena[i]);
            //Đội chủ nhà thua cuộc
            if(!checkHome){
                this.takeDamage(this.arena[i].home);
                this.dealDamage(this.arena[i].away, this.arena[i].home);
            }
            else if(!checkAway){
                this.takeDamage(this.arena[i].away);
                this.dealDamage(this.arena[i].home, this.arena[i].away);
            }
            this.updateScoreboard();
        }
        return allBattleOver;
        //Nếu tất cả 
        //TODO: sau khi
    }

    dealDamage(winner, loser){
        if(winner === RoundMode.PvE || loser === RoundMode.PvE){
            return;
        }
        server.socketIO.in(this.roomId).emit('tactician_deal_damage', JSON.stringify(winner.tactician1.state.toJSON()), JSON.stringify(loser.tactician1.state.toJSON()));
    }


    takeDamage(loser){
        if(loser === RoundMode.PvE){
            return;
        }
        loser.tactician1.state.hp -= this.dmgPerLoss;
        server.socketIO.in(this.roomId).emit('tactician_take_damage', JSON.stringify(loser.tactician1.state.toJSON()));
        if(loser.tactician1.state.hp <= 0){
            server.socketIO.to(loser.socketId).emit('on_dead');
        }
    }

    countdownTimer(duration){
        server.socketIO.in(this.roomId).emit('countdownTimer', duration);
    }

    //Cập nhật thông tin round mới
    nextRound(){
        if(this.currStage === 0){
            this.currStage++;
        }
        else{
            if(this.currRound < STAGES[this.currStage].length - 1){
                this.currRound++;
            }
            else{
                this.currStage++;
                this.currRound = 0;
                //socketio.UpgradeLevelAllPlayer(_roomName);
            }
        }
        switch(this.currStage){
            case 1:
            case 2:
            case 3:
            case 4:
                this.dmgPerLoss = DMG_PER_LOSS[0];
                break;
            case 5:
            case 6:
            case 7:
                this.dmgPerLoss = DMG_PER_LOSS[1];
                this.planningDuration = PLANNING_DURATION[1];
                break;
            case 8:
            case 9:
                this.dmgPerLoss = DMG_PER_LOSS[2];
                break;
        }
        //Gửi thông tin về client và c6ap5 nhật hiển thị
        server.socketIO.in(this.roomId).emit('new_round', this.currStage, this.currRound+1);
    }

    changeLevelForPlayer(){
        if(!STAGES[this.currStage][this.currRound].hasOwnProperty('level')){
            return;
        }
        let level = STAGES[this.currStage][this.currRound].level;
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].tactician1.state.hp <= 0 || this.playerList[i].tactician1.state.dead === true || this.playerList[i].tactician1.state.level === level){
                continue;
            }
            this.playerList[i].levelUp(level);
            this.playerList[i].increaseMaxUnitOnBattlefield(1);
        }
    }

    //thêm vàng cho tất cả người chơi
    addGoldForPlayer(){
        this.goldGain = STAGES[this.currStage][this.currRound].goldGain;
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].tactician1.state.hp <= 0 || this.playerList[i].tactician1.state.dead === true){
                continue;
            }
            this.playerList[i].addGold(this.goldGain);
        }
    }

    //tự động upgrade các unit nếu đủ điều kiện
    autoUpgradeUnitForPlayer(){
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].tactician1.state.hp <= 0 || this.playerList[i].tactician1.state.dead === true){
                continue;
            }
            this.playerList[i].autoUpgradeUnit();
        }
    }

    //cập nhật tỉ lệ roll tướng cho tất cả người chơi
    async changeRollingOddsForPlayer(){
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].tactician1.state.hp <= 0 || this.playerList[i].tactician1.state.dead === true){
                continue;
            }
            await this.playerList[i].changeRollingOdds();
        }
    }

    //làm mới unit shop cho tất cả người chơi
    async refreshUnitShopForPlayer(){
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].tactician1.state.hp <= 0 || this.playerList[i].tactician1.state.dead === true){
                continue;
            }
            console.log('async refreshUnitShopForPlayer:')
            await this.playerList[i].refreshUnitShop(0);
        }
    }

    changeUnitStatus(status){
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].tactician1.state.hp <= 0 || this.playerList[i].tactician1.state.dead === true){
                continue;
            }
            this.playerList[i].changeUnitStatus(status);
        }
    }

    activeTraits(isActive){
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].tactician1.state.hp <= 0 || this.playerList[i].tactician1.state.dead === true){
                continue;
            }
            this.playerList[i].activeTraits(isActive);
        }
    }

    changePhase(phase){
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].tactician1.state.hp <= 0 || this.playerList[i].tactician1.state.dead === true){
                continue;
            }
            this.playerList[i].currPhase = phase;
            server.socketIO.in(this.roomId).emit('new_phase', phase);
        }
    }

    //bắt đầu 
    startAllBattlefield(){
        for(let i = 0; i < this.arena.length; i++){
            if(this.arena[i].battleOver || (!this.arena[i].home && !this.arena[i].away)){
                continue;
            }
            this.startBattlefield(this.arena[i]);
        }
    }

    startBattlefield(arena){
        for(let i = 0; i < arena.homeTeamComps.length; i++){
            arena.homeTeamComps[i].behaviour.startBT();
            arena.homeTeamComps[i].item.active();
        }
        for(let i = 0; i < arena.awayTeamComps.length; i++){
            arena.awayTeamComps[i].behaviour.startBT();
            arena.awayTeamComps[i].item.active();
        }
    }

    //dừng
    stopAllBattlefield(){
        for(let i = 0; i < this.arena.length; i++){
            if(this.arena[i].battleOver || (!this.arena[i].home && !this.arena[i].away)){
                continue;
            }
            this.stopBattlefield(this.arena[i]);
            //Kiểm tra tất cả đơn vị của đội khách hoặc đội chủ nhà đã bị hạ gục hết hay chưa?
            this.arena[i].battleOver = true;
            this.takeDamage(this.arena[i].home);
            this.dealDamage(this.arena[i].away, this.arena[i].home);
            this.takeDamage(this.arena[i].away);
            this.dealDamage(this.arena[i].home, this.arena[i].away);
        }
    }

    stopBattlefield(arena){
        for(let i = 0; i < arena.homeTeamComps.length; i++){
            arena.homeTeamComps[i].behaviour.stopBT();
            arena.homeTeamComps[i].item.inactive();
        }
        for(let i = 0; i < arena.awayTeamComps.length; i++){
            arena.awayTeamComps[i].behaviour.stopBT();
            arena.awayTeamComps[i].item.inactive();
        }
    }

    updateScoreboard(){
        this.playerList.sort((a, b) => b.tactician1.state.hp - a.tactician1.state.hp).forEach((value, i) => { value.place = i; });
        var scoreboard = [];
        for(let player of this.playerList){
            let data = {
                uid : player.uid,
                nickname : player.nickname,
                profileImg : player.profileImg,
                hp : player.tactician1.state.hp,
                maxHP : player.tactician1.state.maxHP
            };
            scoreboard.push(data);
        }
        server.socketIO.in(this.roomId).emit('update_scoreboard', JSON.stringify(scoreboard));
    }

    async checkEndGame(){
        //Kiểm tra số người chơi còn sống, nếu <= 1 thì kết thúc
        let playerSurvival = this.playerList.filter(element => element.tactician1.state.hp > 0);
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].tactician1.state.dead === true){
                continue;
            }
            if(playerSurvival.length === 1 && i === 0){
                await this.battlePoint(this.playerList[i]);
                server.socketIO.to(this.playerList[i].socketId).emit('end_game', i);
                continue;
            }
            if(this.playerList[i].tactician1.state.hp <= 0){
                this.playerList[i].tactician1.state.dead = true;
                await this.battlePoint(this.playerList[i]);
                server.socketIO.to(this.playerList[i].socketId).emit('end_game', i);
                //server.socketIO.in(this.roomId).emit('destroy_tactician', JSON.stringify(this.playerList[i].tactician1.state.toJSON()));
            }
        }
        if(playerSurvival.length <= 1){
            return true;
        }
        return false;
    }

    async battlePoint(player){
        let addPoint = 0;
        switch(player.place){
            case 0:
                addPoint = 20; player.addPoint = 20; break;
            case 1:
                addPoint = 10; player.addPoint = 10; break;
            case 2:
                addPoint = -15; player.addPoint = -15; break;
            case 3:
                addPoint = -30; player.addPoint = -30; break;
        }
        var character = await Character.findOne({uid : player.uid}).exec();
        if(!character){
            return;
        }
        player.points += addPoint;
        character.points += addPoint;
        if(character.points < 0){
            player.points = 0;
            character.points = 0;
        }
        if(character.points <= 100){
            player.rank = Rank.Bronze;
            character.rank = Rank.Bronze;
        }
        else if(100 < character.points && character.points <= 200){
            player.rank = Rank.Silver;
            character.rank = Rank.Silver;
        }
        else if(200 < character.points && character.points <= 300){
            player.rank = Rank.Gold;
            character.rank = Rank.Gold;
        }
        else if(300 < character.points && character.points <= 400){
            player.rank = Rank.Platinum;
            character.rank = Rank.Platinum;
        }
        else if(400 < character.points && character.points <= 600){
            player.rank = Rank.Diamond;
            character.rank = Rank.Diamond;
        }
        else if(600 < character.points && character.points <= 800){
            player.rank = Rank.Master;
            character.rank = Rank.Master;
        }
        else if(800 < character.points && character.points <= 1000){
            player.rank = Rank.Grandmaster;
            character.rank = Rank.Grandmaster;
        }
        else if(1000 < character.points){
            player.rank = Rank.Challenger;
            character.rank = Rank.Challenger;
        }
        character.save((e) => {
            if(e) console.log(e);
        })
    }

    resetBattlefield(){
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].tactician1.state.hp <= 0 || this.playerList[i].tactician1.state.dead === true){
                continue;
            }
            this.playerList[i].resetBattlefield();
        }
        for(let i = 0; i < this.arena.length; i++){
            if(!this.arena[i].home || !this.arena[i].away){
                continue;
            }
            if(this.arena[i].away === RoundMode.PvE){
                this.arena[i].awayTeamComps.forEach(element => {
                    server.socketIO.in(this.roomId).emit('destroy_monster', JSON.stringify(element.state.toJSON()));
                });
            }
            else{
                this.arena[i].awayTeamComps.forEach(element => {
                    server.socketIO.in(this.roomId).emit('arrival_unit_to_other_arena', this.arena[i].away.arena.networkId, JSON.stringify(element.state.toJSON()));
                })
                server.socketIO.in(this.roomId).emit('arrival_tactitcian_to_other_arena', this.arena[i].away.arena.networkId, JSON.stringify(this.arena[i].away.tactician1.state.toJSON()), true);
                server.socketIO.to(this.arena[i].away.socketId).emit('arrival_camera_to_other_arena', this.arena[i].away.arena.networkId);
            }
            this.arena[i].battleOver = false;
            this.arena[i].home = null;
            this.arena[i].homeTeamComps = [];
            this.arena[i].away = null;
            this.arena[i].awayTeamComps = [];
            this.arena[i].listTile.forEach(element => {
                element.unit = null;
                element.walkable = true;
            });
        }
    }

    async planningPhase(){
        console.log('planningPhase');
        this.currPhase = Phases.Planning;
        this.nextRound();
        this.changeLevelForPlayer();
        this.countdownTimer(this.planningDuration);
        this.changePhase(Phases.Planning);
        this.resetBattlefield();
        this.autoUpgradeUnitForPlayer();
        this.changeUnitStatus(UnitStatus.Resting);
        await this.changeRollingOddsForPlayer();
        this.addGoldForPlayer();
        await this.refreshUnitShopForPlayer();
        //thay đổi phase: planning phase cho phép người chơi chỉnh sửa đội hình trên sàn đấu
        // socketio.EmitToAllClientsInRoom(_roomName, "change-phase", "PlanningPhase");
        this.nextPhaseTimeoutId = setTimeout(() =>{
            this.arrivalPhase();
        }, this.planningDuration * 1000);
    }

    async arrivalPhase(){
        console.log('arrivalPhase');
        this.currPhase = Phases.Arrival;
        this.changePhase(Phases.Arrival);
        this.changeUnitStatus(UnitStatus.ReadyToFight);
        this.countdownTimer(this.arrivalDuration);

        //nếu là round đấu với Quái vật (nhận thêm vàng và trang bị)
        if(STAGES[this.currStage][this.currRound].mode == RoundMode.PvE){
            let monsterDB = await client.json.get('monsterDB');
            let monsters = STAGES[this.currStage][this.currRound].monsters;

            //Duyệt qua từng người chơi
            for(let i = 0; i < this.playerList.length; i++){
                if(this.playerList[i].tactician1.state.hp <= 0 || this.playerList[i].tactician1.state.dead === true){
                    continue;
                }
                //Thêm thông tin người chơi, đội hình cho sân đấu
                this.arena[i].home = this.playerList[i];
                this.arena[i].homeTeamComps = this.playerList[i].battlefield.listTile.filter(x => x.unit !== null).map(x => x.unit);
                //TODO: lỗi di chuyển do tile.walkable = false; 
                this.arena[i].homeTeamComps.forEach(unit => {
                    unit.state.arena = this.arena[i];
                    let tile = this.arena[i].listTile.find(element => element.x === unit.state.currTile.x && element.y === unit.state.currTile.y);
                    tile.unit = unit;
                    tile.walkable = false;
                });

                this.arena[i].away = RoundMode.PvE;
                //Duyệt qua danh sách quái vật xuât hiện trong round này khởi tạo thông tin cơ bản
                for(let j = 0; j < monsters.length; j++){
                    let monster = {};
                    monster.state = new MonsterState(this.roomId, monsterDB[monsters[j].monsterId], monster);
                    monster.anim = new MonsterAim(monster);
                    monster.move = new MonsterMove(monster);
                    monster.skill = new UnitSkill(monster);
                    monster.buff = new UnitBuff(monster);
                    monster.item = new UnitItem(monster);
                    monster.behaviour = new MonsterBT(monster);
                    let tile = this.arena[i].listTile.find(element => element.x === monsters[j].currTile.x && element.y === monsters[j].currTile.y);
                    monster.state.itemInventory = this.playerList[i].itemInventory;
                    monster.state.drop = monsters[j].drop;
                    monster.state.currTile = tile;
                    monster.state.position = tile.position;
                    monster.state.onArea = OnArea.Battlefield;
                    monster.state.arena = this.arena[i];
                    monster.behaviour.setupBT();
                    tile.unit = monster;
                    tile.walkable = false;

                    this.arena[i].awayTeamComps.push(monster);
                }
                server.socketIO.in(this.roomId).emit('add_monster_pve', this.playerList[i].socketId, JSON.stringify(this.arena[i].awayTeamComps.map(x => x.state.toJSON())));
            }
        }
        //nếu là round đấu với người chơi khác
        else{
            let shufflePlayerLst = this.playerList.filter(element => { return element.tactician1.state.hp > 0; }).sort(() => Math.random() - 0.5);
            const numberPlayersOnBattlefield = 2;
            let matchPair = new Array(Math.ceil(shufflePlayerLst.length / numberPlayersOnBattlefield)).fill().map(x => shufflePlayerLst.splice(0, numberPlayersOnBattlefield));
            //Duyệt qua từng cặp đấu được ghép 1 cách ngẫu nhiên
            for(let i = 0; i < matchPair.length; i++){
                if(matchPair[i].length % 2 === 0){
                    //Thêm thông tin người chơi, đội hình cho sân đấu
                    this.arena[i].home = matchPair[i][0];
                    this.arena[i].homeTeamComps = matchPair[i][0].battlefield.listTile.filter(x => x.unit !== null).map(x => x.unit);
                    this.arena[i].homeTeamComps.forEach(unit => {
                        let tile = this.arena[i].listTile.find(element => element.x === unit.state.currTile.x && element.y === unit.state.currTile.y);
                        tile.unit = unit;
                        tile.walkable = false;
                        unit.state.arena = this.arena[i];
                    });

                    this.arena[i].away = matchPair[i][1];
                    this.arena[i].awayTeamComps = matchPair[i][1].battlefield.listTile.filter(x => x.unit !== null).map(x => x.unit);
                    this.arena[i].awayTeamComps.forEach(unit => {
                        let tile = this.arena[i].listTile.find(element => element.x === (this.arena[i].row - 1 - unit.state.currTile.x) && element.y === (this.arena[i].col - 1 - unit.state.currTile.y));
                        tile.unit = unit;
                        tile.walkable = false;
                        unit.state.arena = this.arena[i];
                        unit.state.currTile = tile;
                        unit.state.position = tile.position;
                        server.socketIO.in(this.roomId).emit('arrival_unit_to_other_arena', matchPair[i][0].arena.networkId, JSON.stringify(unit.state.toJSON()));
                    });
                    server.socketIO.in(this.roomId).emit('arrival_tactitcian_to_other_arena', matchPair[i][0].arena.networkId, JSON.stringify(this.playerList[i].tactician1.state.toJSON()), false);
                    server.socketIO.to(matchPair[i][1].socketId).emit('arrival_camera_to_other_arena', matchPair[i][0].arena.networkId);
                }
                else{
                    //socketio.EmitToClient(i[0].socketid, "opponent", i[1].username);
                }
            }
        }
        //----
        this.nextPhaseTimeoutId = setTimeout(() =>{
            this.battlePhase();
        }, this.arrivalDuration * 1000);
    }

    async battlePhase(){
        console.log('battlePhase');
        this.currPhase = Phases.Battle;
        this.changePhase(Phases.Battle);
        this.activeTraits(true);
        this.changeUnitStatus(UnitStatus.Fighting);
        this.countdownTimer(this.battleDuration);
        this.startAllBattlefield();
        this.checkBattleTimeId = setInterval(() => {
            if(this.checkBattle()){
                clearInterval(this.checkBattleTimeId);
                clearTimeout(this.nextPhaseTimeoutId);
                this.endPhase();
            }
        }, 20);
        this.nextPhaseTimeoutId = setTimeout(() =>{
            clearInterval(this.checkBattleTimeId);
            this.endPhase();
        }, this.battleDuration * 1000);
    }

    async endPhase(){
        console.log('endPhase');
        this.currPhase = Phases.End;
        this.changePhase(Phases.End);
        this.changeUnitStatus(UnitStatus.EndFight);
        this.countdownTimer(this.endDuration);
        this.stopAllBattlefield();
        this.updateScoreboard();
        // let isEnd = await this.checkEndGame();
        // if(isEnd){
        //     clearTimeout(this.nextPhaseTimeoutId);
        //     return;
        // }
        this.nextPhaseTimeoutId = setTimeout(() =>{
            this.planningPhase();
        }, this.endDuration * 1000);
    }

    async getScoreboard(){
        let scoreboardInfo = [];
        this.playerList.forEach((value, i) => { 
            let data = {
                uid : value.uid,
                nickname : value.nickname,
                profileImg : value.profileImg,
                place : i,
                formation : value.getFormation()
            };
            scoreboardInfo.push(data);
        });
        return scoreboardInfo;
    }
}

module.exports = { Room };



