'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AcquiredDataSchema = new Schema({
    source: String,
    timestamp: { type: Date, default: Date.now },
    latencyMs: Number,
    features: [Number],

    featureCount: Number,
    scalerVersion: String,
    createdAt: { type: Date, default: Date.now }, 
    targetdate: Date,
    dailyValues: [Number],

    kunnaMeta: {
        alias: String,
        name: String,
        dayUsed: Number
    },
    
    fetchMeta: {
        timeStart: Date,
        timeEnd: Date
    }

});

module.exports = mongoose.model("acquireData", AcquiredDataSchema);