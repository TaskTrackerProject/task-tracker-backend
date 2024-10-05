const UserService = require("../services/UserService")

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

}

module.exports = {
    register,
    verify,
    login,
}