const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3500;

const whitelist = ['http://localhost:3000'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin)
            callback(null, true);
        else
            callback(new Error('Not allowed by CORS'));
    },
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.listen(3500, (err) => {
    if (err)
        console.log(err);

    console.log(`Server now listening on port: ${PORT}`);
})