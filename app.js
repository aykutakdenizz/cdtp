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
    let isSuccess = await Com.init();
    if(isSuccess){
        res.status(200);
        await res.json({
            response: 'Port reading'
        })
    } else {
        res.status(500);
        await res.json({
            response: 'Port can not open. Another process can use port, please check it.'
        })
    }

});

app.use('/stop',async (req, res, next) => {
    try{
        let isSuccess = Com.close();
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


app.listen(port, () => {
    console.log(`--------\t\t Important Informations\t\t --------`);
    console.log(`Server started on ${ip.address().toString()}:${port}`);
    console.log(`To open serial port communication, please send GET request ${ip.address().toString()}:${port}/start`);
    console.log(`To close serial port communication, please send GET request ${ip.address().toString()}:${port}/stop`);
    console.log(`--------\t\t ----------------------\t\t --------`);
});
module.exports = app;

