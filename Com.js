const SerialPort = require('serialport');
const Temperature = require('./temperature');
let port;

exports.init = async () => {
    let portPath = 'COM4';
    await SerialPort.list().then(ports => {
        ports.forEach(function (port) {
            console.log(port);
            portPath = port.path;
        });
    });

    port = await new SerialPort(portPath, function (err) {
        if (err) {
            return console.log('Error: ', err.message)
        }
    }, false);

    port.on('data', function (data) {
        console.log('Data:', data);
        Temperature.setTemperature(String.fromCharCode.apply(null, new Uint16Array(data)));
    });
};

exports.close = async () => {
    if (port != null) {
        port.close();
    }
};

exports.sendValueToPort = async (buffer) => {
    let isSuccess = true;
    await port.write(buffer,function (err, result) {
        if (err) {
            console.log('Error while sending message : ' + err);
            isSuccess = false;
        }
    });
    return isSuccess;
};



