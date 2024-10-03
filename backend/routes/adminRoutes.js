import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import { authAdmin, logoutAdmin, getAdminDashboard, editUser,deleteUser, addNewUser} from '../controller/adminController.js';


router.post('/login', authAdmin);          
router.post('/logout', logoutAdmin);       
router.get('/dashboard',getAdminDashboard); 
router.put('/user/:id',  editUser);
router.delete('/user/:id',  deleteUser);
router.post('/add-new-user', addNewUser);


export default router;