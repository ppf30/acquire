const mongoose = require("mongoose");

const AcquiredDataSchema = new mongoose.Schema({
  features: { 
    type: [Number], 
    required: true,
    validate: {
      validator: v => Array.isArray(v) && v.length === 7,
      message: 'Features must be an array of 7 numbers'
    }
  },
  featureCount: { type: Number, default: 7 },
  scalerVersion: { type: String, default: 'v1' },
  rawData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AcquiredData", AcquiredDataSchema);
