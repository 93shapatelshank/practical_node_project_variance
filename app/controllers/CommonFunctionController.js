const Controller = require("./Controller");
const config = require("config");
const { Users } = require("../models/UserSchema");
let jwt = require('jsonwebtoken');

class CommonFunctionController extends Controller {
    constructor() {
        super();
    }

    /*************************************************************************************
     Set Error Message
    **************************************************************************************/
    static getErrorMessage(status, message, code) {
        var res = {
            "settings": {
                "status": status,
                "message": message,
                "statusCode": code
            }
        }
        return res;
    }

    /*************************************************************************************
     Set Success Message
    **************************************************************************************/
    static getSuccessMessage(status, message, code, data) {
        var res = {
            "settings": {
                "status": status,
                "message": message,
                "statusCode": code
            },
            "data": data
        }
        return res;
    }

    static generateToken(id) {
        return new Promise(async (resolve, reject) => {
            try {
                // Generate Token
                let token = jwt.sign({
                    id: id,
                    algorithm: "HS256",
                    exp: Math.floor(new Date().getTime() / 1000) + config.get('tokenExpiry')
                }, config.get('securityToken'));
                return resolve(token);
            } catch (err) {
                return reject({ message: err, status: 0 });
            }
        });
    }

    static async isAuthorised(req, res, next) {
        try {
            const token = req.headers.authorization;
            console.log("token", token);
            if (!token) return res.send({
                "settings": {
                    "status": 0,
                    "message": "Please provide token in headers",
                    "statusCode": 400
                }
            });
            const userData = await Users.findOne({ accessToken: token });
            if (!userData) {
                return res.send({
                    "settings": {
                        "status": 0,
                        "message": "Token is invalid",
                        "statusCode": 500
                    }
                });
            }
            req.id = userData._id;
            next();
        } catch (err) {
            console.log("Token authentication", err);
            return res.send({ status: 0, message: err });
        }
    }
}
module.exports = CommonFunctionController;