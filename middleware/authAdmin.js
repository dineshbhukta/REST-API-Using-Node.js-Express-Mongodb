const User = require('../model/userModel');

const authAdmin = async (req,res,next) => {
    try{
        const user = await User.findOne({_id:req.user.id});

        if(user.role === "user") 
            return res.status(400).json({msg:"Admin resources, access denied for users"})
        
        next();
    }catch(err) {
        return res.status(500).json({msg:err.message})
    }
}


module.exports = authAdmin;