const jwt = require('jsonwebtoken')

function protect(req,res,next){
    try{
       const token = req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(401).json({
                success:false,
                message:"No token provided"
            })

        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch(error){
       return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error.message 
        });
    }
}


const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Access denied. Role '${req.user.role}' is not authorized.` 
            });
        }
        next();
    };
};

module.exports = {protect, authorizeRoles}



