import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"; 
import  {User}  from "../models/user.model.js";
import { uploadCloudinary } from '../utils/cloudinary.js'
import {ApiResponce} from '../utils/ApiResponce.js'


const registerUser = asyncHandler(async (req, res) => {

    //step1:- get user details form frontend
    const {fullName, email, username, password} = req.body

    //step2:- validation
    if(!fullName && !email && !username && !password){
        throw new ApiError(400, "All field are required")
    }

    //  Alternative
    if([fullName, email, username, password].some((field) =>
        field?.trim() == ""
    )){
        throw new ApiError(400, "All field are required")
    }
    
    //step3:- check if user already is exist
    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existingUser){
        throw new ApiError(409, "User already exist")
    }

    //step4:- check all file(images and avatar) is available
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLokelPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    //step5:- upload from file from Cloudinary
    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = await uploadCloudinary(coverImageLokelPath);

    if(!avatar){
        throw new ApiError(400, "Avatar is required");
    }

    //step6:- crate user object and crate db entry
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(404, "something went wrong while register user")
    }

    //  return responce
    return res.status(201).json(
        new ApiResponce(200, createdUser, "User Register Successfully")
    );
    
    
});

export { registerUser };
