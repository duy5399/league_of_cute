const mongoose = require("mongoose");

const rollingOddsSchema = new mongoose.Schema({
    level: { type: Number, default: 0 },
    tier1: { type: Number, default: 0 },
    tier2: { type: Number, default: 0 },
    tier3: { type: Number, default: 0 },
    tier4: { type: Number, default: 0 },
    tier5: { type: Number, default: 0 }
});

const RollingOdds = mongoose.model("rollingOdds", rollingOddsSchema);
module.exports = { RollingOdds };