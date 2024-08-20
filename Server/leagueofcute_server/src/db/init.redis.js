const redis = require('redis')
const { promisify }  = require('util');
const { Champion } = require('../models/champion.model');
const { Item } = require('../models/item.model');
const { Monster } = require('../models/monster.model');
const { RollingOdds } = require('../models/rollingOdds.model');
const { Store } = require('../models/store.model');
const { Trait } = require('../models/trait.model');

const client = redis.createClient({
    password: '66Ru7eFDeZZDApUK1Duiiaea9WrTLdx7',
    socket: {
        host: 'redis-11536.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com',
        port: 11536
    }
});

const connectToRedis = async () => {
    try{
        client.connect();
    }
    catch(e){
        console.log("Redis client connection error " + e);
    }
};

client.on('connect', async () => {
    let store = await Store.find();
    let stores = {};
    store.forEach(x => {
        stores[x.itemId] = x;
    });
    client.json.set('storeDB', '$', stores);

    let rollingOdds = await RollingOdds.find();
    let odds = {};
    rollingOdds.forEach(x => {
        odds[x.level] = x;
    });
    client.json.set('rollingOddsDB', '$', odds);

    let champion = await Champion.find();
    let champions = {};
    champion.forEach(x => {
        champions[x.unitId] = x;
    });
    client.json.set('championDB', '$', champions);

    let monster = await Monster.find();
    let monsters = {};
    monster.forEach(x => {
        monsters[x.unitId] = x;
    });
    client.json.set('monsterDB', '$', monsters);

    let trait = await Trait.find();
    let traits = {};
    trait.forEach(x => {
        traits[x.traitId] = x;
    });
    client.json.set('traitDB', '$', traits);

    let item = await Item.find();
    let items = {};
    item.forEach(x => {
        items[x.itemId] = x;
    });
    client.json.set('itemDB', '$', items);

    console.log('Redis client connected');
});

client.on('error', (error) => {
    console.log('Redis client error' + error);
});
const redisGetAsync = promisify(client.get).bind(client);
// const redisGetAsync = async () => {
//     return await promisify(client.get).bind(client);
// }

module.exports = {client, redisGetAsync, connectToRedis};