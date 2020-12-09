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

