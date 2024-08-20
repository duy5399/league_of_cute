
class PlayerInfo{
    constructor(socketId){
        this.socketId = socketId;
    }

    get uid(){ return this.info.uid; }

    get nickname(){ return this.info.nickname; }

    get profileImg(){ return this.info.profileImg; }

    get level(){ return this.info.level; }
    set level(value){
        if(value <= 0){
            this.info.level = 1;
        }
        else{
            this.info.level = value;
        }
    }

    get rank(){ return this.info.rank; }
    set rank(value){ this.info.rank = value; }

    get points(){ return this.info.points; }
    set points(value){
        if(value <= 0){
            this.info.points = 1;
        }
        else{
            this.info.points = value;
        }
    }

    get bio(){ return this.info.bio; }
    set bio(value){ this.info.bio = value; }

    get friends(){ return this.info.friends; }
    set friends(value){ this.info.friends = value; }

    get sentFriendRequests(){ return this.info.sentFriendRequests; }
    set sentFriendRequests(value){ this.info.sentFriendRequests = value; }

    get friendRequests(){ return this.info.friendRequests; }
    set friendRequests(value){ this.info.friendRequests = value; }
    
    awake(info){
        this.info = info;
    }

    getInfo(){
        return {
            socketId : this.socketId,
            uid : this.uid,
            nickname : this.nickname,
            profileImg : this.profileImg,
            level : this.level,
            rank : this.rank,
            points : this.points
        }
    }
}

module.exports = { PlayerInfo }