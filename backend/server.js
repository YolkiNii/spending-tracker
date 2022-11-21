const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const db = require('./config/db');

const app = express();
const PORT = 3500;

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(require('./middleware/credentials'));

// Cross Origin Resource Sharing
app.use(cors(require('./config/corsOptions')));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({extended: false}));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// routes
app.use('/register', require('./routes/api/registerRouter'));
app.use('/auth', require('./routes/api/authRouter'));
app.use('/refresh', require('./routes/api/refreshTokenRouter'));
app.use('/logout', require('./routes/api/logoutRouter'));

app.use(verifyJWT);
app.use('/users', require('./routes/api/usersRouter'));
app.use('/spendings', require('./routes/api/spendingsRouter'));

// connect to DB
db.connect((err) => {
    if (err) 
        console.log(err);

    console.log('Connected to DB');
    
    app.listen(PORT, (err) => {
        if (err)
            return console.log(err);
    
        console.log(`Server now listening on port: ${PORT}`);
    });
});