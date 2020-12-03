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
    await Com.init();
    res.status(200);
    await res.json({
        response: 'Port reading'
    })
});

app.use('/stop',async (req, res, next) => {
    try{
        await Com.close();
        res.status(200);
        await res.json({
            response: 'Port stopped'
        })
    }catch (e) {
        res.status(500);
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
    console.log(`Server started on ${ip.address().toString()}:${port}`);
});
module.exports = app;

