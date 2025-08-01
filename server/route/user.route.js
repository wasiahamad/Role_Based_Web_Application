import {Router} from 'express'; 
import { adminCreateNewUser, changePassword, deleteUser, getAllUsers, getCurrentUser, loginUser, logoutUser, registerUser } from '../controller/user.controller.js';
import { adminMiddleware, authMiddleware } from '../middleware/auth.js';
// import { authMiddleware, adminMiddleware } from '../middleware/auth.js';


const userRouter = Router();

// Protected routes
userRouter.get('/all', authMiddleware, adminMiddleware, getAllUsers);
userRouter.delete('/:userId', authMiddleware, adminMiddleware, deleteUser);
// Admin route to create a new user
userRouter.post('/admin/create', authMiddleware, adminMiddleware, adminCreateNewUser);


// User registration route
userRouter.post('/register', registerUser);
// User login route
userRouter.post('/login', loginUser);
// User logout route
userRouter.post('/logout', logoutUser);
// change password route
userRouter.post('/change-password', authMiddleware, changePassword);
// userRouter.get('/current-user', authMiddleware, getCurrentUser);




export default userRouter;
