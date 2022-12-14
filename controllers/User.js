const User = require("../db/User");
// const UserToken = require('../db/UserToken');
const Authenticator = require('../utils/Authenticator');
const config = require('../config.json');

async function registerUser(req, res) {
    try {
        const exists = await checkIfUserExists(req.body.email);
        if (exists) {
            res.status(409).send('User Already Exists.');
        }
        else {
            await User.createUser(req.body.email, req.body.password);
            res.sendStatus(201);
        }
    }
    catch (e) {
        console.error('Error Occurred While Registering a User', e);
        res.sendStatus(500);
    }
}

async function checkIfUserExists(email) {
    return (await User.queryUserByEmail(email)).rowCount > 0;
}

async function checkCredentials(email, password) {
    const { rows } = await User.queryUserByEmail(email);
    return rows[0]['password'] === password;
}

async function loginUser(req, res) {
    try {
        const exists = await checkIfUserExists(req.body.email);
        if (exists) {
            const credentialsMatches = await checkCredentials(req.body.email, req.body.password);
            if (credentialsMatches) {
                const token = Authenticator.generateAccessToken(req.body.email);
                // await UserToken.saveToken(req.body.email, token)
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'Strict',
                    origin: config.origin,
                });
                res.sendStatus(200);
            }
            else {
                res.status(401).send('Contains Invalid Credentials');
            }
        }
        else {
            res.status(401).send('User Does Not Exist');
        }
    }
    catch (e) {
        console.error('Error Occurred While Logging In a User', e);
        res.sendStatus(500);
    }
}

async function logoutUser(req, res) {
    res.clearCookie('token');
    res.send(200);
}

module.exports = {
    registerUser: (req, res) => registerUser(req, res),
    loginUser: (req, res) => loginUser(req, res),
    logoutUser: (req, res) => logoutUser(req, res)
};
