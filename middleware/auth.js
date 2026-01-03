const jwt = require("jsonwebtoken")



function auth(req, res, next){
    const token = req.headers.authorization;

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

function doctor (req, res, next){
    if(req.user.role === 'Doctor'){
        next()
    }else{
        res.status(200).send({msg:"you are not authorized"})
    }
}

module.exports  = {auth, doctor}