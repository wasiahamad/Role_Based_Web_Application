import {Router} from 'express'; 
import { loginUser, registerUser } from '../controller/user.controller.js';


const userRouter = Router();

// User registration route
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

export default userRouter;
