import { useState , useEffect} from 'react';
import { useAdminLoginMutation } from '../slices/adminApiSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import { setAdminCredentials } from '../slices/adminAuthSlice'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loder from '../components/Loader';
import FormContainer from "../components/FormContainer";
import { Form, Button } from "react-bootstrap";

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [adminLogin, { isLoading }] = useAdminLoginMutation();

    const { adminInfo } = useSelector((state) => state.adminAuth);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await adminLogin({ email, password }).unwrap();
            dispatch(setAdminCredentials(res));
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error?.data?.message || error.error || 'An error occurred');
        }
    };

    useEffect(() => {
        if(adminInfo){
            navigate('/admin/dashboard')
        }
    },[navigate, adminInfo])

    return (
        <FormContainer>
            <h1>Admin Login</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </Form.Group>
                <Form.Group className="my-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Enter Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </Form.Group>
                {isLoading && <Loder />}
                <Button type="submit" variant="primary" className="mt-3">
                    Sign In
                </Button>
            </Form>
        </FormContainer>
    );
}

export default AdminLogin;
