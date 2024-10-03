import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateTokens.js'


const authAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log("Entered", req.body); 
    
  
    const user = await User.findOne({ email });

   
    if (user && (await user.matchPasswords(password))) {
       
        if (user.role === 'admin') {
            generateToken(res, user._id); 
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: true,
            });
        } else {
            res.status(403);
            throw new Error('Not authorized as an admin');
        }
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

const logoutAdmin = asyncHandler( async (req,res) => {
    res.cookie('jwt', '',{
        httpOnly: true,
        expires: new Date(0),
    })

    res.status(200).json({ message: 'Admin Logged Out'})
})

const getAdminDashboard = asyncHandler(async (req, res) => {
    console.log('Dashboard endpoint hit');
    try {
        const users = await User.find({role: 'user'});
        console.log('Fetched users:', users);
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const editUser = asyncHandler(async (req, res) => {
    const { name, email } = req.body;  
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});



const addNewUser = asyncHandler( async (req,res) => {

    const {name, email, password} = req.body;
   
    const UserExist = await User.findOne({email})
    if(UserExist){
        res.status(400);
        throw new Error('User already exists')
    }
    
    const user = await User.create({
        name,
        email,
        password
    });

    if(user){
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400);
        throw new Error('Invalied user data')
    }
})

export {
    authAdmin,
    logoutAdmin,
     getAdminDashboard,
     editUser,
     deleteUser,
     addNewUser,

}