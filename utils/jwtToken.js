// utils/sendToken.js
const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken(); // Assuming user.getJwtToken() is a method to generate JWT token

    res.status(statusCode).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendToken;
