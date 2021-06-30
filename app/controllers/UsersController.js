
const Controller = require("./Controller");
const ObjectId = require('mongodb').ObjectID;
const { Users } = require('../models/UserSchema');
const CF = require('./CommonFunctionController');
const bcrypt = require('bcrypt');

class UsersController extends Controller {
    constructor() {
        super();
    }

    async register() {
        let _this = this;
        try {
            if (!_this.req.body.firstName) { return _this.res.send(CF.getErrorMessage(0, 'Please provide firstName', 400)); }
            if (!_this.req.body.lastName) { return _this.res.send(CF.getErrorMessage(0, 'Please provide lastName', 400)); }
            if (!_this.req.body.email) { return _this.res.send(CF.getErrorMessage(0, 'Please provide email', 400)); }
            if (!_this.req.body.password) { return _this.res.send(CF.getErrorMessage(0, 'Please provide password', 400)); }
            let email = _this.req.body.email;
            const userExists = await Users.findOne({ email: email });
            if (userExists) { return _this.res.send(CF.getErrorMessage(0, "User Already Exists", 500)); }
            let saveUserData = _this.req.body;
            let password = bcrypt.hashSync(_this.req.body.password, 10);
            saveUserData.password = password;
            const userModal = new Users(saveUserData);
            const saveData = await userModal.save();
            let userId = saveData._id;
            let responseData = saveUserData;
            responseData.userId = userId;
            return _this.res.send(CF.getSuccessMessage(1, 'Congratulations ! Your account has been created successfully', 200, responseData));
        }
        catch (error) {
            console.log("error", error);
            return _this.res.send(CF.getErrorMessage(0, "Internal Server Error", 500));
        }
    }

    async login() {
        let _this = this;
        try {
            if (!_this.req.body.email) { return _this.res.send(CF.getErrorMessage(0, 'Please provide email', 400)); }
            if (!_this.req.body.password) { return _this.res.send(CF.getErrorMessage(0, 'Please provide password', 400)); }
            let email = _this.req.body.email;
            let getUserInfo = await Users.findOne({ email: email });
            if (!getUserInfo) { return _this.res.send(CF.getErrorMessage(0, "Email is invalid", 500)); }
            let password = _this.req.body.password;
            const status = await bcrypt.compare(password, getUserInfo.password);
            if (!status) { return _this.res.send(CF.getErrorMessage(0, "Password is invalid", 500)); }
            let userId = ObjectId(getUserInfo._id);
            const token = await CF.generateToken(userId);
            let responseData = getUserInfo;
            responseData.accessToken = token;
            let setQuery = { accessToken: token };
            let updateUser = await Users.updateOne({ "_id": userId }, { $set: setQuery })
            return _this.res.send(CF.getSuccessMessage(1, 'User logged in successfully', 200, responseData));
        }
        catch (error) {
            console.log("error", error);
            return _this.res.send(CF.getErrorMessage(0, "Internal Server Error", 500));
        }
    }

    async getUsers() {
        let _this = this;
        try {
            let getUserList = await Users.find();
            return _this.res.send(CF.getSuccessMessage(1, 'Users get successfully', 200, getUserList));
        }
        catch (error) {
            console.log("error", error);
            return _this.res.send(CF.getErrorMessage(0, "Internal Server Error", 500));
        }
    }

    async logout() {
        let _this = this;
        try {
            let userId = ObjectId(_this.req.id);
            let setQuery = { accessToken: "" };
            let updateUser = await Users.updateOne({ "_id": userId }, { $set: setQuery })
            return _this.res.send(CF.getSuccessMessage(1, 'User logged in successfully', 200, responseData));
        }
        catch (error) { return _this.res.send(CF.getErrorMessage(0, "Internal Server Error", 500)); }
    }

}
module.exports = UsersController;