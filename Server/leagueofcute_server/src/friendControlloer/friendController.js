const server = require("../../server");
const { Character } = require("../models/character.model");

class FriendController{
    constructor(player){
        this.player = player;
    }

    async getFriendList(){
        console.log('_getFriendList');
        let friendList = [];
        for(var i = 0; i < this.player.friends.length; i++){
            const friendInfo = await Character.findOne({ uid : this.player.friends[i] });
            if(!friendInfo){
                continue;
            }
            friendList.push({
                uid : friendInfo.uid,
                nickname : friendInfo.nickname,
                profileImg : friendInfo.profileImg,
                bio : friendInfo.bio,
            });
        }
        server.socketIO.to(this.player.socketId).emit('get_friend_list_success', JSON.stringify(friendList));
    };

    async getSentFriendRequests(){
        console.log('_getSentFriendRequests');
        let requestList = [];
        for(var i = 0; i < this.player.sentFriendRequests.length; i++){
            const requestInfo = await Character.findOne({ uid :  this.player.sentFriendRequests[i] });
            if(!requestInfo){
                continue;
            }
            requestList.push({
                uid : requestInfo.uid,
                nickname : requestInfo.nickname,
                profileImg : requestInfo.profileImg,
                bio : requestInfo.bio,
            });
        }
        server.socketIO.to(this.player.socketId).emit('get_sent_friend_requests_success', JSON.stringify(requestList));
    };

    async getFriendRequests(){
        console.log('_getFriendRequests');
        let requestList = [];
        for(var i = 0; i < this.player.friendRequests.length; i++){
            const requestInfo = await Character.findOne({ uid :  this.player.friendRequests[i] });
            if(!requestInfo){
                continue;
            }
            requestList.push({
                uid : requestInfo.uid,
                nickname : requestInfo.nickname,
                profileImg : requestInfo.profileImg,
                bio : requestInfo.bio,
            });
        }
        server.socketIO.to(this.player.socketId).emit('get_friend_requests_success', JSON.stringify(requestList));
    };

    //------------------
    
    async sendFriendRequest(nickname){
        console.log('_sendFriendRequest');
        if(nickname === this.player.nickname){
            server.socketIO.to(this.player.socketId).emit('send_friend_request_failure', 'Không thể kết bạn với bản thân');
            return;
        }
        let playerFound = await Character.findOne({nickname : nickname});
        if(!playerFound){
            server.socketIO.to(this.player.socketId).emit('send_friend_request_failure', 'Không tìm thấy người chơi');
            return;
        }
        if(playerFound.friendRequests.includes(this.player.uid)){
            server.socketIO.to(this.player.socketId).emit('send_friend_request_failure', 'Đã gửi lời mời kết bạn, chờ đối phương phản hồi');
            return;
        }

        this.player.sentFriendRequests.push(playerFound.uid);
        this.player.info.save((e) => {
            if(e) {
                console.log(e);
            }
        });
        playerFound.friendRequests.push(this.player.uid);
        playerFound.save((e) => {
            if(e) {
                console.log(e);
            }
        });

        let requestInfo = {
            uid : playerFound.uid,
            nickname : playerFound.nickname,
            profileImg : playerFound.profileImg,
            bio : playerFound.bio,
        }
        server.socketIO.to(this.player.socketId).emit('send_friend_request_success', JSON.stringify(requestInfo)); 

    };
    
    async acceptRequest(uid){
        let friendCharacter = await Character.findOne({ uid });
        if(!friendCharacter){
            server.socketIO.to(this.player.socketId).emit('accept-friend-fail');
            return;
        }
        if(!(friendCharacter.friends || []).includes(uid)){
            if(friendCharacter.friends === undefined){
                friendCharacter.friends = [];
            }
            friendCharacter.friends.push(this.player.uid);
            await friendCharacter.save();
        }
        if(!(this.player.friends || []).includes(uid)){
            if(this.player.friends === undefined){
                this.player.friends = [];
            }
            this.player.friends.push(uid);
            this.player.request_add_friend.pull(uid);
            await this.player.save();
    
            let listOfAllCharacters = await client.json.get('list_of_all_players');
            if(!listOfAllCharacters.hasOwnProperty(uid)){
                //console.log('_sent-accept-friend-fail');
            }
            else{
                const socketId = listOfAllCharacters[uid].socketId;
                let infoAccept = {};
                infoAccept.uid = this.player.uid;
                infoAccept.nickname = this.player.nickname;
                infoAccept.level = this.player.level;
                infoAccept.isOnline = true;
                infoAccept.profileImg = this.player.profileImg;
                infoAccept.borderProfile = this.player.borderProfile;
                server.socketIO.to(socketId).emit('another-player-accpet-add-friend', JSON.stringify(infoAccept)); 
            }
        }
        server.socketIO.to(this.player.socketId).emit('accept-friend-success', uid);
    };
    
    async declineRequest(uid){
        this.player.request_add_friend.pull(uid);
        await this.player.save();
    
        server.socketIO.to(this.player.socketId).emit('decline-friend-success', uid);
    };
}

module.exports = { FriendController }