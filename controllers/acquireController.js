// controllers/acquireController.js
const { fetchKunna } = require("../services/kunnaService");
const AcquiredData = require("../data/acquireData"); 

// Constantes
const FEATURE_COUNT = 7;
const SCALER_VERSION = "v1";

// GET/ health 
function health(req, res) {
  res.json({
    status: "ok",
    service: "acquire"
  });
}


function generateFeatures(kunnaResult) {
    const { values, columns } = kunnaResult;
    
  
    const valueIndex = columns.indexOf("value");
    const timeIndex = columns.indexOf("time");

    if (values.length < 3) {
        throw new Error("FEATURE_GENERATION_FAILED: Se requieren al menos 3 puntos de consumo (lags).");
    }
    if (valueIndex === -1 || timeIndex === -1) {
        throw new Error("FEATURE_GENERATION_FAILED: Columnas 'value' o 'time' no encontradas.");
    }

    const consumo_t = values[0][valueIndex];
    const consumo_t_minus_1 = values[1][valueIndex];
    const consumo_t_minus_2 = values[2][valueIndex];
    

    const latestTime = new Date(values[0][timeIndex]);

    const hora = latestTime.getUTCHours(); 
    const dia_semana = latestTime.getUTCDay(); 
    const mes = latestTime.getUTCMonth() + 1;
    const dia_mes = latestTime.getUTCDate();
    
    const features = [
        consumo_t, 
        consumo_t_minus_1, 
        consumo_t_minus_2, 
        hora, 
        dia_semana, 
        mes, 
        dia_mes
    ];

    if (features.length !== FEATURE_COUNT || features.some(f => typeof f !== 'number')) {
        throw new Error("FEATURE_GENERATION_FAILED: El vector final es inválido.");
    }

    return features;
}

// POST/data
async function data(req, res) {
try {
    const TRES_DIAS = 3 * 24 * 60 * 60 * 1000;
    const timeEnd = new Date();
    const timeStart = new Date(timeEnd.getTime() - TRES_DIAS);
    
    const kunnaResult = await fetchKunna(timeStart, timeEnd); 

    const features = generateFeatures(kunnaResult);

    const newRecord = new AcquiredData({
        features: features,
        rawData: kunnaResult, 

        scalerVersion: SCALER_VERSION,
        featureCount: FEATURE_COUNT,
    });

    await newRecord.save();
    const dataId = newRecord._id; 

    return res.status(201).json({
        dataId: dataId.toString(),
        features: features,
        featureCount: FEATURE_COUNT,
        scalerVersion: SCALER_VERSION,
        createdAt: newRecord.createdAt.toISOString()
    });

   } catch (err) {
        console.error("[ACQUIRE] Error:", err.message);
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
  health,
  data
};