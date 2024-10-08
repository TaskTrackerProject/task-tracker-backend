const User = require("../models/UserModel");
const TokenService = require("./TokenService")
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const userService = {
    async register(data) {
        if (isStringEmptyOrWhitespace(data.firstName)) {
            return {
                isSuccess: false,
                message: "First Name is empty",
            }
        }
        else if (isStringEmptyOrWhitespace(data.lastName)) {
            return {
                isSuccess: false,
                message: "Last Name is empty"
            }
        }
        else if (isStringEmptyOrWhitespace(data.email)) {
            return {
                isSuccess: false,
                message: "Email is empty"
            }
        }
        else if (isStringEmptyOrWhitespace(data.username)) {
            return {
                isSuccess: false,
                message: "Username is empty"
            }
        }
        else if (isStringEmptyOrWhitespace(data.password)) {
            return {
                isSuccess: false,
                message: "Password is empty"
            }
        }

        try {
            const result = await User.create({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                username: data.username,
                password: await hashPassword(data.password),
                verificationCode: generateOTP(),
            });
            return {
                isSuccess: true,
                message: "Registration success",
                data: {
                    id: result._id,
                }
            }
        } catch (err) {
            let message = "Registration failed, " + err.message;
            if (err.message.includes("email")) {
                message = "Email already exists"
            }
            else if (err.message.includes("username")) {
                message = "Username already exists"
            }
            return {
                isSuccess: false,
                message: message,
            }
        }
    },
    async verify(userId, otpCode) {
        try {
            if (isStringEmptyOrWhitespace(userId)) {
                return {
                    isSuccess: false,
                    message: "No ID found",
                }
            }
            else if (otpCode == undefined || otpCode == null) {
                return {
                    isSuccess: false,
                    message: "No Verification Code found",
                }
            }

            //const user = await User.findById(data.id)
            const objectId = ObjectId.createFromHexString(userId);
            const user = await User.findOne({_id: objectId, verificationCode: otpCode })
            if (user) {
                await User.findByIdAndUpdate(userId, { isVerified: true })
                // const tokenResult = await TokenService.signAccessToken(user._id.toHexString())
                // if (tokenResult.isSuccess) {
                //     return {
                //         isSuccess: true,
                //         message: "Verification success",
                //         data: {
                //             token: tokenResult.data.token,
                //         }
                //     }
                // }
                // else {
                //     return tokenResult
                // }
                const token = await TokenService.generateToken(user._id.toHexString())
                return {
                    isSuccess: true,
                    message: "Verification success",
                    data: {
                        token: token,
                    }
                }
            }
            else {
                return {
                    isSuccess: false,
                    message: "Verification failed",
                }
            }

        } catch (err) {
            return {
                isSuccess: false,
                message: err.message,
            }
        }
    },
    async loginViaUsername(username, password) {
        try {
            const user = await User.findOne({ username: username });
            if (user) {
                const isPasswordMatch = comparePassword(password, user.password)
                if (isPasswordMatch) {
                    const userId = user._id.toHexString()
                    if (!user.isVerified) {
                        return {
                            isSuccess: false,
                            message: "User not verified",
                            data: {
                                id : userId,
                                email : user.email,
                            },
                            error: {code: "not_verified", detail: "User not verified"}
                        }
                    }

                    // const tokenResult = await TokenService.signAccessToken(user._id.toHexString())
                    // if (tokenResult.isSuccess) {
                    //     return {
                    //         isSuccess: true,
                    //         message: "Login success",
                    //         data: {
                    //             token: tokenResult.data.token,
                    //         }
                    //     }
                    // }
                    // return tokenResult

                    const token = await TokenService.generateToken(userId)
                    return {
                        isSuccess: true,
                        message: "Login success",
                        data: {
                            id: userId,
                            token: token,
                        }
                    }
                }
            }
            return {
                isSuccess: false,
                message: "Login failed",
                error: {code: "login_failed", detail: "Login failed"},
            }

        } catch (err) {
            return {
                isSuccess: false,
                message: err.message,
                error: {code: "login_failed", detail: err.message},
            }
        }
    },
    async loginViaEmail(email, password) {
        try {
            const user = await User.findOne({ email: email });
            if (user) {
                const isPasswordMatch = comparePassword(password, user.password)
                if (isPasswordMatch) {
                    const userId = user._id.toHexString()
                    if (!user.isVerified) {
                        return {
                            isSuccess: false,
                            message: "User not verified",
                            data: {
                                id : userId,
                                email : user.email,
                            },
                            error: {code: "not_verified", detail: "User not verified"}
                        }
                    }
                    
                    const token = await TokenService.generateToken(userId)
                    return {
                        isSuccess: true,
                        message: "Login success",
                        data: {
                            id: userId,
                            token: token,
                        }
                    }
                }
            }
            return {
                isSuccess: false,
                message: "Login failed",
                error: {code: "login_failed", detail: "Login failed"},
            }

        } catch (err) {
            return {
                isSuccess: false,
                message: err.message,
                error: {code: "login_failed", detail: err.message},
            }
        }
    },
}

function generateOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
}

const saltRounds = 10;
async function hashPassword(plainTextPassword) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

async function comparePassword(plainTextPassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing password:', error);
        throw error;
    }
}

function isStringEmptyOrWhitespace(str) {
    if (str === undefined) {
        return true;
    }
    return !str || str.trim().length === 0;
}

module.exports = userService;   