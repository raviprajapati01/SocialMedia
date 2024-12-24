import { Router } from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middelware.js';
import { varifyJwt } from '../middleware/auth.middelware.js';

const router = Router();

// router.route('/register').post(registerUser);
// Alternative syntax
router.post('/register', upload.fields([
    {
        name: 'avatar',
        maxCount: 1
    },{
        name: 'coverImage',
        maxCount: 1
    }
]), registerUser);

router.post('/login', loginUser)

//secure routes
router.post('/logout',varifyJwt, logoutUser)

export default router;
