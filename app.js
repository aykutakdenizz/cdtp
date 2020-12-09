const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8000;
const SeraRoute = require('./Route/seraRoute');
const ip = require('ip');
const app = express();
const Com = require('./Com');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use(SeraRoute);

app.use('/test', (req, res, next) => {
    res.status(200);
    res.json({
        response: '(TEST):Server is running'
    })
});

app.use('/listen', async (req, res, next) => {
    let list = await Com.listenPorts();
    if (list == null) {
        res.status(500);
        await res.json({
            response: 'Ports can not open.'
        })
    } else {
        res.status(200);
        let str = [];
        list.forEach(portData => {
            str.push(portData.path);
        });
        await res.json({
            response: str
        })
    }
});

app.use('/check', async (req, res, next) => {
    let list = Com.checkPortList();
    res.status(200);
    let str = [];
    list.forEach(portData => {
        str.push(portData.path);
    });
    await res.json({
        response: str
    })
});

app.use('/close', async (req, res, next) => {
    const seraId = req.query.seraId;
    if (seraId == null) {
        return res.status(400).json({message: 'seraId is missing!'});
    }
    try {
        let isSuccess = await Com.close(seraId);
        if (isSuccess) {
            res.status(200);
            await res.json({
                response: `COM${seraId} is stopped`
            })
        } else {
            res.status(500);
            await res.json({
                response: `COM${seraId}  can not stopped, port can be null or already close.`
            })
        }
    } catch (e) {
        res.status(500);
        await res.json({
            response: `COM${seraId} can not stopped. Error occurred.`
        })
    }
});

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});


app.listen(port, async () => {
    console.log(`--------\t\t Important Informations\t\t --------`);
    console.log(`Server started on ${ip.address().toString()}:${port}`);
    console.log(`To re-listen serial port communication, please send GET request ${ip.address().toString()}:${port}/listen`);
    console.log(`To check connected ports, please send GET request ${ip.address().toString()}:${port}/check`);
    console.log(`To close serial port communication, please send GET request ${ip.address().toString()}:${port}/close?index=x`);
    console.log(`To send temperature, please send POST request ${ip.address().toString()}:${port}/setTemperature body:{seraId: int, temperature: int}`);
    console.log(`To get temperature, please send GET request ${ip.address().toString()}:${port}/getTemperature?seraId=x`);
    console.log(`----- COM PORTS ------`);
    await Com.listenPorts();
});
module.exports = app;

