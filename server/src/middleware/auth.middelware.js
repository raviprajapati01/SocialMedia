import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'


const varifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace(
            "Bearer ", "");

            // console.log("Access Token is: ", token);
    
        if(!token){
            throw new ApiError(401, "Unouthourized request Token Not Valid")
        }
        // console.log("Jwt Key: ", process.env.REFRESH_TOKEN_SCRETE)
        const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SCRETE)
    
        const user = await User.findById(decode?._id).select(
            "-password -refreshToken"
        )
    
        if(!user){
            //TODO: discuss about frontend
            throw new ApiError(401, "Unouthourized request")
        }
    
        req.user = user;
        next();
    } catch (error) {
        console.log("Error is: ", error);
        throw new ApiError(401, error?.message || "Unothourized request")
    }

})

export{
    varifyJwt
}