import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import { useUpdateUserMutation } from "../slices/usersApiSlice"; 
import Loader from "../components/Loader";
import './ProfileScreen.css';

const ProfileScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePicture, setProfileImage] = useState(null); 
    const [imagePreview, setImagePreview] = useState("");

    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    
    const [updateProfile, { isLoading }] = useUpdateUserMutation();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);

            if (userInfo.profilePicture && Object.keys(userInfo.profilePicture).length > 0) {
                setImagePreview(userInfo.profilePicture.url);
               
            } else {
                setImagePreview("/path/to/default/avatar.png"); 
            }
        }
    }, [userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
    
        // if (password !== confirmPassword) {
        //     toast.error("Passwords do not match");
        //     return; 
        // }
    
        const formData = new FormData();
        formData.append('_id', userInfo._id);
        formData.append('name', name);
        formData.append('email', email);
        // formData.append('password', password);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture); 
        }
    
        try {
            const res = await updateProfile(formData).unwrap(); 
            dispatch(setCredentials({ ...res }));
            toast.success("Profile Updated");
        } catch (err) {
            toast.error(err.data?.message || err.error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file); 
        }
    };

    return (
        <FormContainer>
            <h1>Update Profile</h1>
            

             {/* Display existing profile picture */}
             {userInfo && (
                <div className="profile-image-container">
                    <img className="profile-image" src={userInfo.profilePicture || '/path/to/default-image.jpg'} alt={userInfo.name}/>
                </div>
            )}

            <Form onSubmit={submitHandler}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                {/* <Form.Group controlId="password">
                    <Form.Label>Password (Optional)</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group> */}

                <Form.Group controlId="profileImage">
                    <Form.Label>Profile Image</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Profile Preview"
                            style={{ width: "200px", height: "200px", marginTop: "10px" }}
                        />
                    )}
                </Form.Group>

                {isLoading && <Loader />} 

                <Button type="submit" variant="primary" className="mt-3">
                   Update
                </Button>
            </Form>
        </FormContainer>
    );
    
};

export default ProfileScreen;
