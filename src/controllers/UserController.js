const UserService = require("../services/UserService")
const TokenService = require("../services/TokenService")

const register = async (req, res) => {
    const result = await UserService.register(req.body)
    if (result.isSuccess) {
        res.status(201).send({
            status: "success",
            message: result.message,
            data: {
                id: result.data.id
            }
        })
    }   
    else {
        res.status(400).send({
            status: "error",
            message: result.message
        })
    }
}

const verify = async (req, res) => {
    const otp = req.body.code
    const userId = req.body.id
    const result = await UserService.verify(userId, otp)
    if (result.isSuccess) {
        res.status(200).send({
            status: "success",
            message: result.message,
            data: {
                token: result.data.token
            }
        })
    }
    else {
        res.status(400).send({
            status: "error",
            message: result.message,
        })
    }
}

const login = async (req, res) => {
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password

    if (email && password) {
        const result = await UserService.loginViaEmail(email, password)
        if (result.isSuccess) {
            res.status(200).send({
                status: "success",
                message: "Login success",
                data: result.data,
            })
        } else if (result.data) {
            res.status(400).send({
                status: "error",
                data: result.data,
                message: result.message,
                errors: [result.error],
            })
        } else {
            res.status(400).send({
                status: "error",
                message: result.message,
                errors: [result.error],
            })
        }
    } else if (username && password) {
        const result = await UserService.loginViaUsername(username, password)
        if (result.isSuccess) {
            return res.status(200).send({
                status: "success",
                message: "Login success",
                data: result.data,
            })
        } else if (result.data) {
            res.status(400).send({
                status: "error",
                data: result.data,
                message: result.message,
                errors: [result.error],
            })
        } else {
            res.status(400).send({
                status: "error",
                message: result.message,
                errors: [result.error],
            })
        }
    } else {
        res.status(400).send({
            status: "error",
            message: "Something went wrong",
            errors: [{
                code: "missing_parameter",
                detail: "Missing required parameter",
            }]
        })
    }
}

function isStringEmptyOrWhitespace(str) {
    if (str === undefined) {
        return true;
    }
    return !str || str.trim().length === 0;
}

module.exports = {
    register,
    verify,
    login,
}