import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return /\.(jpg|jpeg|png|gif)$/.test(v); 
            },
            message: props => `${props.value} is not a valid image format! Only JPG, JPEG, PNG, and GIF are allowed.`
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
   if(!this.isModified('password')){
        next();
   } 

   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPasswords = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("Users", userSchema);

export default User;
