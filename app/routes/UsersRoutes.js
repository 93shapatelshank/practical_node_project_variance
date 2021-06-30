module.exports = (app, express) => {

    const router = express.Router();
    const UsersController = require('../controllers/UsersController');
    const CF = require('../controllers/CommonFunctionController');
    const config = require("config");
    const baseApiUrl = config.get('baseApiUrl');

    // User module
    router.post('/login', (req, res, next) => {
        const userObj = (new UsersController()).boot(req, res);
        return userObj.login();
    });

    router.post('/register', (req, res, next) => {
        const userObj = (new UsersController()).boot(req, res);
        return userObj.register();
    });

    router.get('/users', CF.isAuthorised, (req, res, next) => {
        const userObj = (new UsersController()).boot(req, res);
        return userObj.getUsers();
    });


    router.post('/logout', CF.isAuthorised, (req, res, next) => {
        const userObj = (new UsersController()).boot(req, res);
        return userObj.logout();
    });

    app.use(config.baseApiUrl, router);
}