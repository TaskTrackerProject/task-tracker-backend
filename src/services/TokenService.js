const JWT = require("jsonwebtoken")

const tokenService = {
    generateToken(userId) {
        const secret = process.env.ACCESS_TOKEN_SECRET
        return JWT.sign({userId}, secret)
    },
    signAccessToken(userId) {
        return new Promise((resolve, reject) => {
            try {
                const secret = process.env.ACCESS_TOKEN_SECRET
                const payload = {}
                const options = {
                    expiresIn: "1h",
                    audience: userId,
                }
                JWT.sign(payload, secret, options, (err, token) => {
                    if (err) {
                        console.log(err)
                        reject({
                            isSuccess: false,
                            message: "Failed to generate token"
                        })
                    }
                    else {
                        resolve({
                            isSuccess: true,
                            data: {
                                token: token,
                            }
                        })
                    }
                })
            } catch (err) {
                reject({
                    isSuccess: false,
                    message: err.message,
                });
            }
        });
    },
    verifyAcessToken() {

    },
    refreshAccessToken() {

    },
}

module.exports = tokenService;