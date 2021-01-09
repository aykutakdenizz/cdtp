const SerialPort = require('serialport');
const Temperature = require('./temperature');

let portDataList = [];
let comPorts = [];

exports.scanPorts = async () => {
    while(portDataList.length > 0) {
        portDataList.pop();
    }
    while(comPorts.length > 0) {
        comPorts.pop();
    }
    await SerialPort.list().then(ports => {
        ports.forEach(function (port) {
            console.log({path: port.path});
            portDataList.push(port);
        });
    });
};

exports.listenPorts = async () => {
    await this.scanPorts();
    let isError = false;
    for (const comPortData of portDataList) {
        isError = false;
        let openedPort = await new SerialPort(comPortData.path, function (err) {
            if (err) {
                isError = true;
                if (openedPort.IsOpen) {
                    openedPort.close();
                }
                return console.log('Error: ', err.message);
            }
        }, false);

        if (!isError) {
            openedPort.on('data', function (data) {
                data = data.toString().replace('\r\n','');
                const regex = RegExp('^[0-9]+\.[0-9]+');
                console.log(`Data Arrived ${openedPort.path}=>`, data);
                if (regex.test(data)){
                    console.log(`Valid Data `);      
                    Temperature.setTemperature(openedPort.path.substring(3, openedPort.path.length), data);
                }
            });
            comPorts.push(openedPort);
            console.log(`Port listening ${openedPort.path}`);
        }
    }
    return comPorts;
};


exports.close = async (portId) => {
    let port = await this.getPort(portId);
    let isSuccess = false;
    if( port == null){
        console.log(`Port CAN NOT close (COM${portId}). This port may not be open.`);
        return false;
    } else {
        try{
            if( port.IsOpen)
                port.close();
            portDataList = portDataList.filter((portData) => {
                if (portData.path.localeCompare(`COM${portId}`) !== 0){
                    return portData;
                } else {
                    isSuccess = true;
                    console.log(`${portData.path} closed.`)
                }
            });
            comPorts = comPorts.filter((port) => {
                if (port.path.localeCompare(`COM${portId}`) !== 0){
                    return port;
                }
            });
        } catch (e) {
            console.log('In close method occurred error:'+ e);
        }
    }
    return isSuccess;
};

exports.sendValueToPort = async (portId, temperature) => {
    let isSuccess = true;
    let port = await this.getPort(portId);
    if (port != null) {
        await port.write(`${temperature}\n`, function (err, result) {
            if (err) {
                console.log('Error while sending message : ' + err);
                isSuccess = false;
            }
        });
        if (isSuccess) {
            console.log(`Message send to ${port.path} \n\tMessage:${temperature}`);
        }
    } else {
        console.log(`COM${portId} is not open, can not send value. This port is not connected, check connection or request listen()`);
        isSuccess = false;
    }
    return isSuccess;
};


exports.getPort = async (portId) => {
    let port = null;
    for (const comPort of comPorts) {
        if(comPort.path.localeCompare(`COM${portId}`) === 0){
            port = comPort;
        }
    }
    return port;
};

exports.checkPortList = () => {
    return portDataList;
};