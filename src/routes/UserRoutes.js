const express = require("express")
const router = express.Router()
const UserService = require("../services/UserService")
const TokenService = require("../services/TokenService")

router.post("/register", async (req, res) => {
    const result = await UserService.register(req.body)
    if (result.isSuccess) {
        res.status(201).send({
            message: result.message,
            data: {
                id: result.data.id
            }
        })
    }   
    else {
        res.status(400).send({
            message: result.message
        })
    }
})

router.post("/verify", async (req, res) => {
    const result = await UserService.verify(req.body)
    if (result.isSuccess) {
        res.status(200).send({
            message: result.message,
            data: {
                token: result.data.token
            }
        })
    }
    else {
        res.status(400).send({
            message: result.message
        })
    }
})

router.post("/login", async (req, res) => {
    const result = await UserService.login(req.body.username, req.body.password)
    if (result.isSuccess) {
        res.status(200).send({
            message: result.message,
            data: {
                token: result.data.token
            }
        })
    }
    else {
        res.status(400).send({
            message: result.message
        })
    }
})

module.exports = router