import User from "../models/User.js";

// Middleware to check if user is authenticated
export const protect = async (req, res, next)=>{
    console.log("Authorization Header:", req.headers.authorization);
    console.log("req.auth():", req.auth());

    
    const {userId} = req.auth();
    if(!userId){
       return res.json({success: false, message: "not authenticated"});
    }else{
        const user = await User.findOne({ _id: userId });
console.log("User from DB:", user);
        req.user = user; 
        next()
    }
}