'use strict'
const db = require('../model/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config')
const loginModel = require('../model/login.model');

exports.registration = async (req, res) => {
    try {
        let data = await loginModel(req.body);

        if (data.password.length < 12) {
            res.status(400).send("Password is minimum characters of 12");
        } else {
            /* For encrypting the password */
            const encryptedPassword = await bcrypt.hash(data.password, 12);

            /* for sigigning throw the jwt token*/
            const token = jwt.sign({ userId: data.userId, userName: data.userName }, process.env.TOKEN_KEY, {
                expiresIn: "1h",
            })

            /* intializing the token and password to the session*/
            data.password = encryptedPassword;

            db.query('insert into logins set ?', data, function (err, records, fields) {
                if (err) {
                    throw (err)
                } else {
                    if (records.affectedRows > 0) {
                        res.send({
                            status: 200,
                            response: "record inserted successfully",
                            token: token,
                            result: data
                        })
                    }
                }
            })
        }
    } catch (error) {
        res.send(error)
    }
}

exports.verifyUser = async (req, res) => {
    if (req.body.password.length < 12) {
        res.status(400).send("Password is minimum characters of 12");
    } else {
        await db.query("select password,userName from logins where userName = '" + req.body.userName + "';", async function (err, records, fields) {
            if (err) {
                throw err;
            } else {
                if (records.length > 0) {
                    const comparedPassword = await bcrypt.compare(req.body.password, records[0].password);
                    if (comparedPassword) {
                        res.send({
                            status: 200,
                            response: "success",
                            result: records,
                        })
                    } else {
                        res.send({
                            status: 404,
                            response: "Failure Incorrect Password!.",
                        })
                    }
                }
            }
        })
    }
}