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

        if(!req.user){
        return res.status(401).json({seccess: false, msg:"Unauthorized"})

    }

    if(req.user.role === 'Doctor'){
        return next()
    }
    return res.status(403).json({msg:"Doctor access only"})
    
}

function admin(req, res, next){
    if(!req.user){
        return res.status(401).json({seccess: false, msg:"Unauthorized"})
    }
    if(req.user.role === "Admin"){
        return next()
    }

      return res.status(403).json({
    success: false,
    msg: "Admin access only"
  });

}

module.exports  = {auth, doctor, admin}