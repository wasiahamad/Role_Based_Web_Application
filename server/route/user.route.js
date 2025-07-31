import {Router} from 'express'; 
import { registerUser } from '../controller/user.controller.js';


const userRouter = Router();

// User registration route
userRouter.post('/register', registerUser);

export default userRouter;
