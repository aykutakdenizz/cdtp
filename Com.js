const SerialPort = require('serialport');
const Temperature = require('./temperature');
let port;
let portPath = '';

exports.init = async () => {
    let comList = 0;
    await SerialPort.list().then(ports => {
        ports.forEach(function (port) {
            console.log(port);
            portPath = port.path;
            comList ++;
        });
    });
    if(comList > 0){
        port = await new SerialPort(portPath, function (err) {
            if (err) {
                port = null;
                return console.log('Error: ', err.message);
            }
        }, false);

        port.on('data', function (data) {
            console.log('Data Arrived =>', data);
            Temperature.setTemperature(String.fromCharCode.apply(null, new Uint16Array(data)));
        });
        return true;
    } else{
        return false;
    }
};

exports.close = () => {
    if (port != null) {
        port.close();
        port = null;
        console.log('Port closed!');
        return true;
    } else {
        console.log('Port could not close!');
        return false;
    }
};

exports.sendValueToPort = async (buffer) => {
    let isSuccess = true;
    if(port != null){
        await port.write(buffer,function (err, result) {
            if (err) {
                console.log('Error while sending message : ' + err);
               isSuccess = false;
            }
        });
        if(isSuccess){
            console.log(`Message send to ${portPath}`);
        }
    } else {
        console.log(`COM PORT:${portPath} is null, can not send value`);
        isSuccess = false;
    }
    return isSuccess;
};



