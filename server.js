const express = require('express');
const bodyParser = require('body-parser');
app = express();
let mongoose = require("./mongoose");
db = mongoose;
const config = require("config");
const port = config.get('port');
const cors = require('cors');


// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true
}));

app.use(bodyParser.json());

app.use(cors());

app.get('/', function (req, res) {
    res.send('Hello World')
})

// =======   Routing
require('./app/routes/UsersRoutes')(app, express);

app.listen(port, function () {
    console.log(`listening on ${port}`);
})