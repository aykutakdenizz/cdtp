const Com = require('../Com');
const Temperature = require('../temperature');

exports.getTemperature = async (req, res, next) => {
    const seraId = req.query.seraId;
    if(seraId == null){
        return res.status(400).json({message:'seraId is missing!'});
    }

    let temperature = Temperature.getTemperature(seraId);
    res.status(200).json({message: temperature});

};

exports.setTemperature = async (req, res, next) => {
    if (req.body.seraId == null || req.body.temperature == null) {
        return res.status(400).json({
            message: 'Values/Value missing while setting temperature!'
        });
    }
    let isSuccess;
    //send temperature to serial port from http request value
    const buf = Buffer.alloc(1);
    if(req.body.temperature<0 || req.body.temperature>255){
        return res.status(400).json({
            message: 'Temperature is not valid!'
        });
    }
    buf.writeUInt8(req.body.temperature, 0);
    isSuccess = await Com.sendValueToPort( req.body.seraId, buf);

    if (isSuccess) {
        res.status(200).json({
            message: 'Operation is successful'
        });
    } else {
        res.status(500).json({
            message: 'Operation is failed! (Port may be close)'
        });
    }
};
