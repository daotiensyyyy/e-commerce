const express = require('express');
const cors = require('cors');
const port = 3000;
const app = express();
// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
global.__basedir = __dirname;

const route = require('./routes');
const db = require('./config/db');

db.connect();
db.initial();

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(cors());

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use('/uploads', express.static('./uploads'));



route(app);
app.listen(process.env.PORT || 3000);
