const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3500;

const whitelist = ['https://localhost:3000', 'https://localhost:3500'];
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

// routes
app.use('/register', require('./routes/api/registerRouter'));
app.use('/auth', require('./routes/api/authRouter'));

app.listen(PORT, (err) => {
    if (err)
        console.log(err);

    console.log(`Server now listening on port: ${PORT}`);
});