const server = require("../../server");

class ChatController{
    constructor(player){
        this.player = player;
    }

    //Tham gia các phòng chat mặc định: Thế giới, Công hội,...
    start(){
        let rooms = ['World'];
        server.socketIO.sockets.sockets.get(this.player.socketId).join(rooms);
    }
    
    //Gửi tin nhắn
    async sendMessage(channel, msg, uid){
        if(msg === '' || (channel === ChatChannel.Private && uid === '')){
            return;
        }
        const infoMsg = {   'uid': this.player.uid, 
                            'nickname': this.player.nickname, 
                            'level' : this.player.level, 
                            'profileImg': this.player.profileImg,
                            'channel' : channel,
                            'msg': msg,
                            };
        switch(channel){
            case ChatChannel.World:    
                server.socketIO.to(this.player.socketId).emit('send_msg_success', JSON.stringify(infoMsg));
                server.socketIO.to(ChatChannel.World).except(this.player.socketId).emit('receive_msg_success', JSON.stringify(infoMsg));
                break;
            case ChatChannel.InRoom:     
                server.socketIO.to(this.player.socketId).emit('send_msg_success', JSON.stringify(infoMsg));
                server.socketIO.to(ChatChannel.InRoom).except(this.player.socketId).emit('receive_msg_success', JSON.stringify(infoMsg));
                break;
            case ChatChannel.Private: 
                server.socketIO.to(this.player.socketId).emit('send_msg_success', JSON.stringify(infoMsg));
                let sockets = await server.socketIO.fetchSockets();
                let toCharacter = sockets.find(x => x.id != this.player.socketId && x.player.uid === uid);
                if(!toCharacter){
                    return;
                }
                server.socketIO.to(toCharacter.player.socketId).emit('receive_msg_success', JSON.stringify(infoMsg));
                break;
            default:
                break;
        }
    }
}

const ChatChannel = {
    World : 'World',
    InRoom : 'InRoom',
    Private : 'Private'
}
   
module.exports = { ChatController }