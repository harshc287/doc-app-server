const jwt = require("jsonwebtoken")



function auth(req, res, next){
    const token = req.header("Authorization")

    if(!token){
        return res.status(401).json({
            msg:"no Token, Authorization Denied"
        })
    }

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
    
} catch (error) {
    res.status(401).json({
        msg:"Invalid token"
    })
}

    
}

module.exports  = {auth}