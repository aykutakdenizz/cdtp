const SerialPort = require('serialport');
const Temperature = require('./temperature');
let portList = [];
let portPath = '';

exports.list = async () => {
    await SerialPort.list().then(ports => {
        ports.forEach(function (port) {
            console.log({path: port.path});
        });
    });
};

exports.startReading = async (portId) => {
    let isSuccess = false;
    if (portPath.localeCompare(`COM${portId}`)) {
        port = await new SerialPort(`COM${portId}`, function (err) {
            if (err) {
                port = null;
                return console.log('Error: ', err.message);
            }
        }, false);
    }
    if (port != null) {
        portPath = `COM${portId}`;
        console.log('Port open => COM' + portId + '(Listening and saving)');
        isSuccess = true;
        port.on('data', function (data) {
            console.log('Data Arrived =>', data);
            Temperature.setTemperature(portId, String.fromCharCode.apply(null, new Uint16Array(data)));
        });
    }
    return isSuccess
};

exports.close = async (port) => {
    if (port != null) {
        await port.close();
        port = null;
        portPath = null;
        console.log('Port closed!');
        return true;
    } else {
        console.log('Port could not close!');
        return false;
    }
};

exports.sendValueToPort = async (portId, buffer) => {
    let isSuccess = true;
    if (portPath.localeCompare(`COM${portId}`)) {
        await this.start(portId);
    }
    if (port != null) {
        await port.write(buffer, function (err, result) {
            if (err) {
                console.log('Error while sending message : ' + err);
                isSuccess = false;
            }
        });
        if (isSuccess) {
            console.log(`Message send to ${portPath}`);
        }
    } else {
        console.log(`COM PORT:${portId} is null, can not send value. First close port and reopen your port`);
        isSuccess = false;
    }

    return isSuccess;
};

exports.start = async (index) => {
    let isSuccess = true;
    try {
        port = await new SerialPort(`COM${index}`, function (err) {
            if (err) {
                port = null;
                isSuccess = false;
                return console.log('Error: ', err.message);
            }
        }, false);
    } catch (e) {
        isSuccess = false;
        console.log(`ERROR in start function: COM${index} error:${e}`);
    }

    portPath = `COM${index}`;
    console.log(`Port opened: COM${index}`);
    return true;
};


