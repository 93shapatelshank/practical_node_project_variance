/****************************
 MONGOOSE SCHEMAS
 ****************************/
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require("config");
const dbUrl = config.get('db');


const db = mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    () => { console.log('MongoDB connected') },
    (err) => { console.log('MongoDB connection error', err) }
);

module.exports = db;
