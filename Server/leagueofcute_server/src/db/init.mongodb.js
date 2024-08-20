const mongoose = require('mongoose');

//leagueofcute:JhtckBPx129yHWsB
const connectToMongoDB = async () => {
    try{
        mongoose.set('strictQuery', false);
        mongoose.connect('mongodb+srv://leagueofcute:JhtckBPx129yHWsB@cluster0.a89vfs5.mongodb.net/leagueofcute_00?retryWrites=true&w=majority');
        console.log("Mongo connection succesfully");
    }
    catch(e){
        console.log("Mongo connection error " + e);
    }
};

module.exports = connectToMongoDB;