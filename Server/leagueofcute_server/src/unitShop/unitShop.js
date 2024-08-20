const server = require("../../server");
const { client } = require("../db/init.redis");
const { ChampionState } = require("../champion/championState");
const GOLD = 5;
const COST_REFRESH_SHOP = 2;
const SHOP_LOCKED = false;

class UnitShop{
    constructor(roomId, bench, battlefield){
        this.roomId = roomId;
        this.bench = bench;
        this.battlefield = battlefield;
        this.rollingOdds = null;
        this.champions = [];
        this.gold = GOLD;
        this.costRefreshShop = COST_REFRESH_SHOP;
        this.shopLocked = SHOP_LOCKED;   
    }

    async changeRollingOdds(level){
        let rollingOddsDB = await client.json.get('rollingOddsDB');
        this.rollingOdds = rollingOddsDB[level];
        return this.rollingOdds;
    }

    lockUnitShop(){
        if(this.shopLocked){
            this.shopLocked = false;
        }
        else{
            this.shopLocked = true;
        }
        return this.shopLocked;
    }

    async refreshUnitShop(){
        if(this.shopLocked){
            return null;
        }

        if(!this.rollingOdds){
            let rollingOddsDB = await client.json.get('rollingOddsDB');
            this.rollingOdds = rollingOddsDB[1];
        }

        //Làm mới và lấy ngẫu nhiên 5 champion
        this.champions = [];
        let shop = [];
        for (let i = 0; i < 5 ; i++) {
            var unit = await this.getRandomUnit();
            let champion = {};
            champion.state = new ChampionState(this.roomId, unit, champion);
            this.champions.push(champion);
            shop.push(champion.state.toJSON());
        }
        return shop;
    }

    async getRandomUnit(){
        //Ngẫu nhiên tier từ 1 đến 5 (phụ thuộc vào rollingOdds hiện tại của người chơi)
        const randomValue = Math.floor(Math.random() * 101);
        let num = 0;
        let tier;
        for (let i = 1; i < 6 ; i ++) {
            num += this.rollingOdds["tier"+i];
            if (randomValue <= num) {
                tier = i;
                break;
            }
        }
        let champion = await this.getRandomChampionByTier(tier);
        return champion;
    }

    async getRandomChampionByTier(tier){
        //Lấy ngẫu nhiên champion thuộc tier truyền vào
        let championDB = await client.json.get('championDB');
        let champions = Object.values(championDB).filter(x => x.tier === tier);
        //let champions = Object.values(championDB).filter(x => x.unitId === 'Ahri');
        if(champions.length === 0){
            return null;
        }
        return champions[Math.floor(Math.random() * champions.length)];
    }

    buyUnit(index){
        if(this.champions[index] === null){
            return null;
        }
        //let champion = {};
        //champion.state = new ChampionState(this.roomId, this.champions[index], champion);
        return this.champions[index];
    }
}

module.exports = UnitShop;