const jwt = require('jsonwebtoken');

const auth = async (req,res,next) => {
    try {
        const token = req.header("Authorization")
            if(!token) 
                return res.status(400).json({msg:"Invalid Authorization"});
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || require('../config.json').config.access_token , (err,user) => {
                if(err)
                    return res.status(400).json({msg:"Invalid Authorization...Login Again"});
                req.user = user;
                next();
            })
    }catch {
        return res.status(500).json({msg:err.message});
    }
}

module.exports = auth ;
