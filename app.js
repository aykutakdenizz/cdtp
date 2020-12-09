const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8000;
const SeraRoute = require('./Route/seraRoute');
const ip = require('ip');
const app = express();
const Com = require('./Com');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(cors());

app.use(SeraRoute);

app.use('/test', (req, res, next) => {
    res.status(200);
    res.json({
        response: '(TEST):Server is running'
    })
});

app.use('/start',async (req, res, next) => {
    if(req.query.seraId == null){
        return res.status(404).json({response: 'seraId is missing'});
    }
    let isSuccess = await Com.startReading(req.query.seraId);
    if(isSuccess){
        res.status(200);
        await res.json({
            response: 'Port reading'
        })
    } else {
        res.status(500);
        await res.json({
            response: 'Port can not open. Another process may use port or port has already opened, please check it.'
        })
    }

});
app.use('/open',async (req, res, next) => {
    if(req.query.seraId == null){
        return res.status(404).json({response: 'seraId is missing'});
    }
    let isSuccess = await Com.start(req.query.seraId);
    if(isSuccess){
        res.status(200);
        await res.json({
            response: 'Port opened'
        })
    } else {
        res.status(500);
        await res.json({
            response: 'Port can not open. Another process may use port or port has already opened, please check it.'
        })
    }

});

app.use('/close',async (req, res, next) => {
    try{
        let isSuccess = await Com.close();
        if(isSuccess){
            res.status(200);
            await res.json({
                response: 'Port stopped'
            })
        } else {
            res.status(500);
            await res.json({
                response: 'Port can not stopped, port can be null or already close.'
            })
        }
    }catch (e) {
        res.status(500);
        await res.json({
            response: 'Port can not stopped. Error occurred'
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


app.listen(port,async () => {
    console.log(`--------\t\t Important Informations\t\t --------`);
    console.log(`Server started on ${ip.address().toString()}:${port}`);
    console.log(`To open serial port communication, please send GET request ${ip.address().toString()}:${port}/open?index=x`);
    console.log(`To listen serial port communication, please send GET request ${ip.address().toString()}:${port}/start?index=x`);
    console.log(`To close serial port communication, please send GET request ${ip.address().toString()}:${port}/close?index=x`);
    console.log(`--------\t\t ----------------------\t\t --------`);
    console.log(`--------\t\t --LIST OF COM PORTS---\t\t --------`);
    await Com.list();
    console.log(`--------\t\t ----------------------\t\t --------`);
});
module.exports = app;

