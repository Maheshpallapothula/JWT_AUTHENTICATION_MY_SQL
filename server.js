console.log("Bugloo server Intialized.");

/* Require Dot env because we need which port would be intialize*/
require('dotenv/config')

/*Initializing express*/
const express = require('express');
const app = express();

/* Intializing Cors */
const cors = require('cors');
app.use(cors());

/* body-parser */
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());


app.listen(process.env.port);

console.log("API SERVER PORT IS RUNNING ON :" + process.env.port);


const login = require('./app/routes/login')(app);