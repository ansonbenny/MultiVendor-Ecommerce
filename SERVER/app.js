import express from "express";
import users from './Routes/users.js'
import admin from './Routes/admin.js'
import vendor from './Routes/vendor.js'
import cors from 'cors'
import db from "./Config/Connection.js";
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv' 
dotenv.config()

var app = express()

var port = process.env.PORT || 5000

db.connect((err) => {
    if (err) console.log("Connection Error : ", err)
    else console.log('Database Connected')
})

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static('./uploads'))

app.use('/api/users/', users)
app.use('/api/admin/', admin)
app.use('/api/vendor/', vendor)

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log("Server listening on PORT", port);
})