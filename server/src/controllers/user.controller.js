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
    const coverImageLocalPath  = req.files?.coverImage[0]?.path;

    // console.log("Files received:", { avatarLocalPath, coverImageLokelPath });

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    if(!coverImageLocalPath){
        throw new ApiError(400, "coverImage is required");
    }

    // let coverImageLocalPath ;
    // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    //     coverImageLocalPath  = req.files.coverImage[0].path
    // }

    

    //step5:- upload from file from Cloudinary
    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = await uploadCloudinary(coverImageLocalPath );

    // console.log("Avatar Image url: ",avatar)

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

// Login Controller
const loginUser = asyncHandler( async (req, res) => {
    //step1: feach data form req.body
    const { username, email, password } = req.body;
    //step2: login username or email based
    if(!username && !email){
        throw new ApiError(400, "username and email are require")
    }

    //step3: find user
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    //step4: verify data
    if(!user){
        throw new ApiError(404, "User not found")
    }
    const isValidPassword = await user.isPasswordCorrect(password)
    if(!isValidPassword){
        throw new ApiError(400, "password is Invalid ")
    }
    //step5: access and generate token
    const generateAccessAndRefreshToken = async (userId) => {
        try {
            // console.log("User Id: ", userId);
    
            // Find the user by ID
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
    
            // Call the instance methods on the user object
            const accessToken = user.generateAccessToken();
            const refreshToken = user.refressAccessToken();
    
            // Save the refresh token to the database
            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });
    
            // console.log("Refresh token and access token are: ", { refreshToken, accessToken });
    
            return {
                accessToken,
                refreshToken,
            };
        } catch (error) {
            // console.log("Error: ", error);
            throw new ApiError(500, "Something went wrong");
        }
    };
    
    const {refreshToken, accessToken} = await generateAccessAndRefreshToken(user._id)
    //step6: send cookies or send response 
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const option = {
        httpOnly: true,
        secure: true
    }

    //cookies


    return res.status(200).cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
        new ApiResponce(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )

})


const logoutUser = asyncHandler(async (req, res) =>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            },
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken")
    .json(
        new ApiResponce(200, {}, "User logged out")
    )
})

export { 
    registerUser,
    loginUser,
    logoutUser
};
